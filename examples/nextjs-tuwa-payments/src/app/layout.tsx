import '@/styles/app.css';

import type { Metadata } from 'next';
import { ReactNode } from 'react';

import { CartDrawer } from '@/components/shell/CartDrawer';
import { Footer } from '@/components/shell/Footer';
import { Header } from '@/components/shell/Header';
import { ShopError } from '@/components/shell/ShopError';
import { ShopProvider } from '@/components/shell/ShopProvider';
import { TestStrip } from '@/components/shell/TestStrip';
import { themeScript } from '@/configs/theme';
import { networkName } from '@/lib/methods';
import { isMerchantMode } from '@/lib/mode';
import { isTestKey } from '@/lib/quasar';
import { readMethods } from '@/lib/shop';
import { Providers } from '@/providers';

export const metadata: Metadata = {
  title: { default: 'Cosmos Store', template: '%s · Cosmos Store' },
  description:
    'A demo shop on Quasar Payments: every order is an invoice issued on the server and paid in test tokens from an EVM or Solana wallet, in the Nova Payments checkout.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Cosmos Store',
  },
  icons: {
    icon: '/icon.svg',
  },
};

// Every page reads the payment methods of the Quasar app and the visitor's cookie: nothing is prerendered at build time
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const methods = await readMethods();
  const networks = methods.ok ? [...new Set(methods.methods.map((method) => networkName(method.chainId)))] : [];

  return (
    // suppressHydrationWarning: themeScript adds the `dark` class before React hydrates
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <Providers>
          <ShopProvider sellable={methods.ok && methods.methods.length > 0}>
            <Header />
            <TestStrip testMode={isTestKey()} networks={networks} merchant={isMerchantMode()} />
            <ShopError />
            <main id="main" className="shop-page">
              <div className="shop-col">{children}</div>
            </main>
            <Footer networks={networks} />
            <CartDrawer />
          </ShopProvider>
        </Providers>
      </body>
    </html>
  );
}
