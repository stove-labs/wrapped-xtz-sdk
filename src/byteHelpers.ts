import { binToHex, instantiateSha256, utf8ToBin } from '@bitauth/libauth';
import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';

import { arbitraryValue, michelsonType, packedLambda } from './types';

export function unpack(packedLambda: packedLambda, michelsonType?: michelsonType): arbitraryValue {
  if (michelsonType === undefined) {
    michelsonType = '';
  }
  return TezosMessageUtils.readPackedData(packedLambda, michelsonType);
}

export function packMichelson(code: string, type: string) {
  return pack(code, type, TezosParameterFormat.Michelson);
}

export async function checkIntegrity(checksum: string, contractCode: string): Promise<boolean> {
  const contractHashed = await sha256(contractCode);
  return checksum == contractHashed ? true : false;
}

function pack(code: string, type: string, format: TezosParameterFormat) {
  return TezosMessageUtils.writePackedData(code, type, format);
}

async function sha256(message: string): Promise<string> {
  const sha256 = await instantiateSha256();
  return binToHex(sha256.hash(utf8ToBin(message)));
}
