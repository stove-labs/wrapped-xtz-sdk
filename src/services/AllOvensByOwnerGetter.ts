import BigNumber from 'bignumber.js';

import { NetworkType } from '../enums';
import { ovenBcdResponse, ovenOwner } from '../types';

import { getBigMapKeysByValue } from './BlockchainIndexer';

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
  indexerUrl: string,
  network: NetworkType
): Promise<string[]> {
  const ovenMappings = await fetchOvenToOwnerMappings(ovenOwner, bigMapOvenId, indexerUrl, network);
  const ovens = extractOvenAddresses(ovenMappings);
  return ovens;
}

async function fetchOvenToOwnerMappings(
  ovenOwner: ovenOwner,
  bigMapId: BigNumber,
  indexerUrl: string,
  network: NetworkType
) {
  return await getBigMapKeysByValue(bigMapId, ovenOwner, indexerUrl, network);
}

async function extractOvenAddresses(ovenMappings: ovenBcdResponse[]) {
  const ovens: string[] = ovenMappings.map((oven: ovenBcdResponse) => {
    const ovenAddress = oven.data.key_string;
    return ovenAddress;
  });
  return ovens;
}
