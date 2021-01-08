# Wrapped-XTZ SDK

# wXTZ SDK

SDK for the wrapped XTZ project

## Running the tests

```
npm run sandbox:start
npm run test:migrate
npm run test
```

# Quickstart

## TypeScript

```typescript
import { WXTZOven, WXTZSDK, NetworkType } from '@stove-labs/wrapped-xtz-sdk';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit("tezos rpc url");
Tezos.setProvider({
    signer: new InMemorySigner(signerSk),
});

const wXTZConfig = {
    tezos: Tezos,
    network: NetworkType.delphinet,
    indexerUrl: 'https://you.better-call.dev',
};

(async function() {
    const wXTZ = await WXTZSDK.at('KT1coreAddress', wXTZConfig);
    const createOvenOperation = wXTZ.createOven('tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6');
    await createOvenOperation.send();
    await createOvenOperation.confirmation(1);
})();

```

## License 📃

Wrapped-XTZ SDK is available under the MIT License

## Powered by

<div float="left">
  <img src="https://ligolang.org/img/logo.svg" width="100" />
  <img src="https://stove-labs.com/logo_transparent.png" width="100" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" width="100" /> 
  <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" width="100" /> 
</div>
<br/>