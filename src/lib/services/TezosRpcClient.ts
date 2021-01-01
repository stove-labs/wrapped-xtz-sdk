import axios, { AxiosInstance } from 'axios';

import { address, contractInfoFromRpc } from '../types';

export class TezosRpcClient {
  public static async fetchContractCode(contractAddress: address, rpcUrl: string): Promise<string> {
    const tezosRpcClient = await this.create(rpcUrl);
    const response = await tezosRpcClient.get<contractInfoFromRpc>(this.getContractInfoEndpoint(contractAddress));
    const contractInfoFromRpc = response.data;
    const contractCode = JSON.stringify(contractInfoFromRpc.script.code);
    return contractCode;
  }

  private static getContractInfoEndpoint(contractAddress: address): string {
    return `/chains/main/blocks/head/context/contracts/${contractAddress}`;
  }

  private static async create(rpcUrl: string): Promise<AxiosInstance> {
    return axios.create({
      baseURL: rpcUrl,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
