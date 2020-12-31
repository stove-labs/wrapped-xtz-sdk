import BigNumber from 'bignumber.js';
import { Partial, Record, Static, String } from 'runtypes';

import config from '../config/config.json';
import deploymentsJson from '../config/deployments.json';
import { WrappedXTZBalance } from '../types/types';

const ConfigRunType = Record({
  indexerBaseUrl: String,
});

type Config = Static<typeof ConfigRunType>;

const ContractDeploymentsRunTime = Record({
  checksum: String,
}).And(
  Partial({
    address: String,
  })
);

const DeploymentRunType = Record({
  core: ContractDeploymentsRunTime,
  oven: ContractDeploymentsRunTime,
  token: ContractDeploymentsRunTime,
  lambdaCreateOven: ContractDeploymentsRunTime,
});

type Deployment = Static<typeof DeploymentRunType>;

const DeplyomentsRunType = Record({
  mainnet: DeploymentRunType,
  delphinet: DeploymentRunType,
  localhost: DeploymentRunType,
});

type Deployments = Static<typeof DeplyomentsRunType>;

// do guard checks
if (!ConfigRunType.guard(config)) {
  throw new Error('config file is corrupted');
}

if (!DeplyomentsRunType.guard(deploymentsJson)) {
  throw new Error('deployments config file is corrupted');
}

const defaultBalance: WrappedXTZBalance = new BigNumber(0);

export class Constants {
  public static readonly indexerBaseUrl: string = config.indexerBaseUrl;
  public static readonly deployments: Deployments = deploymentsJson;
  public static readonly defaultBalance: BigNumber = defaultBalance;
}

export { Deployment };
