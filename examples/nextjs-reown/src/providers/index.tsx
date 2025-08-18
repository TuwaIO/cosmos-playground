'use client';

import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Config, cookieToInitialState, WagmiProvider } from 'wagmi';

import { appChains, wagmiAdapter } from '@/configs/wagmiConfig';

import { TxWidgetProvider } from './TxWidgetProvider';

const queryClient = new QueryClient();

const metadata = {
  name: 'next-reown-appkit',
  description: 'next-reown-appkit',
  url: 'https://github.com/0xonerb/next-reown-appkit-ssr', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932'],
};

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? '',
  networks: appChains,
  metadata,
  themeMode: 'light',
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
  themeVariables: {
    '--w3m-accent': '#000000',
  },
});

export function Providers({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <TxWidgetProvider />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
