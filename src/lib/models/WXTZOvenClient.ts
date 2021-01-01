import { ContractMethod, ContractProvider, UnitValue, Wallet } from '@taquito/taquito';

import { ContractType } from '../../enums/contractTypes';
import { BlockchainIndexerClient } from '../services/BlockchainIndexerClient';
import { DeploymentsPropertyGetter } from '../services/DeploymentsPropertyGetter';
import {
  address,
  blockHeight,
  contractDetail,
  delegate,
  mutez,
  OvenContractStorage,
  TezosBalance,
  wXTZConfig,
} from '../types';

import { WXTZBaseClient } from './WXTZBaseClient';

export class WXTZOvenClient extends WXTZBaseClient {
  constructor(ovenContract: address, wXTZConfig: wXTZConfig) {
    super(ovenContract, wXTZConfig, ContractType.oven);
  }

  public async initialize(): Promise<WXTZOvenClient> {
    await super.Initialize();
    if (!this.checkIntegrity) await this.throwErrorIfNotOriginatedByTrustedCore();
    return this;
  }

  public async getCoreAddress(): Promise<address> {
    return await this.getStorage();
  }

  public getOvenAddress(): address {
    return this.instance.address;
  }

  /**
   * Returns the address of the baker this oven has delegated to.
   */
  public async getDelegate(): Promise<delegate> {
    try {
      return await this.Tezos.rpc.getDelegate(this.getOvenAddress());
    } catch (err) {
      if (err.status == 404) return null;
      throw err;
    }
  }

  /**
   * Returns the date and time this oven was created.
   */
  public async getOriginatedAt(): Promise<Date> {
    return new Date((await this.getContractInfo()).timestamp);
  }

  /**
   * Returns the block height when this oven was created.
   */
  public async getOriginatedAtLevel(): Promise<blockHeight> {
    return await (await this.getContractInfo()).level;
  }

  /**
   * Returns the last time of action for this oven.
   */
  public async getUpdatedAt(): Promise<Date> {
    return new Date((await this.getContractInfo()).last_action);
  }

  public async getLastStates(): Promise<any> {
    return await BlockchainIndexerClient.getContractHistory(this.getOvenAddress(), this.network);
  }

  /**
   * Returns the XTZ balance of this oven.
   */
  public async getBalance(): Promise<TezosBalance> {
    return await this.Tezos.tz.getBalance(this.getOvenAddress());
  }

  /**
   * Provide the amount to be deposited as sendParameter when calling .send()
   * on this ContractMethod.
   */
  public async deposit(): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.instance.methods.default(UnitValue);
  }

  /**
   * Need to call .send() on this ContractMethod.
   *
   * @param amount Amount in mutez to withdraw from the oven.
   */
  public async withdraw(amount: mutez): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.instance.methods.withdraw(amount);
  }

  /**
   * Need to call .send() on this ContractMethod.
   *
   * @param delegate Provide a registered baker as delegate.
   */
  public async setDelegate(delegate: delegate): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.instance.methods.setDelegate(delegate);
  }

  /**
   * Removes delegate for this oven.
   * Need to call .send() on this ContractMethod.
   */
  public async removeDelegate(): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.setDelegate(null);
  }

  private async throwErrorIfNotOriginatedByTrustedCore(): Promise<void> {
    const coreContractAddress = await this.getCoreAddress();
    const trustedCore = coreContractAddress === DeploymentsPropertyGetter.getAddress(ContractType.core, this.network);
    if (trustedCore == false) {
      throw new Error('Oven was not originated by trusted core contract.');
    }
  }

  private async getStorage(): Promise<OvenContractStorage> {
    return await this.instance.storage();
  }

  private async getContractInfo(): Promise<contractDetail> {
    return await BlockchainIndexerClient.getContractInfo(this.getOvenAddress(), this.network);
  }
}
