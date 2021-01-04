import BigNumber from 'bignumber.js';

import { NetworkType } from '../../enums/networkTypes';
import { ovenBcdResponse, ovenOwner } from '../types';

import { BlockchainIndexerClient } from './BlockchainIndexerClient';

/**
 * Returns all oven addresses for a given owner address.
 *
 * @param ovenOwner Address of the oven owner.
 * @param bigMapOvenIds ID of the big map that holds all oven to oven owner mappings.
 * @param network Network type.
 */
export async function getAllOvenAddressesByOwner(
  ovenOwner: ovenOwner,
  bigMapOvenId: BigNumber,
  network: NetworkType
): Promise<string[]> {
  const ovenMappings = await fetchOvenToOwnerMappings(ovenOwner, bigMapOvenId, network);
  const ovens = extractOvenAddresses(ovenMappings);
  return ovens;
}

async function fetchOvenToOwnerMappings(ovenOwner: ovenOwner, bigMapId: BigNumber, network: NetworkType) {
  return await BlockchainIndexerClient.getBigMapKeysByValue(bigMapId, ovenOwner, network);
}

async function extractOvenAddresses(ovenMappings: ovenBcdResponse[]) {
  const ovens: string[] = ovenMappings.map((oven: ovenBcdResponse) => {
    const ovenAddress = oven.data.key_string;
    return ovenAddress;
  });
  return ovens;
}
