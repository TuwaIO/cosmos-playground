import '@/styles/app.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { readAcceptedMethods } from '@/app/actions';
import { AppShell } from '@/components/shell/AppShell';
import { ShopProvider } from '@/components/shell/ShopProvider';
import { themeScript } from '@/configs/theme';
import { prepareDemo, shopMode } from '@/lib/mode';
import { getOrderBook } from '@/lib/orders';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Cosmos Store · Quasar Payments',
  description:
    'A Next.js shop that sells with Quasar Payments: invoices and subscriptions issued on the server, the Nova Payments checkout for EVM and Solana wallets, and webhooks that fulfil the orders.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Cosmos Store',
  },
  icons: {
    icon: '/icon.svg',
  },
};

// Every page reads the methods and the in-memory order book of this server: nothing is prerendered at build time
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  prepareDemo();
  const methods = await readAcceptedMethods();
  const chains = methods.ok ? methods.methods.map((method) => method.chainId) : [];

  return (
    // suppressHydrationWarning: themeScript adds the `dark` class before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <Providers>
          <ShopProvider mode={shopMode()} chains={chains} initialBook={getOrderBook()}>
            <AppShell>{children}</AppShell>
          </ShopProvider>
        </Providers>
      </body>
    </html>
  );
}
