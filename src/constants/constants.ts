import BigNumber from 'bignumber.js';

import deploymentsJson from '../defaultConfig/deployments.json';
import config from '../defaultConfig/sdkSettings.json';
import { Deployments, WrappedXTZBalance } from '../lib/types';

const defaultBalance: WrappedXTZBalance = new BigNumber(0);

export class Constants {
  public static readonly indexerBaseUrl: string = config.blockchainIndexerUrl;
  public static readonly deployments: Deployments = deploymentsJson;
  public static readonly defaultBalance: BigNumber = defaultBalance;
}
