import { binToHex, instantiateSha256, utf8ToBin } from '@bitauth/libauth';
import { TezosMessageUtils, TezosParameterFormat } from 'conseiljs';

import { arbitraryValue, michelsonType, packedLambda } from '../types';

export class ByteConversionUtils {
  public static unpack(packedLambda: packedLambda, michelsonType?: michelsonType): arbitraryValue {
    if (michelsonType === undefined) {
      michelsonType = '';
    }
    return TezosMessageUtils.readPackedData(packedLambda, michelsonType);
  }

  public static packMichelson(code: string, type: string) {
    return this.pack(code, type, TezosParameterFormat.Michelson);
  }

  public static async checkIntegrity(checksum: string, contractCode: string): Promise<boolean> {
    const contractHash = await this.sha256(contractCode);
    return checksum == contractHash ? true : false;
  }

  private static pack(code: string, type: string, format: TezosParameterFormat) {
    return TezosMessageUtils.writePackedData(code, type, format);
  }

  private static async sha256(message: string): Promise<string> {
    const sha256 = await instantiateSha256();
    return binToHex(sha256.hash(utf8ToBin(message)));
  }
}
