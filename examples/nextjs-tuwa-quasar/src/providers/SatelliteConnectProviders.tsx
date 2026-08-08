'use client';

import { EVMConnectorsWatcher } from '@tuwaio/evm-sdk/nova-connect';
import { satelliteEVMAdapter } from '@tuwaio/evm-sdk/satellite';
import { NovaConnectProvider, NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { SatelliteConnectProvider } from '@tuwaio/sdk/nova-connect/satellite';
import { useSiwxSessionStore } from '@tuwaio/sdk/siwx';
import { SolanaConnectorsWatcher } from '@tuwaio/solana-sdk/nova-connect';
import { satelliteSolanaAdapter } from '@tuwaio/solana-sdk/satellite';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { usePulsarInMemoryStore, usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const siwxSession = useSiwxSessionStore((s) => s.session);

  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const transactionsPool = usePulsarInMemoryStore((state) => state.transactionsPool);
  const isLoading = usePulsarInMemoryStore((state) => state.isLoading);
  const isError = usePulsarInMemoryStore((state) => state.isError);
  const currentPage = usePulsarInMemoryStore((state) => state.currentPage);
  const hasMore = usePulsarInMemoryStore((state) => state.hasMore);
  const fetchNextPage = usePulsarInMemoryStore((state) => state.fetchNextPage);
  const fetchInitial = usePulsarInMemoryStore((state) => state.fetchInitial);

  const pagination = {
    isLoading,
    isError,
    currentPage,
    hasMore,
    fetchNextPage,
  };

  return (
    <SatelliteConnectProvider
      adapter={[satelliteEVMAdapter(wagmiConfig, appEVMChains), satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]}
      autoConnect={true}
    >
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession ?? undefined} />
      <SolanaConnectorsWatcher siwx={siwxSession ?? undefined} />
      <NovaTransactionsProvider pagination={pagination} />
      <NovaConnectProvider
        appChains={appEVMChains}
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionsPool}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        withImpersonated
        withBalance
        withChain
        pagination={pagination}
        siwx={{
          verifier: async (payload) => {
            const res = await fetch('/api/siwx/verify', {
              method: 'POST',
              body: JSON.stringify(payload),
            });
            return res.ok ? res.json() : null;
          },
          onSuccess: (session) => {
            const address = session.address.includes(':') ? session.address.split(':').pop()! : session.address;
            fetchInitial(address);
          },
          onError: (error) => {
            console.warn('[SIWX Auth Error]', error);
          },
        }}
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
