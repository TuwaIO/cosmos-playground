'use client';

import { NovaConnectProvider, NovaConnectProviderProps } from '@tuwaio/nova-connect';
import { EVMConnectorsWatcher } from '@tuwaio/nova-connect/evm';
import { SatelliteConnectProvider } from '@tuwaio/nova-connect/satellite';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';

import { appEVMChains, wagmiConfig } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const { signInWithSiwe, enabled, isRejected, isSignedIn } = useSiweAuth();
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider
      adapter={[satelliteEVMAdapter(wagmiConfig, enabled ? signInWithSiwe : undefined)]}
      autoConnect={true}
    >
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled }} />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        appChains={appEVMChains}
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
