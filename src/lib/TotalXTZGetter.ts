import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { address, TezosBalance } from '../types/types';

export class TotalXTZGetter {
  /**
   * Sums up the XTZ balances for a given set of addresses.
   *
   * @param addresses List of Tezos addresses.
   * @param Tezos Taquito TezosToolKit instance to communicate with the blockchain network.
   */
  public static async get(addresses: address[], Tezos: TezosToolkit): Promise<TezosBalance> {
    const balances = await this.getBalances(addresses, Tezos);

    return this.sumBalances(balances);
  }

  private static async getBalances(ovens: address[], Tezos: TezosToolkit) {
    const balancePromises = ovens.map((address) => Tezos.tz.getBalance(address));
    return await Promise.all(balancePromises);
  }

  private static sumBalances(balances: BigNumber[]) {
    const totalBalance: TezosBalance = balances.reduce(function (totalBalance, balance) {
      return totalBalance.plus(balance);
    }, new BigNumber(0));
    return totalBalance;
  }
}
