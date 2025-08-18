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
  title: 'TUWA Web3 TXs Tracking Suite Demo',
  description: 'TUWA Web3 Transaction Tracking Suite Demo NextJS + Web3Auth',
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
        <meta name="apple-mobile-web-app-title" content="TUWA Web3 Transaction Tracking Suite Demo NextJS + Web3Auth" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers web3authInitialState={web3authInitialState}>{children}</Providers>
      </body>
    </html>
  );
}
