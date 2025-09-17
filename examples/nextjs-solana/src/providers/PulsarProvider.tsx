'use client';

import { createPulsarStore } from '@tuwaio/pulsar-core';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';
import { PropsWithChildren, useMemo } from 'react';

import { createSolanaAdapterParams } from '@/configs/solanaAdapter';
import { PulsarStoreContext } from '@/hooks/txTrackingHooks';
import { TransactionUnion } from '@/transactions';

const storageName = 'transactions-tracking-storage';

export function PulsarProvider({ children }: PropsWithChildren) {
  const wallet = useWalletUi();

  const store = useMemo(() => {
    return createPulsarStore<TransactionUnion>({
      name: storageName,
      adapter: solanaAdapter({ ...createSolanaAdapterParams({ wallet }) }),
    });
  }, [wallet]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}
