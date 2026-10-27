import '@/styles/app.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { Header } from '@/components/Header';
import { themeScript } from '@/configs/theme';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: 'Quasar Payments: Next.js Shop',
  description:
    'A Next.js shop that sells with Quasar Payments: invoices and subscriptions issued on the server, the Nova Payments checkout for EVM and Solana wallets, and webhooks that fulfil the orders.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Quasar Payments Shop',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    // suppressHydrationWarning: themeScript adds the `dark` class before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
