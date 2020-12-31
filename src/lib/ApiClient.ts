import axios, { AxiosError } from 'axios';
import BigNumber from 'bignumber.js';

import { Constants } from '../constants/constants';
import { NetworkType } from '../constants/networkTypes';
import { address, contractDetail, ovenBcdResponse } from '../types/types';

export class ApiClient {
  /**
   * Returns all keys for a given value in a big map.
   *
   * @param value Value in the big map.
   * @param bigMapId ID of the big map.
   * @param network Network type.
   */
  public static async getKeysByValue(
    value: string,
    bigMapId: BigNumber,
    network: NetworkType
  ): Promise<ovenBcdResponse[]> {
    try {
      const apiInstance = await this.create();
      const response = await apiInstance.get<ovenBcdResponse[]>(this.getBigMapEndpoint(value, bigMapId, network));
      const ovenBcdResponse = response.data;
      return ovenBcdResponse;
    } catch (err) {
      if (err & err.response) {
        const axiosError = err as AxiosError;
        return axiosError.response?.data;
      }
      throw err;
    }
  }

  /**
   * Returns general information on a smart contract.
   *
   * @param address KT1... address of the smart contract.
   * @param network Network type.
   */
  public static async getContractInfo(address: address, network: NetworkType): Promise<contractDetail> {
    try {
      const apiInstance = await this.create();
      const response = await apiInstance.get(this.getContractEndpoint(address, network));
      const contractInfo = response.data;
      return contractInfo;
    } catch (err) {
      if (err & err.response) {
        const axiosError = err as AxiosError;
        return axiosError.response?.data;
      }
      throw err;
    }
  }
  // TODO
  public static async getContractHistory(address: address, network: NetworkType) {
    return await this.getContractOperationsEndpoint(address, network);
  }

  private static getBigMapEndpoint(value: string, bigMapId: BigNumber, network: NetworkType) {
    return `/v1/bigmap/${network}/${bigMapId.toNumber()}/keys?q=${value}&offset=0`;
  }

  private static getContractEndpoint(address: address, network: NetworkType) {
    return `/v1/contract/${network}/${address}`;
  }

  private static getContractOperationsEndpoint(address: address, network: NetworkType) {
    return `${this.getContractEndpoint(address, network)}/operations?status=applied`;
  }

  private static async create() {
    return axios.create({
      baseURL: Constants.indexerBaseUrl,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
