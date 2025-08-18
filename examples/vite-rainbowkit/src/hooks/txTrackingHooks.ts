import { createTxTrackingStore } from '@tuwaio/evm-transactions-tracking';
import { createBoundedUseStore } from '@tuwaio/web3-transactions-tracking-core';

import { appChains } from '../configs/wagmiConfig';
import { onSucceedCallbacks, TransactionUnion } from '../transactions/onSucceedCallbacks';

const storageName = 'transactions-tracking-storage';

export const useTxTrackingStore = createBoundedUseStore(
  createTxTrackingStore<TransactionUnion>({
    name: storageName,
    appChains,
    onSucceedCallbacks,
  }),
);
