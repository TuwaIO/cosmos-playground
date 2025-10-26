import { NovaTransactionsProvider as NP } from '@tuwaio/nova-transactions/providers';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { useAccount } from 'wagmi';

import { usePulsarStore } from '@/hooks/txTrackingHooks';

export function NovaProvider() {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  useInitializeTransactionsPool({ initializeTransactionsPool });

  const { address } = useAccount();

  return (
    <NP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      executeTxAction={executeTxAction}
      connectedWalletAddress={address}
      connectedAdapterType={OrbitAdapter.EVM}
      adapter={getAdapter()}
    />
  );
}
