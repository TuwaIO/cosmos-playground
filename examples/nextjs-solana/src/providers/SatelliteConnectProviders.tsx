'use client';

import { NovaConnectProvider, NovaConnectProviderProps } from '@tuwaio/nova-connect';
import { SatelliteConnectProvider } from '@tuwaio/nova-connect/satellite';
import { SolanaConnectorsWatcher } from '@tuwaio/nova-connect/solana';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { solanaRPCUrls } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider adapter={[satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]} autoConnect={true}>
      <SolanaConnectorsWatcher />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionPool}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        withImpersonated
        withBalance
        withChain
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
