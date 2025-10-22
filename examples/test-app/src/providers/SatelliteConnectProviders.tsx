'use client';

import { NovaConnectProvider, SatelliteConnectProvider } from '@tuwaio/nova-connect';
import { EVMWalletsWatcher } from '@tuwaio/nova-connect/evm';
import { SolanaWalletsWatcher } from '@tuwaio/nova-connect/solana';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { NovaTransactionsProvider } from '@/providers/NovaTransactionsProvider';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const { signInWithSiwe, enabled, isRejected, isSignedIn } = useSiweAuth();

  return (
    <SatelliteConnectProvider
      adapter={[
        satelliteEVMAdapter(wagmiConfig, enabled ? signInWithSiwe : undefined),
        satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
      ]}
      autoConnect={true}
    >
      <EVMWalletsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled }} />
      <SolanaWalletsWatcher />
      <NovaTransactionsProvider />
      <NovaConnectProvider>{children}</NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
