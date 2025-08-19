import { TransactionsWidget } from '@tuwaio/nova-transactions/dist/providers';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { useAccount } from 'wagmi';

import { appChains, config } from '@/configs/wagmiConfig';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions } from '@/transactions/actions';

export function TxWidgetProvider() {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);

  useInitializeTransactionsPool(initializeTransactionsPool);

  const { address, chain } = useAccount();

  return (
    <TransactionsWidget
      appChains={appChains}
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      config={config}
      handleTransaction={handleTransaction}
      actions={txActions}
      chain={chain}
      walletAddress={address}
    />
  );
}
