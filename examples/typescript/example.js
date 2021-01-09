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
