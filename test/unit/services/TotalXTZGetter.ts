import { TezosToolkit, TzProvider } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import { instance, mock, when } from 'ts-mockito';
import { expect } from 'chai';
import { getTotalXTZBalance } from '../../../src/services/TotalXTZGetter';

let mockedTezosToolkit: TezosToolkit;

before('setup mock context', () => {
  mockedTezosToolkit = mock(TezosToolkit);
  const tzProvider: TzProvider = mock<TzProvider>();

  when(tzProvider.getBalance('test-address1')).thenResolve(new BigNumber(10));
  when(tzProvider.getBalance('test-address2')).thenResolve(new BigNumber(10));
  when(tzProvider.getBalance('test-address3')).thenResolve(new BigNumber(50));
  when(mockedTezosToolkit.tz).thenReturn(instance(tzProvider));
});

describe('TotalXTZGetter.ts', () => {
  it('can calculate sum for no address', async () => {
    const addresses: string[] = [];

    const totalXtz = await getTotalXTZBalance(addresses, instance(mockedTezosToolkit));

    expect(totalXtz.toNumber()).to.equal(0);
  });

  it('can calculate sum for a single address', async () => {
    const addresses = ['test-address1'];

    const totalXtz = await getTotalXTZBalance(addresses, instance(mockedTezosToolkit));

    expect(totalXtz.toNumber()).to.equal(10);
  });

  it('can calculate sum for multiple addresses', async () => {
    const addresses = ['test-address2', 'test-address3'];

    const totalXtz = await getTotalXTZBalance(addresses, instance(mockedTezosToolkit));

    expect(totalXtz.toNumber()).to.equal(60);
  });
});
