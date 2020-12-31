import { Constants, Deployment } from '../constants/constants';
import { ContractType } from '../constants/contractTypes';
import { NetworkType } from '../constants/networkTypes';
import { checksum } from '../types/types';

export class DeploymentsGetter {
  /**
   * Returns checksum of trusted contract code.
   *
   * @param contractType Contract type in the wXTZ project.
   * @param networkType Network type.
   */
  static getChecksum(contractType: ContractType, networkType: NetworkType) {
    const deployment: Deployment = this.getDeployment(networkType);
    return this.getChecksumFromTrustedDeployment(deployment, contractType);
  }

  /**
   * Returns address of trusted deployments.
   *
   * @param contractType Contract type in the wXTZ project.
   * @param networkType Network type.
   */
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
