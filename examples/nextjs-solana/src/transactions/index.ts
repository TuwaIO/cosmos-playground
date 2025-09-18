import { Transaction } from '@tuwaio/pulsar-core';
import { Address, KeyPairSigner, SolanaClient, TransactionSendingSigner } from 'gill';

import { close } from '@/transactions/close';
import { decrement } from '@/transactions/decrement';
import { increment } from '@/transactions/increment';
import { initialize } from '@/transactions/initialize';

export type BaseTxParams = {
  client: SolanaClient;
  signer: TransactionSendingSigner;
  solanatest: Address;
};

export const txActions = {
  increment: ({ client, signer, solanatest }: BaseTxParams) => increment({ client, signer, solanatest }),
  decrement: ({ client, signer, solanatest }: BaseTxParams) => decrement({ client, signer, solanatest }),
  close: ({ client, signer, solanatest }: BaseTxParams) => close({ client, signer, solanatest }),
  initialize: ({
    client,
    signer,
    solanatest,
  }: Omit<BaseTxParams, 'solanatest'> & { solanatest: KeyPairSigner<string> }) =>
    initialize({ client, signer, solanatest }),
};

export enum TxType {
  initialize = 'initialize',
  increment = 'increment',
  decrement = 'decrement',
  close = 'close',
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

type DecrementTx = Transaction & {
  type: TxType.decrement;
  payload: {
    value: number;
  };
};

type CloseTx = Transaction & {
  type: TxType.close;
  payload: undefined;
};

export type TransactionUnion = InitializeTx | IncrementTx | DecrementTx | CloseTx;
