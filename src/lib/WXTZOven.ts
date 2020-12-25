import {
  Contract,
  ContractAbstraction,
  ContractMethod,
  ContractProvider,
  TezosToolkit,
  Wallet,
} from '@taquito/taquito';
import { TransactionOperation } from '@taquito/taquito/dist/types/operations/transaction-operation';
import axios from 'axios';

import { IndexerUrl } from '../constants/indexer';
import { Network } from '../constants/networks';
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
  readonly ovenContract: address;
  private Tezos: TezosToolkit;
  // TODO remove ! from oven- and coreInstance and handle errors (eg. "not initialized")
  private ovenInstance!: ContractAbstraction<ContractProvider | Wallet>;
  private coreInstance!: ContractAbstraction<ContractProvider | Wallet>;
  public network: Network;

  constructor(ovenContract: address, wXTZConfig: wXTZConfig) {
    this.ovenContract = ovenContract;
    this.Tezos = wXTZConfig.tezos;
    this.network = wXTZConfig.network;
  }

  public async initialize(): Promise<WXTZOven> {
    this.ovenInstance = await this.Tezos.contract.at(this.ovenContract);
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
    return (await this.getCoreContractStorage()).ovens.get(this.ovenContract);
  }

  public async getDelegate(): Promise<delegate> {
    try {
      return await this.Tezos.rpc.getDelegate(this.ovenContract);
    } catch {
      return null;
    }
  }

  public async getOriginatedAt(): Promise<Date> {
    const indexerUrl = IndexerUrl.contractHistory[this.network];
    const response = await axios.get(`${indexerUrl}/${this.ovenContract}`);
    return new Date(response.data.timestamp);
  }

  public async getOriginatedAtLevel(): Promise<blockHeight> {
    const indexerUrl = IndexerUrl.contractHistory[this.network];
    const response = await axios.get(`${indexerUrl}/${this.ovenContract}`);
    return response.data.level;
  }

  public async getUpdatedAt(): Promise<Date> {
    const indexerUrl = IndexerUrl.contractHistory[this.network];
    const response = await axios.get(`${indexerUrl}/${this.ovenContract}`);
    return new Date(response.data.last_action);
  }

  //   /**
  //    *
  //    * @param amount Amount of mutez to be deposited in the oven.
  //    */
  //   public async deposit(amount: mutez): Promise<TransactionOperation> {
  //     return this.Tezos.contract.transfer({
  //       to: this.ovenContract,
  //       amount: amount,
  //       mutez: true,
  //     });
  //   }

  //   public async withdraw(amount: mutez): Promise<ContractMethod<ContractProvider | Wallet>> {
  //     return this.ovenInstance.methods.withdraw(amount);
  //   }

  //   public async setDelegate(delegate: delegate): Promise<ContractMethod<ContractProvider | Wallet>> {
  //     return this.ovenInstance.methods.setDelegate(delegate);
  //   }
}
