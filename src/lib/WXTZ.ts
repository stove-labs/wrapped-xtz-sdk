import { ContractAbstraction, ContractMethod, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';
import axios from 'axios';
import BigNumber from 'bignumber.js';

import { IndexerUrl } from '../constants/indexer';
import { MichelsonType } from '../constants/michelsonTypes';
import { Network } from '../constants/networks';
import {
  address,
  arbitraryValue,
  arbitraryValueKey,
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

import { packMichelson, unpack } from './WXTZHelpers';
import { WXTZOven } from './WXTZOven';

export const doubleDouble = (value: number) => {
  return value * 2;
};

export class WXTZ {
  readonly coreAddress: address;
  // TODO remove ! from instance and handle errors (eg. "not initialized")
  public instance!: ContractAbstraction<ContractProvider | Wallet>;
  private Tezos: TezosToolkit;
  public network: Network;

  constructor(coreAddress: address, wXTZConfig: wXTZConfig) {
    this.coreAddress = coreAddress;
    this.Tezos = wXTZConfig.tezos;
    this.network = wXTZConfig.network;
  }

  public getCoreAddress(): address {
    return this.instance.address;
  }

  public async initialize(): Promise<WXTZ> {
    this.instance = await this.Tezos.contract.at(this.coreAddress);
    return this;
  }

  public async getWXTZTokenContractAddress() {
    return await this.getArbitraryValue('wXTZTokenContractAddress', MichelsonType.wXTZTokenContractAddress);
  }

  private async getStorage(): Promise<CoreContractStorage> {
    return await this.instance.storage();
  }

  private async getPackedArbitraryValue(key: arbitraryValueKey): Promise<packedArbitraryValue> {
    return await (await this.getStorage()).arbitraryValues.get(key);
  }

  private async getArbitraryValue(key: arbitraryValueKey, michelsonType: michelsonType): Promise<arbitraryValue> {
    const packedArbitraryValue = await this.getPackedArbitraryValue(key);
    return unpack(packedArbitraryValue, michelsonType);
  }

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

    const wXTZConfig: wXTZConfig = { tezos: this.Tezos, network: this.network };
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
        const ovenBalance: BigNumber = await this.Tezos.tz.getBalance(oven.ovenContract);
        totalLockedXTZ = totalLockedXTZ.plus(ovenBalance);
      })
    );
    return totalLockedXTZ;
  }
}
