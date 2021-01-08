![Delphinet](https://github.com/stove-labs/wrapped-xtz-sdk/workflows/Delphinet/badge.svg)

# wXTZ SDK

SDK for the wrapped XTZ project

## Running the tests

```
npm run sandbox:start
npm run test:migrate
npm run test
```

## Usage

### Typescript

```ts
// examples/typescript/example.ts

import { WXTZOven, WXTZSDK, NetworkType } from 'wxtz-sdk';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

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

```

### Javascript

```js
// examples/typescript/example.js

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

```