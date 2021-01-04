import axios, { AxiosInstance } from 'axios';
import BigNumber from 'bignumber.js';

import { Constants } from '../../constants/constants';
import { NetworkType } from '../../enums/networkTypes';
import { address, contractDetails, ovenBcdResponse } from '../types';

export class BlockchainIndexerClient {
  public static async getBigMapKeysByValue(
    bigMapId: BigNumber,
    value: string,
    network: NetworkType
  ): Promise<ovenBcdResponse[]> {
    const apiInstance = await this.create();
    const response = await apiInstance.get<ovenBcdResponse[]>(this.getBigMapEndpoint(value, bigMapId, network));
    const ovenBcdResponse = response.data;
    return ovenBcdResponse;
  }

  public static async getContractInfo(address: address, network: NetworkType): Promise<contractDetails> {
    const apiInstance = await this.create();
    const response = await apiInstance.get(this.getContractEndpoint(address, network));
    const contractDetails: contractDetails = {
      originatedAtDate: response.data.timestamp,
      originatedAtHeight: response.data.level,
      lastAction: response.data.last_action,
    };
    return contractDetails;
  }
  // TODO
  public static async getContractHistory(address: address, network: NetworkType) {
    return await this.getContractOperationsEndpoint(address, network);
  }

  private static getBigMapEndpoint(value: string, bigMapId: BigNumber, network: NetworkType): string {
    return `/v1/bigmap/${network}/${bigMapId.toNumber()}/keys?q=${value}&offset=0`;
  }

  private static getContractEndpoint(address: address, network: NetworkType): string {
    return `/v1/contract/${network}/${address}`;
  }

  private static getContractOperationsEndpoint(address: address, network: NetworkType): string {
    return `${this.getContractEndpoint(address, network)}/operations?status=applied`;
  }

  private static async create(): Promise<AxiosInstance> {
    return axios.create({
      baseURL: Constants.indexerBaseUrl,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
