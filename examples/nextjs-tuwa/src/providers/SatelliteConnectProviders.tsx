'use client';

import { EVMConnectorsWatcher } from '@tuwaio/evm-sdk/nova-connect';
import { satelliteEVMAdapter } from '@tuwaio/evm-sdk/satellite';
import { NovaConnectProvider, type NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { SatelliteConnectProvider } from '@tuwaio/sdk/nova-connect/satellite';
import { SolanaConnectorsWatcher } from '@tuwaio/solana-sdk/nova-connect';
import { satelliteSolanaAdapter } from '@tuwaio/solana-sdk/satellite';
import { type ReactNode } from 'react';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

// Created once: a new adapter array on every render would make the provider update its store each time
const satelliteAdapters = [
  satelliteEVMAdapter(wagmiConfig, appEVMChains),
  satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
];

export function SatelliteConnectProviders({ children }: { children: ReactNode }) {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    // rememberWallet={false}: the wallet is reconnected only until the tab closes, unless the user ticks
    // "Remember this wallet" in the connect modal
    <SatelliteConnectProvider adapter={satelliteAdapters} autoConnect rememberWallet={false}>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />
      <SolanaConnectorsWatcher />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        appChains={appEVMChains}
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionsPool}
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
