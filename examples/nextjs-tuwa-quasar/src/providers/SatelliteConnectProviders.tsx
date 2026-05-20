'use client';

import { NovaConnectProvider, NovaConnectProviderProps } from '@tuwaio/nova-connect';
import { EVMConnectorsWatcher } from '@tuwaio/nova-connect/evm';
import { SatelliteConnectProvider } from '@tuwaio/nova-connect/satellite';
import { SolanaConnectorsWatcher } from '@tuwaio/nova-connect/solana';
import { getMiniSessionAuth } from '@tuwaio/quasar-sdk/react';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { usePulsarInMemoryStore, usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';
import { QuasarAuthBridge } from '@/providers/QuasarSDKAuthProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const { signInWithSiwe, enabled, isRejected, isSignedIn } = useSiweAuth();
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
      adapter={[
        satelliteEVMAdapter(wagmiConfig, appEVMChains, enabled ? signInWithSiwe : undefined),
        satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
      ]}
      autoConnect={true}
      callbackAfterConnected={async (connection) => {
        try {
          await getMiniSessionAuth();
          setTimeout(() => fetchInitial(connection.address), 2000);
        } catch (err) {
          console.error('[QuasarAuth] Auto-authentication failed (no SIWE):', err);
          setTimeout(() => fetchInitial(connection.address), 2000);
        }
      }}
    >
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled }} />
      <SolanaConnectorsWatcher />
      <QuasarAuthBridge />
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
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
