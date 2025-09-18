'use client';

import { TxActionButton as TAB } from '@tuwaio/nova-transactions';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { UiWalletAccount, useWalletAccountTransactionSendingSigner, WalletUiContextValue } from '@wallet-ui/react';
import { Address } from 'gill';

import { useStore } from '@/hooks/storeHook';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions, TxType } from '@/transactions';

export const TxActionButtonIncrement = ({
  walletUi,
  currentCount,
  solanatest,
}: {
  walletUi: WalletUiContextValue;
  currentCount: number;
  solanatest: Address;
}) => {
  // Pulsar store hooks
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);

  const signer = useWalletAccountTransactionSendingSigner(walletUi.account as UiWalletAccount, walletUi.cluster.id);

  const handleIncrement = async () => {
    await handleTransaction({
      actionFunction: () => txActions.increment({ client: walletUi.client, signer, solanatest }),
      onSuccessCallback: async () => {
        console.log('Increment succeed');
        await getAccounts(walletUi);
      },
      params: {
        type: TxType.increment,
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: walletUi.cluster.urlOrMoniker,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Incrementing', 'Incremented', 'Error', 'Replaced'],
        description: [
          `New value will be ${currentCount + 1}`,
          `Success! New value is ${currentCount + 1}`,
          'An error occurred during increment.',
          'Transaction was replaced.',
        ],
        payload: {
          previousCount: currentCount,
        },
        withTrackedModal: true,
      },
    });
  };

  return (
    <TAB
      action={handleIncrement}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      className="w-full h-full bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] hover:from-[var(--tuwa-button-gradient-from-hover)] hover:to-[var(--tuwa-button-gradient-to-hover)] text-[var(--tuwa-text-on-accent)] font-semibold rounded-xl transition-all duration-200 ease-in-out hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none"
      disabled={!walletUi.connected}
      walletAddress={walletUi.account?.publicKey.toString()}
    >
      <span className="text-xl leading-none contents text-[var(--tuwa-text-on-accent)]">+</span>
      <span className="leading-none">Increment Counter</span>
    </TAB>
  );
};
