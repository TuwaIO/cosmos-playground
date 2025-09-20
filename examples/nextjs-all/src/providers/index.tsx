'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletUi } from '@wallet-ui/react';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { config } from '@/configs/wagmiConfig';
import { configSolana } from '@/configs/walletUiConfig';
import { PulsarProvider } from '@/providers/PulsarProvider';
import { solanaMobileWalletAdapter } from '@/utils/solana-mobile-wallet-adapter';

import { NovaProvider } from './NovaProvider';
import { StoreProvider } from './StoreProvider';

const queryClient = new QueryClient();

solanaMobileWalletAdapter({ clusters: configSolana.clusters });

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
