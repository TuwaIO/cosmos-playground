import '@/styles/app.css';

import { cookieToWeb3AuthState } from '@web3auth/modal';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';
import { headers } from 'next/headers';
import { ReactNode } from 'react';

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
  title: 'Pulsar & Cosmos SDK: Next.js + Web3Auth Example',
  description:
    'An example demonstrating the integration of Pulsar transaction tracking with a Next.js application using Web3Auth.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headersList = await headers();
  const web3authInitialState = cookieToWeb3AuthState(headersList.get('cookie'));

  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="apple-mobile-web-app-title" content="Pulsar & Cosmos SDK: Next.js + Web3Auth Example" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers web3authInitialState={web3authInitialState}>{children}</Providers>
      </body>
    </html>
  );
}
