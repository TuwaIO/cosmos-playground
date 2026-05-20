'use client';

import { createBoundedUseStore, createPulsarStore, createTxInMemoryStore } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';
import { getMiniSessionAuth } from '@tuwaio/quasar-sdk/react';

import { getHistory, syncTransaction } from '@/app/actions';
import { appConfig, appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { TransactionUnion } from '@/transactions';

const storageName = 'transactions-tracking-storage-example';

const initialStore = createPulsarStore<TransactionUnion>({
  name: storageName,
  adapter: [
    pulsarEvmAdapter(wagmiConfig, appEVMChains),
    pulsarSolanaAdapter({
      rpcUrls: solanaRPCUrls,
    }),
  ],
  beforeTxProcess: async () => {
    await getMiniSessionAuth();
  },
  onRemoteCreate: async (tx) => {
    try {
      const auth = await getMiniSessionAuth();
      await syncTransaction(tx, auth);
    } catch (err) {
      console.error('[PulsarHook] Remote sync failed:', err);
    }
  },
  gelatoApiKey: process.env.NEXT_PUBLIC_GELATO_API_KEY,
});

export const usePulsarStore = createBoundedUseStore(initialStore);

const pulsarInMemoryStore = createTxInMemoryStore<TransactionUnion>({
  localTransactionsPool: initialStore.getState().transactionsPool,

  getHistory: async ({ page, walletAddress }) => {
    try {
      const auth = await getMiniSessionAuth();
      const history = await getHistory(
        {
          walletAddress,
          page,
          limit: 10,
          appName: appConfig.appName,
        },
        auth,
      );

      if (!history) {
        return null;
      }

      return {
        ...history,
        docs: history.docs as TransactionUnion[],
      };
    } catch (error) {
      console.error('[PulsarHook] Failed to fetch history:', error);
      throw error;
    }
  },

  onHistoryFetched: async (remoteTxs) => {
    await initialStore.getState().injectExternalPendingTxs(remoteTxs);
  },
});

initialStore.subscribe((state) => pulsarInMemoryStore.getState().syncWithLocalPool(state.transactionsPool));

export const usePulsarInMemoryStore = createBoundedUseStore(pulsarInMemoryStore);
