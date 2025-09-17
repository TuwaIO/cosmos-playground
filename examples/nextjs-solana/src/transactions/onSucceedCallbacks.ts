import { Transaction } from '@tuwaio/pulsar-core';

export enum TxType {
  initialize = 'initialize',
  increment = 'increment',
}

type InitializeTx = Transaction & {
  type: TxType.initialize;
  payload: {
    account: string;
  };
};

type IncrementTx = Transaction & {
  type: TxType.increment;
  payload: {
    value: number;
  };
};

export type TransactionUnion = InitializeTx | IncrementTx;

export async function onSucceedCallbacks(tx: TransactionUnion) {
  switch (tx.type) {
    case TxType.initialize:
      console.log('tx initialize executed');
      break;
    case TxType.increment:
      console.log('tx increment executed');
      break;
  }
}
