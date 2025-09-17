'use client';

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm';

import { appChains, config } from '../configs/wagmiConfig';
import { onSucceedCallbacks, TransactionUnion } from '../transactions/onSucceedCallbacks';

const storageName = 'transactions-tracking-storage';

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: storageName,
    onSucceedCallbacks,
    adapter: evmAdapter(config, appChains),
  }),
);
