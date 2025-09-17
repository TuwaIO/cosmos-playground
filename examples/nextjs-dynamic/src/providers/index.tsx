'use client';

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { SolanaWalletConnectors } from '@dynamic-labs/solana';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '@/configs/wagmiConfig';

import { NovaProvider } from './NovaProvider';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <DynamicContextProvider
          settings={{
            environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENV_ID ?? '',
            walletConnectors: [EthereumWalletConnectors, SolanaWalletConnectors],
          }}
        >
          <DynamicWagmiConnector>
            <NovaProvider />
            {children}
          </DynamicWagmiConnector>
        </DynamicContextProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
