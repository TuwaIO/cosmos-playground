import { NovaProvider as NP } from '@tuwaio/nova-transactions/providers';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { useAccount } from 'wagmi';

import { usePulsarStore } from '@/hooks/txTrackingHooks';

export function NovaProvider() {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  useInitializeTransactionsPool({ initializeTransactionsPool });

  const { address } = useAccount();

  return (
    <NP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      handleTransaction={handleTransaction}
      connectedWalletAddress={address}
      connectedAdapterType={TransactionAdapter.EVM}
      adapter={getAdapter()}
    />
  );
}
