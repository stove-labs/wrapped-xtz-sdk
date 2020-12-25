import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { Network } from '../constants/indexer';

declare type address = string;
declare type ovenOwner = address;
declare type tokenAddress = address;
declare type keyHash = string;
declare type delegate = keyHash | null;

declare type blockHeight = number;

declare type checksum = string;

declare type contractDeployment = {
  checksum: checksum;
  address: address;
};

// TODO check if bigNumber is really not accepted by taquito as send parameter
declare type mutez = number;

declare type TezosBalance = BigNumber;

declare type contractDeployments = {
  core: contractDeployment;
  oven: contractDeployment;
  tokenContract: contractDeployment;
};

declare type deployments = {
  mainnet: contractDeployments;
  delphinet: contractDeployments;
};

declare type arbitraryValueKey = string;
declare type arbitraryValue = string | number;

declare type lambdaName = string;
declare type bytes = string;
declare type packedArbitraryValue = bytes;
declare type lambdaParameter = bytes;
declare type michelsonType = string;

declare type wXTZConfig = {
  tezos: TezosToolkit;
  network: Network;
};

declare type coreContractStorage = {
  u: string;
};

declare type packedLambda = bytes;

interface CoreContractStorage {
  arbitraryValues: {
    get(key: arbitraryValueKey): Promise<packedArbitraryValue>;
  };
  lambdas: {
    get(key: lambdaName): Promise<packedLambda>;
  };
  ovens: {
    get(key: address): Promise<ovenOwner>;
    id: BigNumber;
  };
}

type OvenContractStorage = address;

declare type ovenBcdResponse = {
  data: {
    key_string: address;
    level: blockHeight;
    timestamp: Date;
  };
};

declare type IndexerUrl = {
  searchKeyByValue: {
    delphinet: string;
  };
  contractHistory: {
    delphinet: string;
  };
};
