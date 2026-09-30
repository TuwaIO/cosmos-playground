import { EVMConnectorsWatcher } from '@tuwaio/evm-sdk/nova-connect';
import { satelliteEVMAdapter } from '@tuwaio/evm-sdk/satellite';
import { NovaConnectProvider, type NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { SatelliteConnectProvider } from '@tuwaio/sdk/nova-connect/satellite';
import { type ReactNode } from 'react';

import { appEVMChains, wagmiConfig } from '../configs/appConfig';
import { usePulsarStore } from '../hooks/pulsarStoreHook';
import { nova_connect_provider_customization } from '../styles/customization/nova_connect_provider';
import { NovaTransactionsProvider } from './NovaTransactionsProvider';

// Created once: a new adapter on every render would make the provider update its store each time
const satelliteAdapter = satelliteEVMAdapter(wagmiConfig, appEVMChains);

export function SatelliteConnectProviders({ children }: { children: ReactNode }) {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider adapter={satelliteAdapter} autoConnect>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        appChains={appEVMChains}
        transactionPool={transactionsPool}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        withImpersonated
        withBalance
        withChain
        customization={nova_connect_provider_customization}
        // Links of the connect modal footer: replace them with the documents of your app
        legal={{ termsUrl: 'https://tuwa.io/terms', privacyUrl: 'https://tuwa.io/privacy' }}
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
