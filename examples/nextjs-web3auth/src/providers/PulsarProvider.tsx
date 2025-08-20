'use client';

import { createPulsarStore } from '@tuwaio/pulsar-core';
import { ActionTxKey, evmAdapter, TransactionTracker } from '@tuwaio/pulsar-evm';
import { PropsWithChildren, useMemo } from 'react';
import { useConfig } from 'wagmi';

import { appChains } from '@/constants';
import { PulsarStoreContext } from '@/hooks/txTrackingHooks';
import { onSucceedCallbacks, TransactionUnion } from '@/transactions/onSucceedCallbacks';

const storageName = 'transactions-tracking-storage';

export function PulsarProvider({ children }: PropsWithChildren) {
  const config = useConfig();

  const store = useMemo(() => {
    return createPulsarStore<TransactionTracker, TransactionUnion, ActionTxKey>({
      name: storageName,
      onSucceedCallbacks,
      adapters: [evmAdapter(config, appChains)],
    });
  }, [config]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}
