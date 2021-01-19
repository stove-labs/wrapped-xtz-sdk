import test from '../config';
import { WXTZOven } from '../../src/index';
import { expect } from 'chai';
import { setup } from './before';
import { wXTZConfig } from '../../src/types';

let wXTZConfig: wXTZConfig;

before(() => {
  wXTZConfig = setup();
});

describe('WXTZOven.ts', () => {
  describe('initializing oven that has no delegate', () => {
    let wXTZOven: WXTZOven;

    beforeEach(() => {
      wXTZOven = new WXTZOven(test.ovenWithoutDelegate, wXTZConfig, test.deployment);
    });

    it('can instantiate the oven class', () => {
      const wXTZOvenClass = new WXTZOven(test.ovenWithoutDelegate, wXTZConfig, test.deployment);

      expect(wXTZOvenClass).to.be.instanceOf(WXTZOven);
    });

    it('can check whether oven address belongs to known deployment', () => {
      const wXTZOvenWithDelegate = new WXTZOven(test.ovenWithDelegate, wXTZConfig, test.deployment);

      const isKnownDeployment = wXTZOvenWithDelegate.checkAddress();

      expect(isKnownDeployment).to.be.true;
    });

    it('initializes with oven address', async () => {
      await wXTZOven.initialize();

      expect(wXTZOven.getAddress()).to.equal(test.ovenWithoutDelegate);
    });

    describe('after initializing oven', () => {
      beforeEach(async () => {
        // making sure that oven class is initialized when running tests below separately
        await wXTZOven.initialize();
      });

      it('can get core address associated with oven', async () => {
        const coreAddress = await wXTZOven.getCoreAddress();

        expect(coreAddress).to.equal(test.core);
      });

      it('can check for correct contract code', async () => {
        const isValidCode = await wXTZOven.checkContractCodeIntegrity();

        expect(isValidCode).to.be.true;
      });

      it('can retrieve balance for oven', async () => {
        const ovenBalance = (await wXTZOven.getBalance()).toNumber();

        // this value is from migration
        expect(ovenBalance).to.equal(100);
      });

      it('can retrieve delegate that has not been set for oven', async () => {
        const delegateFetched = await wXTZOven.getDelegate();

        expect(delegateFetched).to.be.null;
      });

      it('can set delegate for oven', async () => {
        const operation = await (await wXTZOven.setDelegate(test.delegate.pkh)).send();

        await operation.confirmation(1);
        const delegateFetched = await wXTZOven.getDelegate();
        expect(delegateFetched).to.equal(test.delegate.pkh);
      });

      it.skip('can retrieve transaction history', async () => {});

      it('can deposit XTZ to oven', async () => {
        const balanceBefore = (await wXTZOven.getBalance()).toNumber();

        const operation = await (await wXTZOven.deposit()).send({ amount: test.amount, mutez: true });

        await operation.confirmation(1);
        const balanceAfter = (await wXTZOven.getBalance()).toNumber();
        expect(balanceAfter).to.equal(balanceBefore + test.amount);
      });

      it('can withdraw XTZ from oven', async () => {
        const balanceBefore = (await wXTZOven.getBalance()).toNumber();

        const operation = await (await wXTZOven.withdraw(test.amount)).send();

        await operation.confirmation(1);
        const balanceAfter = (await wXTZOven.getBalance()).toNumber();
        expect(balanceAfter).to.equal(balanceBefore - test.amount);
      });
    });

    describe('initializing oven that has a delegate', () => {
      let wXTZOven: WXTZOven;

      beforeEach(async () => {
        wXTZOven = new WXTZOven(test.ovenWithDelegate, wXTZConfig, test.deployment);
        await wXTZOven.initialize();
      });

      it('can retrieve delegate that has been set for oven', async () => {
        const delegateFetched = await wXTZOven.getDelegate();

        expect(delegateFetched).to.equal(test.delegate.pkh);
      });

      it('can remove delegate', async () => {
        const operation = await (await wXTZOven.removeDelegate()).send();

        await operation.confirmation(1);
        const delegateFetched = await wXTZOven.getDelegate();
        expect(delegateFetched).to.be.null;
      });
    });
  });
});
