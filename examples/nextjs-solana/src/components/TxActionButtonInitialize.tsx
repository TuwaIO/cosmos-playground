'use client';

import { TxActionButton as TAB } from '@tuwaio/nova-transactions';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { UiWalletAccount, useWalletAccountTransactionSendingSigner, WalletUiContextValue } from '@wallet-ui/react';

import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions } from '@/transactions/actions';
import { TxType } from '@/transactions/onSucceedCallbacks';

export const TxActionButtonInitialize = ({ walletUi }: { walletUi: WalletUiContextValue }) => {
  // Pulsar store hooks
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);

  const signer = useWalletAccountTransactionSendingSigner(walletUi.account as UiWalletAccount, walletUi.cluster.id);

  const handleInitialize = async () => {
    await handleTransaction({
      actionFunction: () => txActions.initialize({ client: walletUi.client, signer }),
      params: {
        type: TxType.initialize,
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: walletUi.cluster.urlOrMoniker,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: 'Initialize Counter',
        description: 'Initializing the counter. This will create a new account if it does not exist.',
        payload: {
          account: walletUi.account?.address.toString() ?? '',
        },
        withTrackedModal: true,
      },
    });
  };

  return (
    <TAB
      action={handleInitialize}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      className="w-full h-full bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] hover:from-[var(--tuwa-button-gradient-from-hover)] hover:to-[var(--tuwa-button-gradient-to-hover)] text-[var(--tuwa-text-on-accent)] font-semibold rounded-xl transition-all duration-200 ease-in-out hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none"
      disabled={!walletUi.connected}
      walletAddress={walletUi.account?.publicKey.toString()}
    >
      <span className="text-xl leading-none contents text-[var(--tuwa-text-on-accent)]">+</span>
      <span className="leading-none">Initialize Counter</span>
    </TAB>
  );
};
