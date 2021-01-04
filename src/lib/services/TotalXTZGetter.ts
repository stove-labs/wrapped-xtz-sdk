import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { address, TezosBalance } from '../types';

export async function getTotalXTZBalance(
  tezosAddresses: address[],
  tezosToolkitInstance: TezosToolkit
): Promise<TezosBalance> {
  const balances: TezosBalance[] = await getBalances(tezosAddresses, tezosToolkitInstance);

  return sumBalances(balances);
}

async function getBalances(ovens: address[], Tezos: TezosToolkit): Promise<TezosBalance[]> {
  const balancePromises = ovens.map((address) => Tezos.tz.getBalance(address));

  return await Promise.all(balancePromises);
}

function sumBalances(balances: TezosBalance[]): TezosBalance {
  return balances.reduce((totalBalance, balance) => totalBalance.plus(balance), new BigNumber(0));
}
