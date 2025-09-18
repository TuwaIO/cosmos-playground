import { Transaction } from '@tuwaio/pulsar-core';
import { SolanaClient, TransactionSendingSigner } from 'gill';

import { increment, IncrementTxParams } from '@/transactions/increment';
import { initialize } from '@/transactions/initialize';

export type BaseTxParams = {
  client: SolanaClient;
  signer: TransactionSendingSigner;
};

export const txActions = {
  increment: ({ client, signer, solanatest }: IncrementTxParams) => increment({ client, signer, solanatest }),
  initialize: ({ client, signer }: BaseTxParams) => initialize({ client, signer }),
};

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
