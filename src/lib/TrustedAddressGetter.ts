import { Constants, Deployment } from '../constants/constants';
import { ContractType } from '../constants/contractType';
import { NetworkType } from '../constants/networkTypes';

export class TrustedAddressGetter {
  static get(contractType: ContractType, networkType: NetworkType) {
    const deployment = this.getDeployment(networkType);
    return this.getChecksum(deployment, contractType);
  }

  private static getDeployment(networkType: NetworkType) {
    return Constants.deployments[networkType];
  }

  private static getChecksum(deployment: Deployment, contractType: ContractType) {
    return deployment[contractType].checksum;
  }
}
