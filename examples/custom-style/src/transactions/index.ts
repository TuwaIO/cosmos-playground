import { Transaction } from '@tuwaio/pulsar-core';

import { wagmiConfig } from '../configs/appConfig';
import { increment } from './evm/increment';

export const txActions = {
  incrementEvm: () => increment({ wagmiConfig }),
};

export enum TxType {
  increment = 'increment',
}

type IncrementTx = Transaction & {
  type: TxType.increment;
  payload: {
    contractAddress: string;
    value: number;
  };
};

export type TransactionUnion = IncrementTx;
