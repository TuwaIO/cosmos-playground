'use client';

import { NovaConnectProvider, type NovaConnectProviderProps } from '@tuwaio/nova-connect';
import { EVMConnectorsWatcher } from '@tuwaio/nova-connect/evm';
import { SatelliteConnectProvider } from '@tuwaio/nova-connect/satellite';
import { SolanaConnectorsWatcher } from '@tuwaio/nova-connect/solana';
import { NovaPaymentsProvider, type PaymentsPulsar } from '@tuwaio/nova-payments';
import { paymentsEVMAdapter } from '@tuwaio/nova-payments/evm';
import { paymentsSolanaAdapter } from '@tuwaio/nova-payments/solana';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { type ReactNode } from 'react';

import { appEVMChains, quasarBaseUrl, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { pulsarStore, usePulsarStore } from '@/hooks/pulsarStoreHook';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

// Created once: new adapter arrays on every render would make the providers update their stores each time
const satelliteAdapters = [
  satelliteEVMAdapter(wagmiConfig, appEVMChains),
  satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
];

// How the checkout pays from the connected wallet: EVM through the wagmi config, Solana through Wallet Standard
const paymentsAdapters = [paymentsEVMAdapter(wagmiConfig), paymentsSolanaAdapter({ rpcUrls: solanaRPCUrls })];

// A payment the wallet sends after the buyer closed the checkout goes to the Pulsar store
const paymentsPulsar: PaymentsPulsar = {
  injectExternalPendingTxs: (transactions) => pulsarStore.getState().injectExternalPendingTxs(transactions),
};

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
        withBalance
        withChain
        legal={{ termsUrl: 'https://tuwa.io/terms', privacyUrl: 'https://tuwa.io/privacy' }}
      >
        {/* Inside NovaConnectProvider: "Connect wallet" in the checkout opens the Nova Connect modal */}
        <NovaPaymentsProvider baseUrl={quasarBaseUrl} adapters={paymentsAdapters} pulsar={paymentsPulsar}>
          {children}
        </NovaPaymentsProvider>
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
