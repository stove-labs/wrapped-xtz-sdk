const { WXTZOven, WXTZSDK, NetworkType } = require('wxtz-sdk');
const { InMemorySigner } = require('@taquito/signer');
const { TezosToolkit } = require('@taquito/taquito');

const Tezos = new TezosToolkit('tezos rpc url');
Tezos.setProvider({
  signer: new InMemorySigner('signer secret key'),
});

const wXTZConfig = {
  tezos: Tezos,
  network: NetworkType.delphinet,
  indexerUrl: 'https://you.better-call.dev',
};

(async function () {
  const wXTZ = await WXTZSDK.at('KT1coreAddress', wXTZConfig);
  const createOvenOperation = await wXTZ.createOven('tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6');
  await createOvenOperation.send();
})();
