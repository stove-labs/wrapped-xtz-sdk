import { Constants, Deployment } from '../../constants/constants';
import { ContractType } from '../../enums/contractTypes';
import { NetworkType } from '../../enums/networkTypes';
import { checksum } from '../../types/types';

export class DeploymentsPropertyGetter {
  static getChecksum(contractType: ContractType, networkType: NetworkType) {
    const deployment: Deployment = this.getDeployment(networkType);
    return this.getChecksumFromTrustedDeployment(deployment, contractType);
  }

  static getAddress(contractType: ContractType, networkType: NetworkType) {
    const deployment: Deployment = this.getDeployment(networkType);
    const address = this.getAddressFromTrustedDeployment(deployment, contractType);
    if (address === undefined)
      throw new Error(`No trusted address known for network ${networkType} and contract of type ${contractType}`);
    return address;
  }

  private static getDeployment(networkType: NetworkType): Deployment {
    return Constants.deployments[networkType];
  }

  private static getChecksumFromTrustedDeployment(deployment: Deployment, contractType: ContractType): checksum {
    return deployment[contractType].checksum;
  }

  private static getAddressFromTrustedDeployment(
    deployment: Deployment,
    contractType: ContractType
  ): string | undefined {
    return deployment[contractType].address;
  }
}
