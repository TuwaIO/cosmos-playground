import { Transaction } from '@tuwaio/pulsar-core';

import { wagmiConfig } from '@/configs/appConfig';
import { increment } from '@/transactions/evm/increment';

import { incrementGelato } from './evm/incrementGelato';

export const txActions = {
  incrementEvm: () => increment({ wagmiConfig }),
  incrementGelato: () => incrementGelato(),
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
