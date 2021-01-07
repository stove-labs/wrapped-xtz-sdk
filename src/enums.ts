export enum ContractType {
  core = 'core',
  oven = 'oven',
  token = 'token',
  lambdaCreateOven = 'lambdaCreateOven',
}

export enum MichelsonType {
  createOven = 'pair (option key_hash) address',
  wXTZTokenContractAddress = 'address',
}

export enum NetworkType {
  mainnet = 'mainnet',
  delphinet = 'delphinet',
  localhost = 'localhost',
}
