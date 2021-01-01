import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { NetworkType } from '../enums/networkTypes';

export type address = string;
export type ovenOwner = address;
export type tokenAddress = address;
export type keyHash = string;
export type delegate = keyHash | null;

export type blockHeight = number;

export type checksum = string;

// TODO check if bigNumber is really not accepted by taquito as send parameter
export type mutez = number;

export type TezosBalance = BigNumber;
export type WrappedXTZBalance = TezosBalance;

export type arbitraryValueKey = string;
export type arbitraryValue = string | number;

export type lambdaName = string;
declare type bytes = string;
export type packedArbitraryValue = bytes;
export type lambdaParameter = bytes;
export type michelsonType = string;

export type wXTZConfig = {
  tezos: TezosToolkit;
  network: NetworkType;
  checkIntegrity?: boolean;
};

export type packedLambda = bytes;

export declare type micheline = string;

/**
 * Models: WXTZ Core, Oven, Token
 */
export type CoreContractStorage = {
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
};

export type OvenContractStorage = address;

export type TokenContractStorage = {
  token: {
    ledger: {
      get(key: ovenOwner): Promise<WrappedXTZBalance>;
    };
    totalSupply: WrappedXTZBalance;
  };
};

export type coreContractStorage = {
  u: string;
};

/**
 * Services
 */
export declare type contractInfoFromRpc = {
  balance: number;
  script: {
    code: micheline;
    storage: any;
  };
};

export declare type contractDetail = {
  timestamp: string;
  level: blockHeight;
  last_action: string;
};

export declare type ovenBcdResponse = {
  data: {
    key_string: address;
    level: blockHeight;
    timestamp: Date;
  };
};
