import { WXTZBase } from './WXTZBase';
import { ContractType } from './enums';
import { Deployment, ovenOwner, tokenAddress, TokenContractStorage, WrappedXTZBalance, wXTZConfig } from './types';
import { defaultBalance } from './tzip7Constants';

export class WXTZToken extends WXTZBase<WXTZToken> {
  constructor(tokenAddress: tokenAddress, wXTZConfig: wXTZConfig, deployment: Deployment) {
    super(tokenAddress, ContractType.token, wXTZConfig, deployment);
  }

  public async getTotalSupply(): Promise<WrappedXTZBalance> {
    return (await this.getStorage()).token.totalSupply;
  }

  // if no balance found for given token owner, return default balance of 0
  public async getWXTZBalance(ovenOwner: ovenOwner): Promise<WrappedXTZBalance> {
    const balance = (await this.getStorage()).token.ledger.get(ovenOwner) || defaultBalance;
    return balance;
  }

  private async getStorage(): Promise<TokenContractStorage> {
    return await this.instance.storage();
  }
}
