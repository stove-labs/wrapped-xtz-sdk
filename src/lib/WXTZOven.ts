import {
  Contract,
  ContractAbstraction,
  ContractMethod,
  ContractProvider,
  TezosToolkit,
  UnitValue,
  Wallet,
} from '@taquito/taquito';
import axios from 'axios';

import { deployments } from '../constants/deployments';
import { IndexerUrl } from '../constants/indexer';
import { NetworkType } from '../constants/networkType';
import {
  address,
  blockHeight,
  CoreContractStorage,
  delegate,
  mutez,
  OvenContractStorage,
  TezosBalance,
  wXTZConfig,
} from '../types/types';

// TODO reorder functions in class (public/private)
export class WXTZOven {
  readonly ovenAddress: address;
  private Tezos: TezosToolkit;
  // TODO remove ! from oven- and coreInstance and handle errors (eg. "not initialized")
  private ovenInstance!: ContractAbstraction<ContractProvider | Wallet>;
  private coreInstance!: ContractAbstraction<ContractProvider | Wallet>;
  public network: NetworkType;
  private checkIntegrity: boolean;

  constructor(ovenContract: address, wXTZConfig: wXTZConfig) {
    this.ovenAddress = ovenContract;
    this.Tezos = wXTZConfig.tezos;
    this.network = wXTZConfig.network;
    this.checkIntegrity = wXTZConfig.checkIntegrity ?? true;
  }

  private async failIfNotOriginatedByTrustedCore(): Promise<void> {
    const coreContractAddress = await this.getCoreContractAddress();

    const trustedCore = coreContractAddress === deployments[this.network].core.address;
    if (trustedCore == false) {
      throw new Error('Oven was not originated by trusted core contract.');
    }
  }

  public async initialize(): Promise<WXTZOven> {
    this.ovenInstance = await this.Tezos.contract.at(this.ovenAddress);
    if (this.checkIntegrity === true) {
      await this.failIfNotOriginatedByTrustedCore();
    }
    return this;
  }

  private async getOvenContractStorage(): Promise<OvenContractStorage> {
    return await this.ovenInstance.storage();
  }

  public async getCoreContractAddress(): Promise<address> {
    return await this.getOvenContractStorage();
  }

  private async initializeCoreContractInstance(): Promise<ContractAbstraction<ContractProvider | Wallet>> {
    const coreContractAddress: address = await this.getCoreContractAddress();
    this.coreInstance = await this.Tezos.contract.at(coreContractAddress);
    return this.coreInstance;
  }

  private async getCoreContractStorage(): Promise<CoreContractStorage> {
    await this.initializeCoreContractInstance();
    return await this.coreInstance.storage();
  }

  public async getOvenOwner(): Promise<address> {
    return (await this.getCoreContractStorage()).ovens.get(this.ovenAddress);
  }

  public async getDelegate(): Promise<delegate> {
    try {
      return await this.Tezos.rpc.getDelegate(this.ovenAddress);
    } catch {
      return null;
    }
  }

  public async getOriginatedAt(): Promise<Date> {
    const indexerUrl = IndexerUrl.contractHistory[this.network];
    const response = await axios.get(`${indexerUrl}/${this.ovenAddress}`);
    return new Date(response.data.timestamp);
  }

  public async getOriginatedAtLevel(): Promise<blockHeight> {
    const indexerUrl = IndexerUrl.contractHistory[this.network];
    const response = await axios.get(`${indexerUrl}/${this.ovenAddress}`);
    return response.data.level;
  }

  public async getUpdatedAt(): Promise<Date> {
    const indexerUrl = IndexerUrl.contractHistory[this.network];
    const response = await axios.get(`${indexerUrl}/${this.ovenAddress}`);
    return new Date(response.data.last_action);
  }

  //   public async getLastStates(): Promise<any> {
  //     const indexerUrl = IndexerUrl.contractHistory[this.network];
  //     const response = await axios.get(`${indexerUrl}/operations`, {
  //       params: {
  //         status: 'applied',
  //       },
  //     });
  //     const operationsHistory = response.data;
  //     return;
  //   }

  public async getBalance(): Promise<TezosBalance> {
    return await this.Tezos.tz.getBalance(this.ovenAddress);
  }

  /**
   * Provide the amount to be deposited as sendParameter when calling .send()
   * on this ContractMethod.
   */
  public async deposit(): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.ovenInstance.methods.default(UnitValue);
  }

  /**
   * Need to call .send() on this ContractMethod.
   *
   * @param amount Amount in mutez to withdraw from the oven.
   */
  public async withdraw(amount: mutez): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.ovenInstance.methods.withdraw(amount);
  }

  /**
   *  Need to call .send() on this ContractMethod.
   *
   * @param delegate Provide a registered baker as delegate.
   */
  public async setDelegate(delegate: delegate): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.ovenInstance.methods.setDelegate(delegate);
  }

  public async removeDelegate(): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.setDelegate(null);
  }
}
