import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';

import { checkIntegrity } from './byteHelpers';
import { ContractType, NetworkType } from './enums';
import { address, Deployment, wXTZConfig } from './types';

export abstract class WXTZBase<T> {
  public readonly indexerUrl: string;
  protected instance!: ContractAbstraction<ContractProvider | Wallet>;
  protected Tezos: TezosToolkit;
  protected network: NetworkType;
  protected readonly deployment: Deployment;
  private readonly contractType: ContractType;
  private readonly address;

  constructor(address: address, contractType: ContractType, wXTZConfig: wXTZConfig, deployment: Deployment) {
    this.address = address;
    this.Tezos = wXTZConfig.tezos;
    this.network = wXTZConfig.network;
    this.contractType = contractType;
    this.deployment = deployment;
    this.indexerUrl = wXTZConfig.indexerUrl;
  }

  public async initialize(): Promise<WXTZBase<T>> {
    this.instance = await this.Tezos.contract.at(this.address);
    return this;
  }

  public getAddress(): address {
    return this.instance.address;
  }

  public async checkContractCode(): Promise<boolean> {
    const contractCode = (await this.Tezos.rpc.getScript(this.address)).code;
    const contractCodeString = JSON.stringify(contractCode);
    const checksum = this.deployment[this.contractType].checksum;
    return await checkIntegrity(checksum, contractCodeString);
  }

  public checkAddress(): boolean {
    const addressesMatchesDeployment = this.deployment[this.contractType].address === this.address;
    return addressesMatchesDeployment;
  }
}
