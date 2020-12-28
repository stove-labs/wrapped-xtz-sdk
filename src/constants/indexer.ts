import { NetworkType } from './networkType';

const searchKeyByValue: Record<NetworkType, string> = {
  [NetworkType.delphinet]: 'https://you.better-call.dev/v1/bigmap/delphinet',
  [NetworkType.mainnet]: 'https://you.better-call.dev/v1/bigmap/mainnet',
  // TODO add URL for localhost
  [NetworkType.localhost]: 'not available',
};

const contractHistory: Record<NetworkType, string> = {
  [NetworkType.delphinet]: 'https://api.better-call.dev/v1/contract/delphinet',
  [NetworkType.mainnet]: 'https://api.better-call.dev/v1/contract/mainnet',
  // TODO add URL for localhost
  [NetworkType.localhost]: 'not available',
};

export const IndexerUrl = {
  searchKeyByValue,
  contractHistory,
};
