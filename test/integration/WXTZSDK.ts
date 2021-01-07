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
    it('initializes SDK with core address', async () => {
      expect(wXTZ.instance.address).to.equal(test.core);
    });

    it('initializes SDK with token contract', async () => {
      const tokenAddress = wXTZ.token.getAddress();

      expect(tokenAddress).to.equal(test.token);
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
    it.skip('initializes oven with oven address', async () => {
      const allOvens: WXTZOven[] = await wXTZ.getAllOvensByOwner(test.ovenOwner.pkh);

      const ovenCount = allOvens.length;
      expect(ovenCount).to.equal(2);
    });
  });

  describe('creating oven', () => {
    it.skip('can create oven', async () => {
      const operation = (await wXTZ.createOven('tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6')).send();
      (await operation).confirmation(1);
    });
  });
});
