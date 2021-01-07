import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { NetworkType } from '../../src/enums';
import testConfig from '../config';

export function setup() {
  const Tezos = new TezosToolkit(testConfig.rpc);
  Tezos.setProvider({
    signer: new InMemorySigner(testConfig.ovenOwner.sk),
  });
  const wXTZConfig = {
    tezos: Tezos,
    network: NetworkType.delphinet,
    indexerUrl: 'https://you.better-call.dev',
  };

  return wXTZConfig;
}
