import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import test from 'ava';

import { NetworkType } from '../constants/networkTypes';
import testConfig from '../test/config';
import { address, delegate, wXTZConfig } from '../types/types';

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
    checkIntegrity: false,
  };
  t.pass();
});

test('initializes oven contract', async function (t) {
  const wxtzOven = new WXTZOven(testConfig.ovenWithoutDelegate, wXTZConfig);
  const wxtzOvenObject: WXTZOven = await wxtzOven.initialize();
  t.is(wxtzOvenObject, wxtzOven);
});

test('gets core address', async function (t) {
  const wxtzOven = await initWxtzOven(testConfig.ovenWithoutDelegate);

  const coreAddress: address = await wxtzOven.getCoreAddress();

  t.is(coreAddress, testConfig.core);
});

// TODO update test config to an oven with delegate that was originated from same core
test.skip('gets delegate address if delegate was set', async function (t) {
  const wxtzOven = await initWxtzOven(testConfig.ovenWithDelegate);

  const delegate: delegate = await wxtzOven.getDelegate();

  t.is(delegate, testConfig.delegate);
});

test('gets delegate address if delegate was not set', async function (t) {
  const wxtzOven = await initWxtzOven(testConfig.ovenWithoutDelegate);

  const delegate: delegate = await wxtzOven.getDelegate();

  t.is(delegate, null);
});

test('gets date of contract origination', async function (t) {
  const wxtzOven = await initWxtzOven(testConfig.ovenWithoutDelegate);

  const originatedAt: Date = await wxtzOven.getOriginatedAt();

  // TODO change assertion to deep equal and remove to string conversion
  t.is(originatedAt.toISOString(), '2020-12-31T11:21:39.000Z');
});

test.serial.skip('place XTZ deposit in oven contract', async function (t) {
  const wxtzOven = new WXTZOven(testConfig.ovenWithoutDelegate, wXTZConfig);
  await wxtzOven.initialize();
  const balanceBefore = await wxtzOven.getBalance();

  const amountToDeposit = 100; // mutez
  const operation = await (await wxtzOven.deposit()).send({ mutez: true, amount: amountToDeposit });
  await operation.confirmation(1);
  const balanceAfter = await wxtzOven.getBalance();
  t.is(balanceAfter.toNumber(), balanceBefore.plus(amountToDeposit).toNumber());
});

test.serial.skip('withdraw from oven contract', async function (t) {
  const wxtzOven = new WXTZOven(testConfig.ovenWithoutDelegate, wXTZConfig);
  await wxtzOven.initialize();

  const balanceBefore = await wxtzOven.getBalance();

  const amountToWithdraw = 50; // mutez
  const operation = await (await wxtzOven.withdraw(amountToWithdraw)).send();
  await operation.confirmation(1);

  const balanceAfter = await wxtzOven.getBalance();
  t.is(balanceAfter.toNumber(), balanceBefore.minus(amountToWithdraw).toNumber());
});

test('removes delegate', async function (t) {
  const wxtzOven = await initWxtzOven(testConfig.ovenWithoutDelegate);

  const operation = await (await wxtzOven.removeDelegate()).send();
  await operation.confirmation(1);

  const delegate: delegate = await wxtzOven.getDelegate();
  t.is(delegate, null);
});

async function initWxtzOven(ovenAddress: address) {
  return await new WXTZOven(ovenAddress, wXTZConfig).initialize();
}
