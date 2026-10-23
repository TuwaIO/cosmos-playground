import '@/styles/app.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ReactNode } from 'react';

import { Header } from '@/components/Header';
import { themeScript } from '@/configs/theme';
import { Providers } from '@/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pulsar & Quasar: Next.js',
  description:
    'An example demonstrating the integration of Pulsar transaction tracking and Quasar Cloud Sync with a Next.js application using the Quasar SDK.',
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Pulsar & Quasar: Next.js',
  },
  icons: {
    icon: '/icon.svg',
  },
};

export default async function RootLayout({
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
