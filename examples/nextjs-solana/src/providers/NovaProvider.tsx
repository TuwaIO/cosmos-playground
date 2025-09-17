import { NovaProvider as NP } from '@tuwaio/nova-transactions/providers';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';

import { createSolanaAdapterParams } from '@/configs/solanaAdapter';
import { usePulsarStore } from '@/hooks/txTrackingHooks';

export function NovaProvider() {
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);

  useInitializeTransactionsPool({ initializeTransactionsPool });

  const wallet = useWalletUi();

  return (
    <NP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      handleTransaction={handleTransaction}
      connectedWalletAddress={wallet?.account?.address.toString()}
      connectedAdapterType={TransactionAdapter.SOLANA}
      adapters={[solanaAdapter({ ...createSolanaAdapterParams({ wallet }) })]}
    />
  );
}
