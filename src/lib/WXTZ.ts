import { ContractAbstraction, ContractMethod, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';
import axios from 'axios';
import BigNumber from 'bignumber.js';

import { ContractType } from '../constants/contractType';
import { deployments } from '../constants/deployments';
import { IndexerUrl } from '../constants/indexer';
import { MichelsonType } from '../constants/michelsonType';
import { NetworkType } from '../constants/networkType';
import {
  address,
  arbitraryValue,
  arbitraryValueKey,
  bytes,
  CoreContractStorage,
  lambdaName,
  lambdaParameter,
  michelsonType,
  ovenBcdResponse,
  ovenOwner,
  packedArbitraryValue,
  TezosBalance,
  wXTZConfig,
} from '../types/types';

import { checkIntegrity, fetchContractCode, packMichelson, sha256, unpack } from './WXTZHelpers';
import { WXTZOven } from './WXTZOven';

export class WXTZ {
  readonly coreAddress: address;
  // TODO remove ! from instance and handle errors (eg. "not initialized")
  public instance!: ContractAbstraction<ContractProvider | Wallet>;
  private Tezos: TezosToolkit;
  public network: NetworkType;
  private checkIntegrity: boolean;

  constructor(coreAddress: address, wXTZConfig: wXTZConfig) {
    this.coreAddress = coreAddress;
    this.Tezos = wXTZConfig.tezos;
    this.network = wXTZConfig.network;
    this.checkIntegrity = wXTZConfig.checkIntegrity ?? true;
  }

  public getCoreAddress(): address {
    return this.instance.address;
  }

  private async coreHasIntegrity(): Promise<boolean> {
    const contractCodeMicheline = await fetchContractCode(this.coreAddress, this.Tezos.rpc.getRpcUrl());
    return await checkIntegrity(deployments[this.network][ContractType.core].checksum, contractCodeMicheline);
  }

  private async ovenHasIntegrity(): Promise<boolean> {
    const packedCreateOvenBytes = await this.getPackedLambda('entrypoint/createOven');
    console.log('oven bytes', await sha256(packedCreateOvenBytes));
    return await checkIntegrity(deployments[this.network][ContractType.oven].checksum, packedCreateOvenBytes);
  }

  private async failIfNoIntegrity(): Promise<void> {
    const coreHasIntegrity = await this.coreHasIntegrity();
    const ovenHasIntegrity = await this.ovenHasIntegrity();

    const hasIntegrity = coreHasIntegrity && ovenHasIntegrity;
    if (hasIntegrity == false) {
      throw new Error('Contract does not pass checksum check');
    }
  }

  public async initialize(): Promise<WXTZ> {
    this.instance = await this.Tezos.contract.at(this.coreAddress);
    if (this.checkIntegrity === true) {
      await this.failIfNoIntegrity();
    }
    // TODO check whether address matches with saved address in deployments
    return this;
  }

  public async getWXTZTokenContractAddress() {
    return await this.getArbitraryValue('wXTZTokenContractAddress', MichelsonType.wXTZTokenContractAddress);
  }

  private async getStorage(): Promise<CoreContractStorage> {
    return await this.instance.storage();
  }

  private async getPackedLambda(key: lambdaName): Promise<bytes> {
    return await (await this.getStorage()).lambdas.get(key);
  }

  private async getPackedArbitraryValue(key: arbitraryValueKey): Promise<packedArbitraryValue> {
    return await (await this.getStorage()).arbitraryValues.get(key);
  }

  private async getArbitraryValue(key: arbitraryValueKey, michelsonType: michelsonType): Promise<arbitraryValue> {
    const packedArbitraryValue = await this.getPackedArbitraryValue(key);
    return unpack(packedArbitraryValue, michelsonType);
  }

  /**
   * Need to call .send() on this contract method to invoke the smart contract call.
   * Pass optional XTZ amount as sendParameter in .send().
   *
   * @param ovenOwner The address of the oven owner.
   * @param delegate The address of the registered baker.
   */
  public async createOven(
    ovenOwner: ovenOwner,
    delegate?: address
  ): Promise<ContractMethod<ContractProvider | Wallet>> {
    const delegateParameter = delegate !== undefined ? `Some "${delegate}"` : 'None';
    const code = `Pair ${delegateParameter} "${ovenOwner}"`;
    const lambdaParameter = packMichelson(code, MichelsonType.createOven);
    return this.runEntrypointLambda('createOven', lambdaParameter);
  }

  private async runEntrypointLambda(
    lambdaName: lambdaName,
    lambdaParameter: lambdaParameter
  ): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.instance.methods.runEntrypointLambda(lambdaName, lambdaParameter);
  }

  private async getBigMapIdOvens(): Promise<BigNumber> {
    return (await this.getStorage()).ovens.id;
  }

  public async getAllOvensByOwner(ovenOwner: ovenOwner): Promise<WXTZOven[]> {
    const bigMapId = (await this.getBigMapIdOvens()).toNumber();
    const indexerUrl = IndexerUrl.searchKeyByValue[this.network];
    const response = await axios.get(`${indexerUrl}/${bigMapId}/keys`, {
      params: {
        q: ovenOwner,
        offset: 0,
      },
    });

    const wXTZConfig: wXTZConfig = { tezos: this.Tezos, network: this.network, checkIntegrity: this.checkIntegrity };
    const ovens: WXTZOven[] = [];
    response.data.map((oven: ovenBcdResponse) => {
      ovens.push(new WXTZOven(oven.data.key_string, wXTZConfig));
    });
    return ovens;
  }

  public async getTotalLockedXTZ(ovenOwner: ovenOwner): Promise<TezosBalance> {
    const allOvens = await this.getAllOvensByOwner(ovenOwner);
    let totalLockedXTZ: TezosBalance = new BigNumber(0);
    await Promise.all(
      allOvens.map(async (oven: WXTZOven) => {
        const ovenBalance: BigNumber = await this.Tezos.tz.getBalance(oven.ovenAddress);
        totalLockedXTZ = totalLockedXTZ.plus(ovenBalance);
      })
    );
    return totalLockedXTZ;
  }
}
