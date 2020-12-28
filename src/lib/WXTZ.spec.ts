import { InMemorySigner } from '@taquito/signer';
import { ContractMethod, ContractProvider, TezosToolkit } from '@taquito/taquito';
import { TransactionOperation } from '@taquito/taquito/dist/types/operations/transaction-operation';
import test from 'ava';

import { NetworkType } from '../constants/networkType';
import testConfig from '../test/config';
import { TezosBalance, wXTZConfig } from '../types/types';

import { WXTZ } from './WXTZ';
import { WXTZOven } from './WXTZOven';

let wXTZConfig: wXTZConfig;

test.before('set rpc', async function (t) {
  const Tezos = new TezosToolkit(testConfig.rpc);
  Tezos.setProvider({
    signer: new InMemorySigner(testConfig.ovenOwner.sk),
  });
  wXTZConfig = {
    tezos: Tezos,
    network: NetworkType.delphinet,
  };
  t.pass();
});

test.todo('can instantiate class');

test('it can get core address', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  t.is(wxtz.coreAddress, testConfig.core);
});

test.only('it initializes with correct contract', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  await wxtz.initialize();
  t.is(wxtz.instance.address, testConfig.core);
});

test('initialization fails for a non-wXTZ core contract', async function (t) {
  const wxtz = new WXTZ('KT1WkNyAzbKfBpsBAde8gHiFPUxMx6cWDM9G', wXTZConfig);

  const error = await t.throwsAsync(
    async () => {
      await wxtz.initialize();
    },
    { instanceOf: Error }
  );

  t.is(error.message, 'Contract does not pass checksum check');
});

test('checksum check can be deactivated at initialization', async function (t) {
  const notCoreContractAddress = 'KT1WkNyAzbKfBpsBAde8gHiFPUxMx6cWDM9G';
  const wXTZConfigWithoutCheck = wXTZConfig;
  wXTZConfigWithoutCheck.checkIntegrity = false;
  const wxtz = new WXTZ(notCoreContractAddress, wXTZConfigWithoutCheck);
  await wxtz.initialize();
  t.is(wxtz.instance.address, notCoreContractAddress);
});

test('it initializes and returns class', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  const wxtzObject: WXTZ = await wxtz.initialize();
  t.is(wxtz, wxtzObject);
});

test('it gets token contract address', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  await wxtz.initialize();
  const tokenContractAddress = await wxtz.getWXTZTokenContractAddress();
  t.is(tokenContractAddress, testConfig.token);
});

// TODO reorganize tests
// running serially because otherwise there would be a counter error for the transactions
// counter error = 2 transactions use the same counter
test.serial.skip('it can create an oven with delegate', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  await wxtz.initialize();
  const contractMethod: ContractMethod<ContractProvider> = await wxtz.createOven(
    testConfig.ovenOwner.pkh,
    testConfig.delegate
  );

  const operation: TransactionOperation = await contractMethod.send({ mutez: true, amount: testConfig.amount });
  await operation.confirmation(1);

  // TODO avoid casting to any
  const internalOperations = (operation as any).results[0].metadata.internal_operation_results;
  const firstInternalOperation = internalOperations[0];
  t.is(firstInternalOperation.kind, 'origination');
  t.is(firstInternalOperation.balance, String(testConfig.amount));
  t.is(firstInternalOperation.delegate, testConfig.delegate);
  t.is(firstInternalOperation.result.status, 'applied');

  const secondInternalOperation = internalOperations[1];
  t.is(secondInternalOperation.kind, 'transaction');
  t.is(secondInternalOperation.source, testConfig.core);
  t.is(secondInternalOperation.destination, testConfig.token); // mint
  t.is(secondInternalOperation.amount, '0');
});

// running serially because otherwise there would be a counter error for the transactions
// counter error = 2 transactions use the same counter
test.serial.skip('it can create oven without delegate', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  await wxtz.initialize();
  const contractMethod: ContractMethod<ContractProvider> = await wxtz.createOven(testConfig.ovenOwner.pkh);

  const operation: TransactionOperation = await contractMethod.send({ mutez: true, amount: testConfig.amount });
  await operation.confirmation(1);
  // TODO avoid casting to any
  const internalOperations = (operation as any).results[0].metadata.internal_operation_results;
  const firstInternalOperation = internalOperations[0];
  t.is(firstInternalOperation.kind, 'origination');
  t.is(firstInternalOperation.balance, String(testConfig.amount));
  t.is(firstInternalOperation.delegate, undefined);
  t.is(firstInternalOperation.result.status, 'applied');

  const secondInternalOperation = internalOperations[1];
  t.is(secondInternalOperation.kind, 'transaction');
  t.is(secondInternalOperation.source, testConfig.core);
  t.is(secondInternalOperation.destination, testConfig.token); // mint
  t.is(secondInternalOperation.amount, '0');
});

// TODO rewrite test to get all ovens
test('it can get multiple ovens for a given oven owner', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  await wxtz.initialize();
  const ovens: WXTZOven[] = await wxtz.getAllOvensByOwner(testConfig.ovenOwner.pkh);
  const firstOven: WXTZOven = await ovens[0].initialize();
  t.is(await firstOven.getOvenOwner(), testConfig.ovenOwner.pkh);
  const secondOven: WXTZOven = await ovens[1].initialize();
  t.is(await secondOven.getOvenOwner(), testConfig.ovenOwner.pkh);
});

test('can get the total locked XTZ for a given oven owner', async function (t) {
  const wxtz = new WXTZ(testConfig.core, wXTZConfig);
  await wxtz.initialize();
  const totalLockedXTZ: TezosBalance = await wxtz.getTotalLockedXTZ(testConfig.ovenOwner.pkh);
  t.is(totalLockedXTZ.toNumber(), 4600000100);
});
