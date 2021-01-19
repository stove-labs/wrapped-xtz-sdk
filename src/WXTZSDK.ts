import { WXTZCore } from './WXTZCore';
import { WXTZOven } from './WXTZOven';
import { WXTZToken } from './WXTZToken';
import defaultDeployments from './deployments.json';
import { address, Deployment, WrappedXTZBalance, wXTZConfig } from './types';

export class WXTZSDK extends WXTZCore {
  public deployment: Deployment;
  // TODO avoid force unwrap
  public token!: WXTZToken;
  private wXTZConfig: wXTZConfig;

  private constructor(coreAddress: address, wXTZConfig: wXTZConfig, deployment?: Deployment) {
    // use default deployment if no deployment was provided
    const deploymentProperty = deployment !== undefined ? deployment : defaultDeployments[wXTZConfig.network];
    super(coreAddress, wXTZConfig, deploymentProperty);
    this.deployment = deploymentProperty;
    this.wXTZConfig = wXTZConfig;
  }

  public oven(ovenAddress: address): WXTZOven {
    return new WXTZOven(ovenAddress, this.wXTZConfig, this.deployment);
  }

  public static async at(coreAddress: address, wXTZConfig: wXTZConfig, deployment?: Deployment): Promise<WXTZSDK> {
    const wxtz = new WXTZSDK(coreAddress, wXTZConfig, deployment);
    await wxtz.initialize();

    const tokenContractAddress = await wxtz.getWXTZTokenContractAddress();
    wxtz.token = await new WXTZToken(tokenContractAddress, wXTZConfig, wxtz.deployment);
    await wxtz.token.initialize();
    return wxtz;
  }

  public async checkCodeIntegrity(): Promise<boolean> {
    const coreValid = await this.checkContractCodeIntegrity();
    const tokenValid = await this.token.checkContractCodeIntegrity();
    return coreValid && tokenValid;
  }

  public async getAllOvensByOwner(ovenOwner: address): Promise<WXTZOven[]> {
    const allOvens: address[] = await this.getAllOvenAddressesByOwner(ovenOwner);
    return allOvens.map((ovenAddress: address) => new WXTZOven(ovenAddress, this.wXTZConfig, this.deployment));
  }

  public async getTotalSupply(): Promise<WrappedXTZBalance> {
    return this.token.getTotalSupply();
  }

  public async getBalance(ovenOwner: address): Promise<WrappedXTZBalance> {
    return this.token.getWXTZBalance(ovenOwner);
  }
}
