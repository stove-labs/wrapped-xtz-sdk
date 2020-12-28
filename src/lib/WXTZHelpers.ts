import { binToHex, instantiateSha256, utf8ToBin } from '@bitauth/libauth';
import axios from 'axios';
import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';

import { address, arbitraryValue, bytes, contractInfoFromRpc, michelsonType } from '../types/types';

export function unpack(packedBytes: bytes, michelsonType?: michelsonType): arbitraryValue {
  if (michelsonType === undefined) {
    michelsonType = '';
  }
  return TezosMessageUtils.readPackedData(packedBytes, michelsonType);
}

function pack(code: string, type: string, format: TezosParameterFormat) {
  return TezosMessageUtils.writePackedData(code, type, format);
}

export function packMichelson(code: string, type: string) {
  return pack(code, type, TezosParameterFormat.Michelson);
}

export async function sha256(message: string): Promise<string> {
  const sha256 = await instantiateSha256();
  return binToHex(sha256.hash(utf8ToBin(message)));
}

export async function checkIntegrity(checksum: string, contractCode: string): Promise<boolean> {
  const contractHash = await sha256(contractCode);
  return checksum == contractHash ? true : false;
}

export async function fetchContractCode(contractAddress: address, rpcUrl: string): Promise<string> {
  const response = await axios.get(`${rpcUrl}/chains/main/blocks/head/context/contracts/${contractAddress}`);
  const contractInfoFromRpc: contractInfoFromRpc = response.data;
  return JSON.stringify(contractInfoFromRpc.script.code);
}
