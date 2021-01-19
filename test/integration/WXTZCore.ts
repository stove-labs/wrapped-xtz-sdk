import test from '../config';
import { expect } from 'chai';
import { setup } from './before';
import { address, wXTZConfig } from '../../src/types';
import { WXTZCore } from '../../src/index';

let wXTZConfig: wXTZConfig;

before(() => {
  wXTZConfig = setup();
});

describe('WXTZCore.ts', () => {
  describe('initializing core class', () => {
    let wXTZCore: WXTZCore;

    beforeEach(() => {
      wXTZCore = new WXTZCore(test.core, wXTZConfig, test.deployment);
    });

    it('can instantiate the core class', () => {
      const wXTZCoreClass = new WXTZCore(test.ovenWithoutDelegate, wXTZConfig, test.deployment);

      expect(wXTZCoreClass).to.be.instanceOf(WXTZCore);
    });

    it('initializes with core address', async () => {
      await wXTZCore.initialize();

      expect(wXTZCore.getAddress()).to.equal(test.core);
    });

    describe('after initializing core', () => {
      beforeEach(async () => {
        // making sure that core class is initialized when running tests below separately
        await wXTZCore.initialize();
      });

      it('can check for contract code integrity', async () => {
        const isValidCode = await wXTZCore.checkContractCodeIntegrity();

        expect(isValidCode).to.be.true;
      });

      it('can get token contract address', async () => {
        const tokenContractAddress = await wXTZCore.getWXTZTokenContractAddress();

        expect(tokenContractAddress).to.equal(test.token);
      });

      it('can get owner address for given oven', async () => {
        const ovenOwnerAddress = await wXTZCore.getOwnerAddressForOven(test.ovenWithDelegate);

        expect(ovenOwnerAddress).to.equal(test.ovenOwner.pkh);
      });

      // until BBBOX gets updated, it is not testable in sandbox
      it.skip('can get all oven addresses for oven owner', async () => {
        const fetchedOvenAddresses: address[] = await wXTZCore.getAllOvenAddressesByOwner(test.ovenOwner);

        const ovenAddresses = [test.ovenWithDelegate, test.ovenWithoutDelegate];
        expect(fetchedOvenAddresses).to.have.lengthOf(2).and.to.deep.equal(ovenAddresses);
      });

      // until BBBOX gets updated, it is not testable in sandbox
      it.skip('can get total locked XTZ for oven owner', async () => {
        const totalLockedXTZ = await wXTZCore.getTotalLockedXTZ(test.ovenOwner);

        expect(totalLockedXTZ.toNumber()).to.equal(100);
      });

      it('can create oven', async () => {
        const createOvenContractMethod = await wXTZCore.createOven(test.dave.pkh, test.delegate.pkh);

        const createOvenOperation = await createOvenContractMethod.send({
          amount: 100,
          mutez: true,
        });

        await createOvenOperation.confirmation(1);
        const operationResults = (await createOvenOperation.operationResults) as any;
        const internalOperationResult = operationResults[0].metadata.internal_operation_results;

        const originationOperation = internalOperationResult[0];
        expect(originationOperation.kind).to.be.equal('origination');
        expect(originationOperation.balance).to.be.equal('100');
        expect(originationOperation.delegate).to.be.equal(test.delegate.pkh);
        expect(originationOperation.source).to.be.equal(test.core);
      });

      it('can create oven without delegate', async () => {
        const createOvenContractMethod = await wXTZCore.createOven(test.dave.pkh);

        const createOvenOperation = await createOvenContractMethod.send({
          amount: 100,
          mutez: true,
        });

        await createOvenOperation.confirmation(1);
        const operationResults = (await createOvenOperation.operationResults) as any;
        const internalOperationResult = operationResults[0].metadata.internal_operation_results;

        const originationOperation = internalOperationResult[0];
        expect(originationOperation.kind).to.be.equal('origination');
        expect(originationOperation.balance).to.be.equal('100');
        expect(originationOperation.delegate).to.be.undefined;
        expect(originationOperation.source).to.be.equal(test.core);
      });
    });
  });
});
