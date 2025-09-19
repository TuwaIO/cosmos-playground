'use client';

import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill';
import { TxActionButton as TAB } from '@tuwaio/nova-transactions';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { UiWalletAccount, useWalletAccountTransactionSendingSigner, WalletUiContextValue } from '@wallet-ui/react';
import { generateKeyPairSigner } from 'gill';
import React from 'react';

import { useStore } from '@/hooks/storeHook';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions, TxType } from '@/transactions';

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519();

export const TxActionButtonInitialize = ({ walletUi }: { walletUi: WalletUiContextValue }) => {
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);

  const signer = useWalletAccountTransactionSendingSigner(walletUi.account as UiWalletAccount, walletUi.cluster.id);

  const handleInitialize = async () => {
    const solanatest = await generateKeyPairSigner();
    await handleTransaction({
      actionFunction: () => txActions.initializeSolana({ client: walletUi.client, signer, solanatest }),
      onSuccessCallback: async () => await getAccounts(walletUi),
      params: {
        type: TxType.initialize,
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: walletUi.cluster.urlOrMoniker,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: 'Initialize Counter',
        description: 'Initializing the counter. This will create a new account if it does not exist.',
        payload: {
          account: solanatest.address.toString(),
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
      className={`
        w-full h-full p-2.5 rounded-xl border border-transparent
        text-[var(--tuwa-text-on-accent)] font-semibold shadow-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]
        hover:from-[var(--tuwa-button-gradient-from-hover)] hover:to-[var(--tuwa-button-gradient-to-hover)] hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
      disabled={!walletUi.connected}
      walletAddress={walletUi.account?.publicKey.toString()}
    >
      <div className="flex items-center justify-center space-x-2">
        <DocumentDuplicateIcon className="w-5 h-5" />
        <span className="text-sm leading-none">Initialize New Counter</span>
      </div>
    </TAB>
  );
};
