import axios from 'axios';
import BigNumber from 'bignumber.js';

import { NetworkType } from './enums';
import { address, contractDetails, ovenBcdResponse } from './types';

export class BCDApi {
  constructor(private indexerUrl: string, private network: NetworkType) {}

  public async getOvenAddressesByOwner(bigMapId: BigNumber, value: string): Promise<address[]> {
    const response = await axios.get<ovenBcdResponse[]>(this.indexerUrl + this.getBigMapEndpoint(value, bigMapId));
    const ovenBcdResponse = response.data;

    return await this.extractOvenAddresses(ovenBcdResponse);
  }

  public async getContractInfo(address: address): Promise<contractDetails> {
    const response = await axios.get(this.indexerUrl + this.getContractEndpoint(address));
    const contractDetails: contractDetails = {
      originatedAtDate: response.data.timestamp,
      originatedAtHeight: response.data.level,
      lastAction: response.data.last_action,
    };
    return contractDetails;
  }

  // TODO
  public async getContractHistory(address: address) {
    const response = await axios.get(this.indexerUrl + this.getContractOperationsEndpoint(address));
    return response.data;
  }

  private async extractOvenAddresses(ovensWithDetail: ovenBcdResponse[]): Promise<address[]> {
    const ovens: string[] = ovensWithDetail.map((ovenWithDetail: ovenBcdResponse) => {
      const ovenAddress = ovenWithDetail.data.key_string;
      return ovenAddress;
    });
    return ovens;
  }

  private getBigMapEndpoint(value: string, bigMapId: BigNumber): string {
    return `/v1/bigmap/${this.network}/${bigMapId.toNumber()}/keys?q=${value}&offset=0`;
  }

  private getContractEndpoint(address: address): string {
    return `/v1/contract/${this.network}/${address}`;
  }

  private getContractOperationsEndpoint(address: address): string {
    return `/v1/contract/${this.network}/${address}/operations?status=applied`;
  }
}
