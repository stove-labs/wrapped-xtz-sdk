import { address, blockHeight, micheline } from '../types';

export declare type contractInfoFromRpc = {
  balance: number;
  script: {
    code: micheline;
    storage: any;
  };
};

export declare type contractDetail = {
  timestamp: string;
  level: blockHeight;
  last_action: string;
};

export declare type ovenBcdResponse = {
  data: {
    key_string: address;
    level: blockHeight;
    timestamp: Date;
  };
};
