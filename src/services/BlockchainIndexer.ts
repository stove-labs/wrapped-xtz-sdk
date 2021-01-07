import axios from 'axios';
import BigNumber from 'bignumber.js';

import { NetworkType } from '../enums';
import { address, contractDetails, ovenBcdResponse } from '../types';

export async function getBigMapKeysByValue(
  bigMapId: BigNumber,
  value: string,
  indexerUrl: string,
  network: NetworkType
): Promise<ovenBcdResponse[]> {
  const response = await axios.get<ovenBcdResponse[]>(indexerUrl + getBigMapEndpoint(value, bigMapId, network));
  const ovenBcdResponse = response.data;
  return ovenBcdResponse;
}

export async function getContractInfo(
  address: address,
  indexerUrl: string,
  network: NetworkType
): Promise<contractDetails> {
  const response = await axios.get(indexerUrl + getContractEndpoint(address, network));
  const contractDetails: contractDetails = {
    originatedAtDate: response.data.timestamp,
    originatedAtHeight: response.data.level,
    lastAction: response.data.last_action,
  };
  return contractDetails;
}

// TODO
export async function getContractHistory(address: address, indexerUrl: string, network: NetworkType) {
  const response = await axios.get(indexerUrl + getContractOperationsEndpoint(address, network));
  console.log(indexerUrl + getContractOperationsEndpoint(address, network));
  return response.data;
}

function getBigMapEndpoint(value: string, bigMapId: BigNumber, network: NetworkType): string {
  return `/v1/bigmap/${network}/${bigMapId.toNumber()}/keys?q=${value}&offset=0`;
}

function getContractEndpoint(address: address, network: NetworkType): string {
  return `/v1/contract/${network}/${address}`;
}

function getContractOperationsEndpoint(address: address, network: NetworkType): string {
  return `${getContractEndpoint(address, network)}/operations?status=applied`;
}
