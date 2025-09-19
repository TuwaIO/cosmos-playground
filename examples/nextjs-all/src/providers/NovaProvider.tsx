import { NovaProvider as NP } from '@tuwaio/nova-transactions/providers';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { useWalletUi } from '@wallet-ui/react';
import { useAccount } from 'wagmi';

import { usePulsarStore } from '@/hooks/txTrackingHooks';

export function NovaProvider() {
  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);

  useInitializeTransactionsPool({ initializeTransactionsPool });

  const wallet = useWalletUi();
  const { address } = useAccount();

  return (
    <NP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      handleTransaction={handleTransaction}
      connectedWalletAddress={wallet.connected ? wallet?.account?.address.toString() : address}
      connectedAdapterType={wallet.connected ? TransactionAdapter.SOLANA : TransactionAdapter.EVM}
      adapter={getAdapter()}
    />
  );
}
