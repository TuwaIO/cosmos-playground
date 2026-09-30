'use client';

import { EVMConnectorsWatcher } from '@tuwaio/evm-sdk/nova-connect';
import { satelliteEVMAdapter } from '@tuwaio/evm-sdk/satellite';
import { NovaConnectProvider, type NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { SatelliteConnectProvider, useSatelliteConnectStore } from '@tuwaio/sdk/nova-connect/satellite';
import { isSessionMatchingTarget, useSiwxSessionStore } from '@tuwaio/sdk/siwx';
import { SolanaConnectorsWatcher } from '@tuwaio/solana-sdk/nova-connect';
import { satelliteSolanaAdapter } from '@tuwaio/solana-sdk/satellite';
import { type ReactNode, useEffect } from 'react';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { useHistoryPagination, useHistoryStore, usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

// Created once: a new adapter array on every render would make the provider update its store each time
const satelliteAdapters = [
  satelliteEVMAdapter(wagmiConfig, appEVMChains),
  satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
];

// Sign-in against the routes of src/app/api/siwx/[...siwx]/route.ts
const siwx: NovaConnectProviderProps['siwx'] = {
  expirationSeconds: 1800,
  getNonce: async () => {
    const res = await fetch('/api/siwx/nonce');
    return ((await res.json()) as { nonce: string }).nonce;
  },
  verifier: async (payload) => {
    const res = await fetch('/api/siwx/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok ? res.json() : null;
  },
  destroyer: async () => {
    await fetch('/api/siwx/logout', { method: 'POST' });
  },
  onError: (error) => {
    console.warn('[SIWX Auth Error]', error);
  },
};

// Loads the first page of the Quasar history once the connected wallet is signed in
function HistoryLoader() {
  const address = useSatelliteConnectStore((state) => state.activeConnection?.address);
  const session = useSiwxSessionStore((state) => state.session);
  const fetchInitial = useHistoryStore((state) => state.fetchInitial);
  const isSignedIn = Boolean(session && address && isSessionMatchingTarget(session, address));

  useEffect(() => {
    if (isSignedIn && address) void fetchInitial(address);
  }, [isSignedIn, address, fetchInitial]);

  return null;
}

export function SatelliteConnectProviders({ children }: { children: ReactNode }) {
  const transactionsPool = useHistoryStore((state) => state.transactionsPool);
  const pagination = useHistoryPagination();
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider adapter={satelliteAdapters} autoConnect>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />
      <SolanaConnectorsWatcher />
      <HistoryLoader />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        appChains={appEVMChains}
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionsPool}
        pagination={pagination}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        siwx={siwx}
        withBalance
        withChain
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
