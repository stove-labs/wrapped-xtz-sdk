import BigNumber from 'bignumber.js';

import { NetworkType } from '../constants/networkTypes';
import { ovenBcdResponse, ovenOwner } from '../types/types';

import { ApiClient } from './ApiClient';

export class AllOvensByOwnerGetter {
  /**
   * Returns all oven addresses for a given owner address.
   *
   * @param ovenOwner Address of the oven owner.
   * @param bigMapOvenIds ID of the big map that holds all oven to oven owner mappings.
   * @param network Network type.
   */
  public static async get(ovenOwner: ovenOwner, bigMapOvenId: BigNumber, network: NetworkType): Promise<string[]> {
    const ovenMappings = await this.fetchOvenToOwnerMappings(ovenOwner, bigMapOvenId, network);
    const ovens = this.extractOvenAddresses(ovenMappings);
    return ovens;
  }

  private static async fetchOvenToOwnerMappings(ovenOwner: ovenOwner, bigMapId: BigNumber, network: NetworkType) {
    return await ApiClient.getKeysByValue(ovenOwner, bigMapId, network);
  }

  private static extractOvenAddresses(ovenMappings: ovenBcdResponse[]) {
    const ovens: string[] = ovenMappings.map((oven: ovenBcdResponse) => {
      const ovenAddress = oven.data.key_string;
      return ovenAddress;
    });
    return ovens;
  }
}
