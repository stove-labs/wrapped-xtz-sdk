import { InMemorySigner } from '@taquito/signer';
import { ContractMethod, ContractProvider, TezosToolkit } from '@taquito/taquito';
import { TransactionOperation } from '@taquito/taquito/dist/types/operations/transaction-operation';
import test from 'ava';

import { Network } from '../constants/networks';
import { TezosBalance } from '../types/types';

import { WXTZ } from './WXTZ';
import { WXTZOven } from './WXTZOven';

// TODO extract test constants to be shared among tests
const rpc = 'https://testnet-tezos.giganode.io';
const coreAddress = 'KT1V4XC3dkYxoGyAiNoF3RaCoHCFJFVC6q4P';
const tokenAddress = 'KT1WkNyAzbKfBpsBAde8gHiFPUxMx6cWDM9G';
const amount = 100;
const delegate = 'tz1LpmZmB1yJJBcCrBDLSAStmmugGDEghdVv';
const ovenOwner = 'tz1fhigafd7PQAh3JBvq7efZ9g6cgBkaimJX'; // carol

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

test.todo('can instantiate class');

test('it can get core address', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  t.is(wxtz.coreAddress, coreAddress);
});

test('it initializes with correct contract', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  await wxtz.initialize();
  t.is(wxtz.instance.address, coreAddress);
});

test('it initializes and returns class', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  const wxtzObject: WXTZ = await wxtz.initialize();
  t.is(wxtz, wxtzObject);
});

test('it gets token contract address', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  await wxtz.initialize();
  const tokenContractAddress = await wxtz.getWXTZTokenContractAddress();
  t.is(tokenContractAddress, tokenAddress);
});

// TODO reorganize tests
test.skip('it can create an oven with delegate', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  await wxtz.initialize();
  const contractMethod: ContractMethod<ContractProvider> = await wxtz.createOven(ovenOwner, delegate);

  const operation: TransactionOperation = await contractMethod.send({ mutez: false, amount: amount });
  await operation.confirmation(1);

  // TODO avoid casting to any
  const internalOperations = (operation as any).results[0].metadata.internal_operation_results;
  const firstInternalOperation = internalOperations[0];
  t.is(firstInternalOperation.kind, 'origination');
  t.is(firstInternalOperation.balance, String(amount * 1000000));
  t.is(firstInternalOperation.delegate, delegate);
  t.is(firstInternalOperation.result.status, 'applied');

  const secondInternalOperation = internalOperations[1];
  t.is(secondInternalOperation.kind, 'transaction');
  t.is(secondInternalOperation.source, coreAddress);
  t.is(secondInternalOperation.destination, tokenAddress); // mint
  t.is(secondInternalOperation.amount, '0');
});

test.skip('it can create oven without delegate', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  await wxtz.initialize();
  const contractMethod: ContractMethod<ContractProvider> = await wxtz.createOven(ovenOwner);

  const operation: TransactionOperation = await contractMethod.send({ mutez: false, amount: amount });
  await operation.confirmation(1);
  // TODO avoid casting to any
  const internalOperations = (operation as any).results[0].metadata.internal_operation_results;
  const firstInternalOperation = internalOperations[0];
  t.is(firstInternalOperation.kind, 'origination');
  t.is(firstInternalOperation.balance, String(amount * 1000000));
  t.is(firstInternalOperation.delegate, undefined);
  t.is(firstInternalOperation.result.status, 'applied');

  const secondInternalOperation = internalOperations[1];
  t.is(secondInternalOperation.kind, 'transaction');
  t.is(secondInternalOperation.source, coreAddress);
  t.is(secondInternalOperation.destination, tokenAddress); // mint
  t.is(secondInternalOperation.amount, '0');
});

// TODO rewrite test to get all ovens
test('it can get multiple ovens for a given oven owner', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  await wxtz.initialize();
  const ovens: WXTZOven[] = await wxtz.getAllOvensByOwner(ovenOwner);
  const firstOven: WXTZOven = await ovens[0].initialize();
  t.is(await firstOven.getOvenOwner(), ovenOwner);
  const secondOven: WXTZOven = await ovens[1].initialize();
  t.is(await secondOven.getOvenOwner(), ovenOwner);
});

test('can get the total locked XTZ for a given oven owner', async function (t) {
  const wxtz = new WXTZ(coreAddress, wXTZConfig);
  await wxtz.initialize();
  const totalLockedXTZ: TezosBalance = await wxtz.getTotalLockedXTZ(ovenOwner);
  t.is(totalLockedXTZ.toNumber(), 4600000000);
});
