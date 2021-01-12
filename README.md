![Delphinet](https://github.com/stove-labs/wrapped-xtz-sdk/workflows/Delphinet/badge.svg)
[![Made with TypeScript](https://img.shields.io/badge/made_with-TypeScript-blue.svg)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Wrapped-XTZ SDK

This SDK for TypeScript and JavaScript enables you to interact with Tezos smart contracts of the [Wrapped-XTZ](https://github.com/stakerdao/wrapped-xtz) project by StakerDAO.

> 🚧 This software is still under development and not released. 🚧

```sh
git clone https://github.com/stove-labs/wrapped-xtz-sdk folder-name
cd folder-name
npm install
npm run build
```
# Quickstart 🪄
## Import
### TypeScript

<!-- embedme examples/typescript/example.ts#L1-L14 -->
```ts
import { WXTZSDK, NetworkType } from 'wxtz-sdk';
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
```

### JavaScript

<!-- embedme examples/typescript/example.js#L1-L14 -->
```js
const { WXTZSDK, NetworkType } = require('wxtz-sdk');
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
```

## Usage 🕹
### Typescript

<!-- embedme examples/typescript/example.ts#L16-L59 -->
```ts
(async function () {
  // initialize SDK
  const wXTZ = await WXTZSDK.at('KT1coreAddress', wXTZConfig);
  // perform optional check
  const isValidContractCode = await wXTZ.checkContractCodeIntegrity();

  const createOvenContractMethod = await wXTZ.createOven('tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6');
  const transactionOperation = await createOvenContractMethod.send();
  await transactionOperation.confirmation(1);

  // interact with oven
  const wXTZOven = await wXTZ.oven('KT1ovenAddress');
  await wXTZOven.initialize();
  // perform optional check
  const isValid = await wXTZOven.checkContractCodeIntegrity();

  // deposit
  const depositTxOperation = await (await wXTZOven.deposit()).send({
    amount: 100,
    mutez: true,
  });
  await depositTxOperation.confirmation(1);

  // withdraw
  const withdrawTxOperation = await (await wXTZOven.withdraw(100)).send();
  await withdrawTxOperation.confirmation(1);

  // set delegate
  const setDelegateTxOperation = await (await wXTZOven.setDelegate('tz1...')).send();
  await setDelegateTxOperation.confirmation(1);

  // remove delegate
  const removeDelegateTxOperation = await (await wXTZOven.setDelegate(null)).send();
  await removeDelegateTxOperation.confirmation(1);

  // get delegate
  const delegate = await wXTZOven.getDelegate();

  // get core address
  const coreAddress = await wXTZOven.getCoreAddress();

  // get oven details for date/time of origination and last action, block height of origination
  const ovenDetails = await wXTZOven.getDetails();
})();
```
## API Reference

Checkout the complete TypeDoc [API reference](https://stove-labs.github.io/wrapped-xtz-sdk/https://stove-labs.github.io/wrapped-xtz-sdk/).
## Tests 🧪

For running tests it is necessary to spin up a local Tezos sandbox node, migrating the test state and then executing the test runner. 
Make sure to have [Docker](https://www.docker.com) running, [node.js v12.x](https://nodejs.org) and [jq](https://stedolan.github.io/jq/) installed.

```sh
npm run sandbox:start
npm run test:migrate
npm run test
```
## License 📃

Wrapped-XTZ SDK is available under the MIT License.

## Powered by

<div float="left">
  <img src="https://ligolang.org/img/logo.svg" width="100" />
  <img src="https://stove-labs.com/logo_transparent.png" width="100" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" width="100" /> 
  <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" width="100" /> 
</div>
<br/>
