'use client';

import { TxActionButton as TAB } from '@tuwaio/nova-transactions';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { UiWalletAccount, useWalletAccountTransactionSendingSigner, WalletUiContextValue } from '@wallet-ui/react';
import { Address } from 'gill';
import React from 'react';

import { useStore } from '@/hooks/storeHook';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions, TxType } from '@/transactions';

export const TxActionButtonClose = ({
  walletUi,
  solanatest,
}: {
  walletUi: WalletUiContextValue;
  solanatest: Address;
}) => {
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);
  const removeAccFromStore = useStore((state) => state.removeAccFromStore);

  const signer = useWalletAccountTransactionSendingSigner(walletUi.account as UiWalletAccount, walletUi.cluster.id);

  const handleClose = async () => {
    await handleTransaction({
      actionFunction: () => txActions.close({ client: walletUi.client, signer, solanatest }),
      onSuccessCallback: async () => {
        await getAccounts(walletUi);
        removeAccFromStore(solanatest.toString());
      },
      params: {
        type: TxType.close,
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: walletUi.cluster.urlOrMoniker,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Closing', 'Closed', 'Error', 'Replaced'],
        description: [
          `The counter will be closed.`,
          `Success! The counter is closed.`,
          'An error occurred during closing.',
          'Transaction was replaced.',
        ],
        withTrackedModal: true,
      },
    });
  };

  return (
    <TAB
      action={handleClose}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      disabled={!walletUi.connected}
      walletAddress={walletUi.account?.publicKey.toString()}
      className={`
        w-full p-2.5 rounded-xl border border-transparent
        text-gray-800 font-semibold shadow-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400
        bg-gradient-to-r from-neutral-200 to-neutral-300
        hover:from-neutral-300 hover:to-neutral-400 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
    >
      <span className="text-sm leading-none">Close</span>
    </TAB>
  );
};
