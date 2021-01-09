import deployments from '../../src/deployments.json';
import { packMichelson, checkIntegrity } from '../../src/byteHelpers';
import { expect } from 'chai';
import test from '../config';

describe('BytesConversionUtils.ts', () => {
  it('can pack a create oven instruction', () => {
    const packedValue = packMichelson(
      `Pair Some "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6" "tz1fhigafd7PQAh3JBvq7efZ9g6cgBkaimJX"`,
      'pair (option key_hash) address'
    );

    expect(
      packedValue,
      '05070705090100000024747a3161536b77456f74334c326b6d5576636f787a6a4d6f6d62396d76424e757a464b360100000024747a31666869676166643750514168334a4276713765665a3967366367426b61696d4a58'
    );
  });

  it('checks validity for valid code', async () => {
    const contractCodeString = JSON.stringify(test.ovenContractCodeMicheline);

    const isValid = await checkIntegrity(deployments.delphinet.oven.checksum, contractCodeString);

    expect(isValid).to.be.true;
  });

  it('checks validity for invalid code', async () => {
    const isValid = await checkIntegrity(deployments.delphinet.oven.checksum, 'invalid code');

    expect(isValid).to.be.false;
  });
});
