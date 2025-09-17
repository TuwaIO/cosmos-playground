import { Transaction } from '@tuwaio/pulsar-core';

import { config } from '../../configs/wagmiConfig';
import { increment } from './increment';

export enum TxType {
  increment = 'increment',
}

type IncrementTx = Transaction & {
  type: TxType.increment;
  payload: {
    value: number;
  };
};

export type TransactionUnion = IncrementTx;

export const txActions = {
  increment: () => increment({ wagmiConfig: config }),
};
