'use client';

import { createSolanaDevnet, createWalletUiConfig, WalletUi } from '@wallet-ui/react';
import { ReactNode } from 'react';

import { PulsarProvider } from '@/providers/PulsarProvider';

import { NovaProvider } from './NovaProvider';
import { StoreProvider } from './StoreProvider';

const config = createWalletUiConfig({
  clusters: [
    // You can add mainnet when you're ready
    // createSolanaMainnet('https://mainnet.your-rpc.com?api-key=secret'),
    createSolanaDevnet(),
  ],
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletUi config={config}>
      <StoreProvider>
        <PulsarProvider>
          <NovaProvider />
          {children}
        </PulsarProvider>
      </StoreProvider>
    </WalletUi>
  );
}
