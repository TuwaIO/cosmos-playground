'use client';

import { createBoundedUseStore, createPulsarStore } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '../configs/appConfig';
import { TransactionUnion } from '../transactions';

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
    gelatoApiKey:
      typeof process !== 'undefined'
        ? process.env.VITE_GELATO_API_KEY
        : 'test__YdhbAtrsdIe0InknnlnLNN9OVEGOYjz5_TIEGxCncI_',
  }),
);
