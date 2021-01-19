import test from '../config';
import { WXTZOven, WXTZSDK } from '../../src/index';
import { expect } from 'chai';
import { setup } from './before';
import { wXTZConfig } from '../../src/types';

let wXTZConfig: wXTZConfig;
let wXTZ: WXTZSDK;

before(() => {
  wXTZConfig = setup();
});

describe('WXTZSDK.ts', () => {
  beforeEach(async () => {
    wXTZ = await WXTZSDK.at(test.core, wXTZConfig);
  });

  describe('initializing the SDK', () => {
    it('can initialize SDK with core address', async () => {
      expect(wXTZ.instance.address).to.equal(test.core);
    });

    it('can initialize SDK with token contract', async () => {
      const tokenAddress = wXTZ.token.getAddress();

      expect(tokenAddress).to.equal(test.token);
    });

    it('can check contract code integrity', async () => {
      const isValidContractCode = await wXTZ.checkCodeIntegrity();

      expect(isValidContractCode).to.be.true;
    });

    it('can get total supply', async () => {
      const totalSupply = await wXTZ.getTotalSupply();

      expect(totalSupply.toNumber()).to.equal(400);
    });

    // cannot test this in sandbox until BBBOX is updated with new feature
    it.skip('can get total locked XTZ for user', async () => {
      const totalLockedXTZ = await wXTZ.getTotalLockedXTZ(test.ovenOwner.pkh);

      expect(totalLockedXTZ.toNumber()).to.equal(400);
    });

    it('can get wXTZ balance for address', async () => {
      const wXTZBalance = await wXTZ.getBalance(test.ovenOwner.pkh);

      expect(wXTZBalance.toNumber()).to.equal(200);
    });
  });

  describe('initializing oven configured through SDK', () => {
    let wXTZOven: WXTZOven;

    beforeEach(async () => {
      wXTZOven = await wXTZ.oven(test.ovenWithDelegate);
    });

    it('initializes oven with oven address', async () => {
      await wXTZOven.initialize();

      expect(wXTZOven.getAddress()).to.equal(test.ovenWithDelegate);
    });
  });

  describe('getting all ovens using the SDK', () => {
    // cannot test this in sandbox until BBBOX is updated with new feature
    it.skip('initializes oven with oven address', async () => {
      const allOvens: WXTZOven[] = await wXTZ.getAllOvensByOwner(test.ovenOwner.pkh);

      const ovenCount = allOvens.length;
      expect(ovenCount).to.equal(2);
    });
  });

  describe('originating ovens through SDK', () => {
    it('can create an oven', async () => {
      const operation = await (await wXTZ.createOven('tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6')).send();
      await operation.confirmation(1);

      const operationResults = (await operation.operationResults) as any;
      const internalOperationResult = operationResults[0].metadata.internal_operation_results;
      const originationOperation = internalOperationResult[0];
      expect(originationOperation.kind).to.be.equal('origination');
    });
  });
});
