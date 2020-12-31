import { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { ContractType } from '../constants/contractTypes';
import { MichelsonTypes } from '../constants/michelsonTypes';
import {
  address,
  arbitraryValue,
  arbitraryValueKey,
  bytes,
  CoreContractStorage,
  lambdaName,
  lambdaParameter,
  michelsonType,
  ovenOwner,
  packedArbitraryValue,
  TezosBalance,
  wXTZConfig,
} from '../types/types';

import { AllOvensByOwnerGetter } from './AllOvensByOwnerGetter';
import { DeploymentsGetter } from './DeploymentsGetter';
import { TotalXTZGetter } from './TotalXTZGetter';
import { WXTZBaseSmartContract } from './WXTZBaseSmartContract';
import { checkIntegrity, packMichelson, unpack } from './WXTZHelpers';

export class WXTZ extends WXTZBaseSmartContract {
  public instance!: ContractAbstraction<ContractProvider | Wallet>;

  public constructor(coreAddress: address, wXTZConfig: wXTZConfig) {
    super(coreAddress, wXTZConfig, ContractType.core);
  }

  public async initialize(): Promise<WXTZ> {
    await super.Initialize();
    return this;
  }

  public getCoreAddress(): address {
    return this.instance.address;
  }

  public async getWXTZTokenContractAddress() {
    return await this.getArbitraryValue('wXTZTokenContractAddress', MichelsonTypes.wXTZTokenContractAddress);
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
    // make sure that the create oven method of the core smart contract passes the checksum
    if (this.checkIntegrity) await this.verifyCreateOvenMethod();

    const lambdaParameter = this.composeLambdaParameterCreateOven(delegate, ovenOwner);
    return this.runEntrypointLambda('createOven', lambdaParameter);
  }

  public async getAllOvenAddressesByOwner(ovenOwner: ovenOwner): Promise<string[]> {
    const bigMapId = await this.getBigMapIdOvens();
    return await AllOvensByOwnerGetter.get(ovenOwner, bigMapId, this.network);
  }

  public async getTotalLockedXTZ(ovenOwner: ovenOwner): Promise<TezosBalance> {
    const allOvens = await this.getAllOvenAddressesByOwner(ovenOwner);
    return await TotalXTZGetter.get(allOvens, this.Tezos);
  }

  // TODO test
  public async getOwnerAddressForOven(ovenAddress: address): Promise<ovenOwner> {
    const ovenOwner = await (await this.getStorage()).ovens.get(ovenAddress);
    if (ovenOwner === undefined) throw new Error('No oven owner found for given oven address');
    return ovenOwner;
  }

  private async verifyCreateOvenMethod(): Promise<boolean> {
    const checksum = DeploymentsGetter.getChecksum(ContractType.lambdaCreateOven, this.network);
    const packedCreateOvenBytes = await this.getPackedLambda('entrypoint/createOven');
    return await checkIntegrity(checksum, packedCreateOvenBytes);
  }

  private composeLambdaParameterCreateOven(delegate: string | undefined, ovenOwner: string) {
    const delegateParameter = delegate !== undefined ? `Some "${delegate}"` : 'None';
    const code = `Pair ${delegateParameter} "${ovenOwner}"`;
    const lambdaParameter = packMichelson(code, MichelsonTypes.createOven);
    return lambdaParameter;
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

  private async runEntrypointLambda(
    lambdaName: lambdaName,
    lambdaParameter: lambdaParameter
  ): Promise<ContractMethod<ContractProvider | Wallet>> {
    return this.instance.methods.runEntrypointLambda(lambdaName, lambdaParameter);
  }

  private async getBigMapIdOvens(): Promise<BigNumber> {
    return (await this.getStorage()).ovens.id;
  }
}
