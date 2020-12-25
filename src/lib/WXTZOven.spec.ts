import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import test from 'ava';

import { Network } from '../constants/networks';
import { address, delegate, mutez } from '../types/types';

import { WXTZOven } from './WXTZOven';

// TODO extract test constants to be shared among tests
const rpc = 'https://testnet-tezos.giganode.io';
const delegateAddress = 'tz1LpmZmB1yJJBcCrBDLSAStmmugGDEghdVv';
const ovenContractWithDelegate = 'KT1CoDEjbN4kim5Lu8tkqn2KcxU7vb5R2rrq';
const ovenOwnerAddress = 'tz1fhigafd7PQAh3JBvq7efZ9g6cgBkaimJX'; // carol
const ovenContract = 'KT1SnTZQtSaqfVyxJM7DVjMbpmR4feCynnRK';
const coreContract = 'KT1V4XC3dkYxoGyAiNoF3RaCoHCFJFVC6q4P';

let wXTZConfig: { tezos: TezosToolkit; network: Network };

test.before('set rpc', async function (t) {
  const Tezos = new TezosToolkit(rpc);
  Tezos.setProvider({
    signer: new InMemorySigner(
      'edskSAVepaB1qJvJBrR9WK3X6JQneSGq2wf4jF4czWjMF3LyqtyELhGxqmx9gBADquKHr12uYpsDJA1H1RQJNBUUjkefytWs6e'
    ),
  });
  wXTZConfig = {
    tezos: Tezos,
    network: Network.delphinet,
  };
  t.pass();
});

test('initializes oven contract', async function (t) {
  const wxtzOven = new WXTZOven(ovenContract, wXTZConfig);
  const wxtzOvenObject: WXTZOven = await wxtzOven.initialize();
  t.is(wxtzOvenObject, wxtzOven);
});

test('gets core address', async function (t) {
  const wxtzOven = new WXTZOven(ovenContract, wXTZConfig);
  await wxtzOven.initialize();
  const coreAddress: address = await wxtzOven.getCoreContractAddress();
  t.is(coreAddress, coreContract);
});

test('gets oven owner address', async function (t) {
  const wxtzOven = new WXTZOven(ovenContract, wXTZConfig);
  await wxtzOven.initialize();
  const ovenOwner: address = await wxtzOven.getOvenOwner();
  t.is(ovenOwner, ovenOwnerAddress);
});

test('gets delegate address if delegate was set', async function (t) {
  const wxtzOven = new WXTZOven(ovenContractWithDelegate, wXTZConfig);
  await wxtzOven.initialize();
  const delegate: delegate = await wxtzOven.getDelegate();
  t.is(delegate, delegateAddress);
});

test('gets delegate address if delegate was not set', async function (t) {
  const wxtzOven = new WXTZOven(ovenContract, wXTZConfig);
  await wxtzOven.initialize();
  const delegate: delegate = await wxtzOven.getDelegate();
  t.is(delegate, null);
});

test('gets date of contract origination', async function (t) {
  const wxtzOven = new WXTZOven(ovenContract, wXTZConfig);
  await wxtzOven.initialize();
  const originatedAt: Date = await wxtzOven.getOriginatedAt();
  // TODO change assertion to deep equal and remove to string conversion
  t.is(originatedAt.toISOString(), '2020-12-25T15:49:44.000Z');
});
