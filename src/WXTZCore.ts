import { ContractAbstraction, ContractMethod, ContractProvider, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { BCDApi } from './BCDApi';
import { WXTZBase } from './WXTZBase';
import { checkIntegrity, packMichelson, unpack } from './byteHelpers';
import { ContractType, MichelsonType } from './enums';
import {
  address,
  arbitraryValue,
  arbitraryValueKey,
  CoreContractStorage,
  Deployment,
  lambdaName,
  lambdaParameter,
  michelsonType,
  ovenOwner,
  packedArbitraryValue,
  packedLambda,
  TezosBalance,
  wXTZConfig,
} from './types';

export class WXTZCore extends WXTZBase<WXTZCore> {
  public instance!: ContractAbstraction<ContractProvider | Wallet>;
  private BCDApi: BCDApi;

  public constructor(coreAddress: address, wXTZConfig: wXTZConfig, deployment: Deployment) {
    super(coreAddress, ContractType.core, wXTZConfig, deployment);
    this.BCDApi = new BCDApi(wXTZConfig.indexerUrl, wXTZConfig.network);
  }

  public getCoreAddress(): address {
    return this.instance.address;
  }

  public async checkContractCodeIntegrity(): Promise<boolean> {
    const coreIntegrity = await super.checkContractCodeIntegrity();
    const lambdaCreateOvenIntegrity = await this.checkCreateOvenCodeIntegrity();
    return coreIntegrity && lambdaCreateOvenIntegrity;
  }

  public async getWXTZTokenContractAddress(): Promise<address> {
    return (await this.getArbitraryValue(
      'wXTZTokenContractAddress',
      MichelsonType.wXTZTokenContractAddress
    )) as address;
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
    const lambdaParameter = this.composeLambdaParameterCreateOven(delegate, ovenOwner);
    return this.runEntrypointLambda('createOven', lambdaParameter);
  }

  public async getAllOvenAddressesByOwner(ovenOwner: ovenOwner): Promise<address[]> {
    const bigMapId = await this.getBigMapIdOvens();

    return await this.BCDApi.getOvenAddressesByOwner(bigMapId, ovenOwner);
  }

  public async getTotalLockedXTZ(ovenOwner: ovenOwner): Promise<TezosBalance> {
    const allOvenAddresses = await this.getAllOvenAddressesByOwner(ovenOwner);

    return await this.getTotalXTZBalance(allOvenAddresses);
  }

  // TODO test
  public async getOwnerAddressForOven(ovenAddress: address): Promise<ovenOwner> {
    const ovenOwner = await (await this.getStorage()).ovens.get(ovenAddress);
    if (ovenOwner === undefined) throw new Error('No oven owner found for given oven address');
    return ovenOwner;
  }

  private async checkCreateOvenCodeIntegrity(): Promise<boolean> {
    const checksum = this.deployment[ContractType.core].checksum;
    const packedCreateOvenBytes = await this.getPackedLambda('entrypoint/createOven');
    return await checkIntegrity(checksum, packedCreateOvenBytes);
  }

  private composeLambdaParameterCreateOven(delegate: string | undefined, ovenOwner: string) {
    const delegateParameter = delegate !== undefined ? `Some "${delegate}"` : 'None';
    const code = `Pair ${delegateParameter} "${ovenOwner}"`;
    const lambdaParameter = packMichelson(code, MichelsonType.createOven);
    return lambdaParameter;
  }

  private async getStorage(): Promise<CoreContractStorage> {
    return await this.instance.storage();
  }

  private async getPackedLambda(key: lambdaName): Promise<packedLambda> {
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

  private async getTotalXTZBalance(addresses: address[]): Promise<TezosBalance> {
    const balances: TezosBalance[] = await this.getBalances(addresses);

    return this.sumBalances(balances);
  }

  private async getBalances(addresses: address[]): Promise<TezosBalance[]> {
    const balancePromises = addresses.map((address) => this.Tezos.tz.getBalance(address));

    return await Promise.all(balancePromises);
  }

  private sumBalances(balances: TezosBalance[]): TezosBalance {
    return balances.reduce((totalBalance, balance) => totalBalance.plus(balance), new BigNumber(0));
  }
}
