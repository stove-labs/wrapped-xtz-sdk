import { Constants } from '../../constants/constants';
import { ContractType } from '../../enums/contractTypes';
import { ovenOwner, tokenAddress, TokenContractStorage, WrappedXTZBalance, wXTZConfig } from '../types';

import { WXTZBaseClient } from './WXTZBaseClient';

export class WXTZTokenClient extends WXTZBaseClient {
  constructor(tokenAddress: tokenAddress, wXTZConfig: wXTZConfig) {
    super(tokenAddress, wXTZConfig, ContractType.token);
  }
  public async initialize() {
    super.Initialize();
  }

  public async getTotalSupply(): Promise<WrappedXTZBalance> {
    return (await this.getStorage()).token.totalSupply;
  }

  // if no balance found for given token owner, return default balance of 0
  public async getWXTZBalance(ovenOwner: ovenOwner): Promise<WrappedXTZBalance> {
    const balance = (await this.getStorage()).token.ledger.get(ovenOwner) || Constants.defaultBalance;
    return balance;
  }

  private async getStorage(): Promise<TokenContractStorage> {
    return await this.instance.storage();
  }
}