'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '../configs/appConfig';
import { SatelliteConnectProviders } from './SatelliteConnectProviders';
import { StoreProvider } from './StoreProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SatelliteConnectProviders>
          <StoreProvider>{children}</StoreProvider>
        </SatelliteConnectProviders>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
