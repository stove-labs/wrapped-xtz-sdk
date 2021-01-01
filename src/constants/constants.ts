import BigNumber from 'bignumber.js';

import deploymentsJson from '../config/deployments.json';
import config from '../config/sdkSettings.json';
import { WrappedXTZBalance } from '../lib/types';

import { Deployments, DeplyomentsRunType, SdkSettingsRunType } from './runTypes';

// do guard checks
if (!SdkSettingsRunType.guard(config)) {
  throw new Error('sdk settings file is corrupted');
}

if (!DeplyomentsRunType.guard(deploymentsJson)) {
  throw new Error('deployments properties file is corrupted');
}

const defaultBalance: WrappedXTZBalance = new BigNumber(0);

export class Constants {
  public static readonly indexerBaseUrl: string = config.blockchainIndexerUrl;
  public static readonly deployments: Deployments = deploymentsJson;
  public static readonly defaultBalance: BigNumber = defaultBalance;
}
