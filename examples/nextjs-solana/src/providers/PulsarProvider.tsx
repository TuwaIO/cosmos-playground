'use client';

import { createPulsarStore } from '@tuwaio/pulsar-core';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';
import { PropsWithChildren, useMemo } from 'react';

import { createSolanaAdapterParams } from '@/configs/solanaAdapter';
import { useStore } from '@/hooks/storeHook';
import { PulsarStoreContext } from '@/hooks/txTrackingHooks';
import { TransactionUnion, TxType } from '@/transactions';

const storageName = 'transactions-tracking-storage';

export function PulsarProvider({ children }: PropsWithChildren) {
  const wallet = useWalletUi();
  const getAccounts = useStore((store) => store.getAccounts);

  const store = useMemo(() => {
    async function onSucceedCallbacks(tx: TransactionUnion) {
      switch (tx.type) {
        case TxType.initialize:
          await getAccounts(wallet);
          break;
        case TxType.increment:
          await getAccounts(wallet);
          break;
      }
    }

    return createPulsarStore<TransactionUnion>({
      name: storageName,
      onSucceedCallbacks,
      adapter: solanaAdapter({ ...createSolanaAdapterParams({ wallet }) }),
    });
  }, [wallet, getAccounts]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}
