'use client';

import { NovaConnectProvider, NovaConnectProviderProps } from '@tuwaio/nova-connect';
import { EVMConnectorsWatcher } from '@tuwaio/nova-connect/evm';
import { SatelliteConnectProvider } from '@tuwaio/nova-connect/satellite';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';

import { appEVMChains, wagmiConfig } from '../configs/appConfig';
import { usePulsarStore } from '../hooks/pulsarStoreHook';
import { nova_connect_provider_customization } from '../styles/customization/nova_connect_provider';
import { NovaTransactionsProvider } from './NovaTransactionsProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider adapter={satelliteEVMAdapter(wagmiConfig)} autoConnect={import.meta.env.PROD}>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />

      <NovaTransactionsProvider />
      <NovaConnectProvider
        appChains={appEVMChains}
        transactionPool={transactionPool}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        withImpersonated
        withBalance
        withChain
        customization={nova_connect_provider_customization}
        legal={{
          termsUrl: 'https://yield.accountable.capital/terms-of-service', // TODO: just for test
          privacyUrl: 'https://yield.accountable.capital/privacy-policy', // TODO: just for test
        }}
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
