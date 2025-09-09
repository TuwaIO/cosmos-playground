import { NovaProvider as NP } from '@tuwaio/nova-transactions/providers';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { useAccount } from 'wagmi';

import { appChains, config } from '@/configs/wagmiConfig';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions } from '@/transactions/actions';

export function NovaProvider() {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);

  useInitializeTransactionsPool(initializeTransactionsPool);

  const { address } = useAccount();

  return (
    <NP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      handleTransaction={handleTransaction}
      actions={txActions}
      connectedWalletAddress={address}
      connectedAdapterType={TransactionAdapter.EVM}
      adapters={[evmAdapter(config, appChains)]}
    />
  );
}
