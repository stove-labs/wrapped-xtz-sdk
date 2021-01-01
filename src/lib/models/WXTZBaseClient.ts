import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';

import { ContractType } from '../../enums/contractTypes';
import { NetworkType } from '../../enums/networkTypes';
import { ByteConversionUtils } from '../services/ByteConversionUtils';
import { DeploymentsPropertyGetter } from '../services/DeploymentsPropertyGetter';
import { TezosRpcClient } from '../services/TezosRpcClient';
import { address, wXTZConfig } from '../types';

export abstract class WXTZBaseClient {
  protected instance!: ContractAbstraction<ContractProvider | Wallet>;
  protected Tezos: TezosToolkit;
  protected network: NetworkType;
  protected checkIntegrity: boolean;
  private readonly contractType: ContractType;
  private readonly address;

  constructor(address: address, wXTZConfig: wXTZConfig, contractType: ContractType) {
    this.address = address;
    this.Tezos = wXTZConfig.tezos;
    this.network = wXTZConfig.network;
    // default behavior is to check for integrity
    this.checkIntegrity = wXTZConfig.checkIntegrity ?? true;
    this.contractType = contractType;
  }

  protected async Initialize(): Promise<void> {
    this.instance = await this.Tezos.contract.at(this.address);
    if (this.checkIntegrity === true) {
      await this.verifyThatIntegrityIsValid();
    }
    // TODO check whether address matches with saved address in deployments
  }

  private async verifyThatIntegrityIsValid(): Promise<void> {
    const validIntegrity = await this.checkContractIntegrity();

    if (validIntegrity == false) {
      throw new Error('Contract does not pass checksum check');
    }
  }

  private async checkContractIntegrity(): Promise<boolean> {
    const contractCodeMicheline = await TezosRpcClient.fetchContractCode(this.address, this.Tezos.rpc.getRpcUrl());
    const checksum = DeploymentsPropertyGetter.getChecksum(this.contractType, this.network);
    return await ByteConversionUtils.checkIntegrity(checksum, contractCodeMicheline);
  }
}
