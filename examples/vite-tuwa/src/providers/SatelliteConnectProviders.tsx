'use client';

import { NovaConnectProvider, NovaConnectProviderProps } from '@tuwaio/nova-connect';
import { EVMConnectorsWatcher } from '@tuwaio/nova-connect/evm';
import { SatelliteConnectProvider } from '@tuwaio/nova-connect/satellite';
import { SolanaConnectorsWatcher } from '@tuwaio/nova-connect/solana';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '../configs/appConfig';
import { usePulsarStore } from '../hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from './NovaTransactionsProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider
      adapter={[satelliteEVMAdapter(wagmiConfig), satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]}
      autoConnect={true}
    >
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />
      <SolanaConnectorsWatcher />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        appChains={appEVMChains}
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
