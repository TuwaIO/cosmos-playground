import { TransactionTracker } from '@tuwaio/pulsar-evm';
import { Transaction } from '@tuwaio/pulsar-core';

export enum TxType {
  increment = 'increment',
}

type IncrementTx = Transaction<TransactionTracker> & {
  type: TxType.increment;
  payload: {
    value: number;
  };
};

export type TransactionUnion = IncrementTx;

export async function onSucceedCallbacks(tx: TransactionUnion) {
  switch (tx.type) {
    case TxType.increment:
      console.log('tx increment executed');
      break;
  }
}
