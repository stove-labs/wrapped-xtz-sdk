import { ContractMethod, ContractProvider, UnitValue, Wallet } from '@taquito/taquito';

import { ContractType } from '../../enums/contractTypes';
import { BlockchainIndexerClient } from '../services/BlockchainIndexerClient';
import {
  address,
  contractDetails,
  delegate,
  Deployment,
  mutez,
  OvenContractStorage,
  TezosBalance,
  wXTZConfig,
} from '../types';

import { WXTZBase } from './WXTZBase';

export class WXTZOven extends WXTZBase<WXTZOven> {
  constructor(ovenAddress: address, wXTZConfig: wXTZConfig, deployment: Deployment) {
    super(ovenAddress, ContractType.oven, wXTZConfig, deployment);
  }

  public async getCoreAddress(): Promise<address> {
    return await this.getStorage();
  }

  /**
   * Returns baker address this oven has delegated to or null.
   */
  public async getDelegate(): Promise<delegate> {
    try {
      return await this.Tezos.rpc.getDelegate(this.getAddress());
    } catch (err) {
      if (err.status == 404) return null;
      throw err;
    }
  }

  public async getDetails(): Promise<contractDetails> {
    return await BlockchainIndexerClient.getContractInfo(this.getAddress(), this.network);
  }

  public async getLastStates(): Promise<any> {
    return await BlockchainIndexerClient.getContractHistory(this.getAddress(), this.network);
  }

  /**
   * Returns the XTZ balance of this oven.
   */
  public async getBalance(): Promise<TezosBalance> {
    return await this.Tezos.tz.getBalance(this.getAddress());
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

  private async getStorage(): Promise<OvenContractStorage> {
    return await this.instance.storage();
  }
}
