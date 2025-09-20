'use client';

import { WalletUi } from '@wallet-ui/react';
import { ReactNode } from 'react';

import { configSolana } from '@/configs/walletUiConfig';
import { PulsarProvider } from '@/providers/PulsarProvider';
import { solanaMobileWalletAdapter } from '@/utils/solana-mobile-wallet-adapter';

import { NovaProvider } from './NovaProvider';
import { StoreProvider } from './StoreProvider';

solanaMobileWalletAdapter({ clusters: configSolana.clusters });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletUi config={configSolana}>
      <StoreProvider>
        <PulsarProvider>
          <NovaProvider />
          {children}
        </PulsarProvider>
      </StoreProvider>
    </WalletUi>
  );
}
