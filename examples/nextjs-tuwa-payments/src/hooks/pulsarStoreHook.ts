'use client';

import { createBoundedUseStore, createPulsarStore, type Transaction } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';

// The Pulsar store tracks the payments the checkout hands over: a payment the wallet sends after the buyer closed the
// checkout gets a Nova Transactions toast and stays in the wallet's history
export const pulsarStore = createPulsarStore<Transaction>({
  name: 'payments-shop-transactions',
  adapter: [pulsarEvmAdapter(wagmiConfig, appEVMChains), pulsarSolanaAdapter({ rpcUrls: solanaRPCUrls })],
});

export const usePulsarStore = createBoundedUseStore(pulsarStore);
