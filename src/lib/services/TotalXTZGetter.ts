import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { address, TezosBalance } from '../../types/types';

export class TotalXTZGetter {
  public static async get(tezosAddresses: address[], tezosToolkitInstance: TezosToolkit): Promise<TezosBalance> {
    const balances: TezosBalance[] = await this.getBalances(tezosAddresses, tezosToolkitInstance);

    return this.sumBalances(balances);
  }

  private static async getBalances(ovens: address[], Tezos: TezosToolkit): Promise<TezosBalance[]> {
    const balancePromises = ovens.map((address) => Tezos.tz.getBalance(address));

    return await Promise.all(balancePromises);
  }

  private static sumBalances(balances: TezosBalance[]): TezosBalance {
    return balances.reduce((totalBalance, balance) => totalBalance.plus(balance), new BigNumber(0));
  }
}
