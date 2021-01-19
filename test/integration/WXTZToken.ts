import test from '../config';
import { expect } from 'chai';
import { setup } from './before';
import { wXTZConfig } from '../../src/types';
import { WXTZToken } from '../../src/index';

let wXTZConfig: wXTZConfig;

before(() => {
  wXTZConfig = setup();
});

describe('WXTZToken.ts', () => {
  describe('initializing token class', () => {
    let wXTZToken: WXTZToken;

    beforeEach(() => {
      wXTZToken = new WXTZToken(test.token, wXTZConfig, test.deployment);
    });

    it('can instantiate the token class', () => {
      const wXTZTokenClass = new WXTZToken(test.token, wXTZConfig, test.deployment);

      expect(wXTZTokenClass).to.be.instanceOf(WXTZToken);
    });

    it('can check whether token address belongs to known deployment', () => {
      const isKnownDeployment = wXTZToken.checkAddress();

      expect(isKnownDeployment).to.be.true;
    });

    it('initializes with token address', async () => {
      await wXTZToken.initialize();

      expect(wXTZToken.getAddress()).to.equal(test.token);
    });

    describe('after initializing token', () => {
      beforeEach(async () => {
        // making sure that token class is initialized when running tests below separately
        await wXTZToken.initialize();
      });

      it('can check for contract code integrity', async () => {
        const isValidCode = await wXTZToken.checkContractCodeIntegrity();

        expect(isValidCode).to.be.true;
      });

      it('can get total token supply', async () => {
        const totalSupply = await wXTZToken.getTotalSupply();

        expect(totalSupply.toNumber()).to.equal(400);
      });

      it('can get wXTZ balance for given address', async () => {
        const wXTZBalance = await wXTZToken.getWXTZBalance(test.ovenOwner.pkh);

        expect(wXTZBalance.toNumber()).to.equal(200);
      });
    });
  });
});
