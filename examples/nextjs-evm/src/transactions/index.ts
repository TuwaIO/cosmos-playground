import { Transaction } from '@tuwaio/sdk/pulsar';

import { wagmiConfig } from '@/configs/appConfig';
import { increment } from '@/transactions/evm/increment';
import { incrementPimlico } from '@/transactions/evm/incrementPimlico';

export const txActions = {
  incrementEvm: () => increment({ wagmiConfig }),
  incrementPimlicoEvm: () => incrementPimlico({ wagmiConfig }),
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
