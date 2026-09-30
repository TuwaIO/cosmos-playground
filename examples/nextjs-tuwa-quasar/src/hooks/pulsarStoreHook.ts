'use client';

import { pulsarEvmAdapter } from '@tuwaio/evm-sdk/pulsar';
import { preFlightTxCheck } from '@tuwaio/quasar-sdk/react';
import {
  createBoundedUseStore,
  createPulsarStore,
  createTxInMemoryStore,
  type TxInMemoryPagination,
} from '@tuwaio/sdk/pulsar';
import { pulsarSolanaAdapter } from '@tuwaio/solana-sdk/pulsar';

import { getHistory, syncTransaction } from '@/app/actions';
import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { TransactionUnion } from '@/transactions';

const pulsarStore = createPulsarStore<TransactionUnion>({
  name: 'transactions-tracking-storage-example',
  adapter: [pulsarEvmAdapter(wagmiConfig, appEVMChains), pulsarSolanaAdapter({ rpcUrls: solanaRPCUrls })],
  // Stops the transaction before the wallet prompt when the user is not signed in or Quasar does not respond
  beforeTxProcess: () => preFlightTxCheck(process.env.NEXT_PUBLIC_QUASAR_BASE_URL),
  // Throwing keeps the transaction marked as unsynced, so Pulsar sends it again later
  onRemoteCreate: async (tx) => {
    const result = await syncTransaction(tx);
    if (!result.success) throw new Error(result.error);
  },
});

export const usePulsarStore = createBoundedUseStore(pulsarStore);

// The local transactions together with the pages of the Quasar history
const historyStore = createTxInMemoryStore<TransactionUnion>({
  localTransactionsPool: pulsarStore.getState().transactionsPool,
  reconcileUnsyncedTransactions: pulsarStore.getState().reconcileUnsyncedTransactions,
  getHistory: async ({ page, walletAddress }) => {
    const history = await getHistory({ walletAddress, page });
    return history && { ...history, docs: history.docs as TransactionUnion[] };
  },
  // Pending transactions sent from another device continue to be tracked here
  onHistoryFetched: (remoteTxs) => pulsarStore.getState().injectExternalPendingTxs(remoteTxs),
});

pulsarStore.subscribe((state) => historyStore.getState().syncWithLocalPool(state.transactionsPool));

export const useHistoryStore = createBoundedUseStore(historyStore);

export function useHistoryPagination(): TxInMemoryPagination {
  const isLoading = useHistoryStore((state) => state.isLoading);
  const isError = useHistoryStore((state) => state.isError);
  const currentPage = useHistoryStore((state) => state.currentPage);
  const hasMore = useHistoryStore((state) => state.hasMore);
  const fetchNextPage = useHistoryStore((state) => state.fetchNextPage);
  return { isLoading, isError, currentPage, hasMore, fetchNextPage };
}
