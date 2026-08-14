'use client';

import { EVMConnectorsWatcher } from '@tuwaio/evm-sdk/nova-connect';
import { satelliteEVMAdapter } from '@tuwaio/evm-sdk/satellite';
import { NovaConnectProvider, NovaConnectProviderProps } from '@tuwaio/sdk/nova-connect';
import { SatelliteConnectProvider } from '@tuwaio/sdk/nova-connect/satellite';
import { useSiwxSessionStore } from '@tuwaio/sdk/siwx';

import { appEVMChains, wagmiConfig } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const siwxSession = useSiwxSessionStore((s) => s.session);
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <SatelliteConnectProvider adapter={[satelliteEVMAdapter(wagmiConfig, appEVMChains)]} autoConnect={true}>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession ?? undefined} />
      <NovaTransactionsProvider />
      <NovaConnectProvider
        appChains={appEVMChains}
        transactionPool={transactionPool}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        withImpersonated
        withBalance
        withChain
        siwx={{
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
        }}
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
