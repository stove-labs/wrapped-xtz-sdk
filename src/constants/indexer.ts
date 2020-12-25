import { Network } from './networks';

const searchKeyByValue: Record<Network, string> = {
  [Network.delphinet]: 'https://you.better-call.dev/v1/bigmap/delphinet',
  [Network.mainnet]: 'https://you.better-call.dev/v1/bigmap/mainnet',
  // TODO add URL for localhost
  [Network.localhost]: 'not available',
};

const contractHistory: Record<Network, string> = {
  [Network.delphinet]: 'https://api.better-call.dev/v1/contract/delphinet',
  [Network.mainnet]: 'https://api.better-call.dev/v1/contract/mainnet',
  // TODO add URL for localhost
  [Network.localhost]: 'not available',
};

export const IndexerUrl = {
  searchKeyByValue,
  contractHistory,
};
