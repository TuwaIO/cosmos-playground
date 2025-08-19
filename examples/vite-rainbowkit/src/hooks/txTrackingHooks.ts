'use client';

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { ActionTxKey, evmAdapter, TransactionTracker } from '@tuwaio/pulsar-evm';

import { appChains, config } from '../configs/wagmiConfig';
import { onSucceedCallbacks, TransactionUnion } from '../transactions/onSucceedCallbacks';

const storageName = 'transactions-tracking-storage';

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionTracker, TransactionUnion, ActionTxKey>({
    name: storageName,
    onSucceedCallbacks,
    adapters: [evmAdapter(config, appChains)],
  }),
);
