'use client';

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { ActionTxKey, TransactionTracker } from '@tuwaio/pulsar-evm';

import { onSucceedCallbacks, TransactionUnion } from '@/transactions/onSucceedCallbacks';

const storageName = 'transactions-tracking-storage';

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionTracker, TransactionUnion, ActionTxKey>({
    name: storageName,
    onSucceedCallbacks,
    adapters: [],
  }),
);
