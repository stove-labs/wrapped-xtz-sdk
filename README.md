[![npm version](https://badge.fury.io/js/%40stove-labs%2Fwxtz-sdk.svg)](https://badge.fury.io/js/%40stove-labs%2Fwxtz-sdk)
![build](https://github.com/stove-labs/wrapped-xtz-sdk/workflows/build/badge.svg)
![Delphinet](https://github.com/stove-labs/wrapped-xtz-sdk/workflows/Delphinet/badge.svg)
[![Made with TypeScript](https://img.shields.io/badge/made_with-TypeScript-blue.svg)](https://www.typescriptlang.org)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
# Wrapped-XTZ SDK

This SDK for TypeScript and JavaScript enables you to interact with Tezos smart contracts of the [Wrapped-XTZ](https://github.com/stakerdao/wrapped-xtz) project by StakerDAO.

# Quickstart 🪄

```sh
npm install @stove-labs/wxtz-sdk
```
## Usage 🕹
### Typescript

<!-- embedme examples/typescript/example.ts -->
```ts
import { WXTZSDK, NetworkType } from '@stove-labs/wxtz-sdk';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://testnet-tezos.giganode.io');
Tezos.setProvider({
  signer: new InMemorySigner(
    'edskSAVepaB1qJvJBrR9WK3X6JQneSGq2wf4jF4czWjMF3LyqtyELhGxqmx9gBADquKHr12uYpsDJA1H1RQJNBUUjkefytWs6e'
  ),
});

const wXTZConfig = {
  tezos: Tezos,
  network: NetworkType.delphinet,
  indexerUrl: 'https://you.better-call.dev',
};

(async function () {
  // initialize SDK
  const wXTZ = await WXTZSDK.at('KT1VMHXqjocCDZJ9cVwbtM1saLmXjyxwPb2h', wXTZConfig);
  // perform optional check
  const isValidContractCode = await wXTZ.checkContractCodeIntegrity();

  const createOvenContractMethod = await wXTZ.createOven('tz1QFeixME3pnRFwGFArJ5EFEc7uPjqxDNHY');
  const transactionOperation = await createOvenContractMethod.send();
  await transactionOperation.confirmation(1);

  // interact with oven
  const wXTZOven = await wXTZ.oven('KT1ovenAddress');
  await wXTZOven.initialize();
  // perform optional check
  const isValid = await wXTZOven.checkContractCodeIntegrity();

  // deposit
  const depositOperation = await (await wXTZOven.deposit()).send({
    amount: 100,
    mutez: true,
  });
  await depositOperation.confirmation(1);

  // withdraw
  const withdrawOperation = await (await wXTZOven.withdraw(100)).send();
  await withdrawOperation.confirmation(1);

  // set delegate
  const setDelegateOperation = await (await wXTZOven.setDelegate('tz1...')).send();
  await setDelegateOperation.confirmation(1);

  // remove delegate
  const removeDelegateOperation = await (await wXTZOven.setDelegate(null)).send();
  await removeDelegateOperation.confirmation(1);

  // get delegate
  const delegateAddress = await wXTZOven.getDelegate();

  // get core address
  const coreAddress = await wXTZOven.getCoreAddress();

  // get oven details for date/time of origination and last action, block height of origination
  const ovenDetails = await wXTZOven.getDetails();
})();

```

### JavaScript

<details><summary>Example</summary>
<p>

<!-- embedme examples/typescript/example.js -->
```js
const { WXTZSDK, NetworkType } = require('@stove-labs/wxtz-sdk');
const { InMemorySigner } = require('@taquito/signer');
const { TezosToolkit } = require('@taquito/taquito');

const Tezos = new TezosToolkit('https://testnet-tezos.giganode.io');
Tezos.setProvider({
  signer: new InMemorySigner(
    'edskSAVepaB1qJvJBrR9WK3X6JQneSGq2wf4jF4czWjMF3LyqtyELhGxqmx9gBADquKHr12uYpsDJA1H1RQJNBUUjkefytWs6e'
  ),
});

const wXTZConfig = {
  tezos: Tezos,
  network: NetworkType.delphinet,
  indexerUrl: 'https://you.better-call.dev',
};

(async function () {
  // initialize SDK
  const wXTZ = await WXTZSDK.at('KT1VMHXqjocCDZJ9cVwbtM1saLmXjyxwPb2h', wXTZConfig);
  // perform optional check
  const isValidContractCode = await wXTZ.checkContractCodeIntegrity();

  const createOvenContractMethod = await wXTZ.createOven('tz1QFeixME3pnRFwGFArJ5EFEc7uPjqxDNHY');
  const transactionOperation = await createOvenContractMethod.send();
  await transactionOperation.confirmation(1);

  // interact with oven
  const wXTZOven = await wXTZ.oven('KT1ovenAddress');
  await wXTZOven.initialize();
  // perform optional check
  const isValid = await wXTZOven.checkContractCodeIntegrity();

  // deposit
  const depositOperation = await (await wXTZOven.deposit()).send({
    amount: 100,
    mutez: true,
  });
  await depositOperation.confirmation(1);

  // withdraw
  const withdrawOperation = await (await wXTZOven.withdraw(100)).send();
  await withdrawOperation.confirmation(1);

  // set delegate
  const setDelegateOperation = await (await wXTZOven.setDelegate('tz1...')).send();
  await setDelegateOperation.confirmation(1);

  // remove delegate
  const removeDelegateOperation = await (await wXTZOven.setDelegate(null)).send();
  await removeDelegateOperation.confirmation(1);

  // get delegate
  const delegateAddress = await wXTZOven.getDelegate();

  // get core address
  const coreAddress = await wXTZOven.getCoreAddress();

  // get oven details for date/time of origination and last action, block height of origination
  const ovenDetails = await wXTZOven.getDetails();
})();

```

</p>
</details>


## API Reference

Checkout the complete TypeDoc [API reference](https://stove-labs.github.io/wrapped-xtz-sdk).
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
