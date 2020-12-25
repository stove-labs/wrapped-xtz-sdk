import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';

import { arbitraryValue, bytes, michelsonType } from '../types/types';

export function unpack(packedBytes: bytes, michelsonType: michelsonType): arbitraryValue {
  return TezosMessageUtils.readPackedData(packedBytes, michelsonType);
}

export function packMichelson(code: string, type: string) {
  return pack(code, type, TezosParameterFormat.Michelson);
}

function pack(code: string, type: string, format: TezosParameterFormat) {
  return TezosMessageUtils.writePackedData(code, type, format);
}
