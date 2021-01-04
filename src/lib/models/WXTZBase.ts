import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';

import { ContractType } from '../../enums/contractTypes';
import { NetworkType } from '../../enums/networkTypes';
import { checkIntegrity } from '../services/ByteConversionUtils';
import { address, Deployment, wXTZConfig } from '../types';

export abstract class WXTZBase<T> {
  protected instance!: ContractAbstraction<ContractProvider | Wallet>;
  protected Tezos: TezosToolkit;
  protected network: NetworkType;
  private readonly contractType: ContractType;
  private readonly address;
  protected readonly deployment: Deployment;

  constructor(address: address, contractType: ContractType, wXTZConfig: wXTZConfig, deployment: Deployment) {
    this.address = address;
    this.Tezos = wXTZConfig.tezos;
    this.network = wXTZConfig.network;
    this.contractType = contractType;
    this.deployment = deployment;
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
