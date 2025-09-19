'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createSolanaDevnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '@/configs/wagmiConfig';
import { PulsarProvider } from '@/providers/PulsarProvider';

import { NovaProvider } from './NovaProvider';
import { StoreProvider } from './StoreProvider';

const configSolana = createWalletUiConfig({
  clusters: [
    // You can add mainnet when you're ready
    // createSolanaMainnet('https://mainnet.your-rpc.com?api-key=secret'),
    createSolanaDevnet(),
  ],
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletUi config={configSolana}>
            <StoreProvider>
              <PulsarProvider>
                <NovaProvider />
                {children}
              </PulsarProvider>
            </StoreProvider>
          </WalletUi>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
