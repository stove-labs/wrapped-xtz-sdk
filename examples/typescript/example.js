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
