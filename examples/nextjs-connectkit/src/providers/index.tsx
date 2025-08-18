'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '@/configs/wagmiConfig';

import { TxWidgetProvider } from './TxWidgetProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <TxWidgetProvider />
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
