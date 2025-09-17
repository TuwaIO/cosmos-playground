import { Transaction } from '@tuwaio/pulsar-core';
import { Config } from '@wagmi/core';

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
  increment: ({ config }: { config: Config }) => increment({ wagmiConfig: config }),
};
