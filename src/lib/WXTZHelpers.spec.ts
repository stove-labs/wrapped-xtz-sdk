import test from 'ava';

import { ContractType } from '../constants/contractType';
import { deployments } from '../constants/deployments';
import { NetworkType } from '../constants/networkType';

import { checkIntegrity, fetchContractCode, packMichelson, sha256, unpack } from './WXTZHelpers';

const ovenContractCodeMicheline =
  '[{"prim":"parameter","args":[{"prim":"or","args":[{"prim":"or","args":[{"prim":"unit","annots":["%default"]},{"prim":"option","args":[{"prim":"key_hash"}],"annots":["%setDelegate"]}]},{"prim":"nat","annots":["%withdraw"]}]}]},{"prim":"storage","args":[{"prim":"address"}]},{"prim":"code","args":[[{"prim":"LAMBDA","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"pair","args":[{"prim":"string"},{"prim":"bytes"}]},{"prim":"mutez"}]},{"prim":"address"}]},{"prim":"operation"},[{"prim":"DUP"},{"prim":"CDR"},{"prim":"CONTRACT","args":[{"prim":"pair","args":[{"prim":"string","annots":["%lambdaName"]},{"prim":"bytes","annots":["%lambdaParameter"]}]}],"annots":["%runEntrypointLambda"]},{"prim":"IF_NONE","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"7"}]},{"prim":"FAILWITH"}],[]]},{"prim":"SWAP"},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"CAR"},{"prim":"CDR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CAR"},{"prim":"CAR"},{"prim":"TRANSFER_TOKENS"}]]},{"prim":"SWAP"},{"prim":"DUP"},{"prim":"CDR"},{"prim":"SWAP"},{"prim":"CAR"},{"prim":"IF_LEFT","args":[[{"prim":"IF_LEFT","args":[[{"prim":"DROP"},{"prim":"DUP"},{"prim":"SENDER"},{"prim":"COMPARE"},{"prim":"EQ"},{"prim":"IF","args":[[{"prim":"SWAP"},{"prim":"DROP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}],[{"prim":"DUP"},{"prim":"AMOUNT"},{"prim":"PUSH","args":[{"prim":"unit"},{"prim":"Unit"}]},{"prim":"PACK"},{"prim":"PUSH","args":[{"prim":"string"},{"string":"onOvenDepositReceived"}]},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"SWAP"},{"prim":"EXEC"},{"prim":"SWAP"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CONS"},{"prim":"PAIR"}]]}],[{"prim":"PAIR"},{"prim":"DUP"},{"prim":"CDR"},{"prim":"SENDER"},{"prim":"SWAP"},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"AMOUNT"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"PACK"},{"prim":"PUSH","args":[{"prim":"string"},{"string":"onOvenSetDelegate"}]},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"SWAP"},{"prim":"EXEC"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CAR"},{"prim":"SET_DELEGATE"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CONS"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CONS"},{"prim":"PAIR"}]]}],[{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"SENDER"},{"prim":"PAIR"},{"prim":"SWAP"},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"AMOUNT"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"PACK"},{"prim":"PUSH","args":[{"prim":"string"},{"string":"onOvenWithdrawalRequested"}]},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"PAIR"},{"prim":"DIG","args":[{"int":"3"}]},{"prim":"SWAP"},{"prim":"EXEC"},{"prim":"SENDER"},{"prim":"CONTRACT","args":[{"prim":"unit"}]},{"prim":"IF_NONE","args":[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"15"}]},{"prim":"FAILWITH"}],[]]},{"prim":"PUSH","args":[{"prim":"mutez"},{"int":"1"}]},{"prim":"DIG","args":[{"int":"4"}]},{"prim":"MUL"},{"prim":"PUSH","args":[{"prim":"unit"},{"prim":"Unit"}]},{"prim":"TRANSFER_TOKENS"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CONS"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"CONS"},{"prim":"PAIR"}]]}]]}]';

test('it can pack create oven instruction', (t) => {
  const packedValue = packMichelson(
    `Pair Some "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6" "tz1fhigafd7PQAh3JBvq7efZ9g6cgBkaimJX"`,
    'pair (option key_hash) address'
  );
  t.is(
    packedValue,
    '05070705090100000024747a3161536b77456f74334c326b6d5576636f787a6a4d6f6d62396d76424e757a464b360100000024747a31666869676166643750514168334a4276713765665a3967366367426b61696d4a58'
  );
});

test('it can compute sha256', async (t) => {
  const hash = await sha256('test message');
  t.is(hash, '3f0a377ba0a4a460ecb616f6507ce0d8cfa3e704025d4fda3ed0c5ca05468728');
});

test('it can fetch contract code', async (t) => {
  const contractCodeInJSONString = await fetchContractCode(
    'KT1SnTZQtSaqfVyxJM7DVjMbpmR4feCynnRK',
    'https://testnet-tezos.giganode.io'
  );
  t.is(contractCodeInJSONString, ovenContractCodeMicheline);
});

test('checks validity for valid code', async (t) => {
  const hasIntegrity = await checkIntegrity(deployments.delphinet.oven.checksum, ovenContractCodeMicheline);
  t.is(hasIntegrity, true);
});

test('checks validity for invalid code', async (t) => {
  const hasIntegrity = await checkIntegrity(deployments.delphinet.oven.checksum, 'invalid code');
  t.is(hasIntegrity, false);
});
