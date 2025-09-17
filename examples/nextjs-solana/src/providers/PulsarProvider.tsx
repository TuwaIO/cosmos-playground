'use client';

import { createPulsarStore } from '@tuwaio/pulsar-core';
import { SolanaActionTxKey, solanaAdapter, SolanaTransactionTracker } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';
import { PropsWithChildren, useMemo } from 'react';

import { createSolanaAdapterParams } from '@/configs/solanaAdapter';
import { PulsarStoreContext } from '@/hooks/txTrackingHooks';
import { onSucceedCallbacks, TransactionUnion } from '@/transactions/onSucceedCallbacks';

const storageName = 'transactions-tracking-storage';

export function PulsarProvider({ children }: PropsWithChildren) {
  const wallet = useWalletUi();

  const store = useMemo(() => {
    return createPulsarStore<SolanaTransactionTracker, TransactionUnion, SolanaActionTxKey>({
      name: storageName,
      onSucceedCallbacks,
      adapters: [solanaAdapter({ ...createSolanaAdapterParams({ wallet }) })],
    });
  }, [wallet]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}
