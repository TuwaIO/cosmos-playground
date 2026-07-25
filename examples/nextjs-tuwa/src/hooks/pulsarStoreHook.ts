'use client';

import { pulsarEvmAdapter } from '@tuwaio/evm-sdk/pulsar';
import { createBoundedUseStore, createPulsarStore } from '@tuwaio/sdk/pulsar';
import { pulsarSolanaAdapter } from '@tuwaio/solana-sdk/pulsar';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { TransactionUnion } from '@/transactions';

const storageName = 'transactions-tracking-storage-new';

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: storageName,
    adapter: [
      pulsarEvmAdapter(wagmiConfig, appEVMChains),
      pulsarSolanaAdapter({
        rpcUrls: solanaRPCUrls,
      }),
    ],
    gelatoApiKey: process.env.NEXT_PUBLIC_GELATO_API_KEY,
  }),
);
