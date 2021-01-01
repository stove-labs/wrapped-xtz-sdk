import { Partial, Record, Static, String } from 'runtypes';

export const SdkSettingsRunType = Record({
  blockchainIndexerUrl: String,
});

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

export type Deployment = Static<typeof DeploymentRunType>;

export const DeplyomentsRunType = Record({
  mainnet: DeploymentRunType,
  delphinet: DeploymentRunType,
  localhost: DeploymentRunType,
});

export type Deployments = Static<typeof DeplyomentsRunType>;
