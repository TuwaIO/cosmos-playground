import { Transaction } from '@tuwaio/pulsar-core';
import { Address, KeyPairSigner, SolanaClient, TransactionSendingSigner } from 'gill';

import { wagmiConfig } from '../configs/appConfig';
import { increment } from './evm/increment';
import { incrementGelato } from './evm/incrementGelato';
import { close } from './solana/close';
import { decrement } from './solana/decrement';
import { increment as incrementSolana } from './solana/increment';
import { initialize } from './solana/initialize';

export type BaseTxParams = {
  client: SolanaClient;
  signer: TransactionSendingSigner;
  contractAddress: Address;
};

export const txActions = {
  incrementEvm: () => increment({ wagmiConfig }),
  incrementGelato: () => incrementGelato(),
  incrementSolana: ({ client, signer, contractAddress }: BaseTxParams) =>
    incrementSolana({ client, signer, contractAddress }),
  decrementSolana: ({ client, signer, contractAddress }: BaseTxParams) =>
    decrement({ client, signer, contractAddress }),
  closeSolana: ({ client, signer, contractAddress }: BaseTxParams) => close({ client, signer, contractAddress }),
  initializeSolana: ({
    client,
    signer,
    contractAddress,
  }: Omit<BaseTxParams, 'contractAddress'> & { contractAddress: KeyPairSigner<string> }) =>
    initialize({ client, signer, contractAddress }),
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
    contractAddress: string;
  };
};

type IncrementTx = Transaction & {
  type: TxType.increment;
  payload: {
    contractAddress: string;
    value: number;
  };
};

type DecrementTx = Transaction & {
  type: TxType.decrement;
  payload: {
    contractAddress: string;
    value: number;
  };
};

type CloseTx = Transaction & {
  type: TxType.close;
  payload: {
    contractAddress: string;
  };
};

export type TransactionUnion = InitializeTx | IncrementTx | DecrementTx | CloseTx;
