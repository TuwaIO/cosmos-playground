// JUST for test

'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

import { TransactionsBlockWrapper } from '@/components/TransactionsBlockWrapper';

export const TransactionsBlock = () => {
  return <TransactionsBlockWrapper connectWidget={<ConnectButton />} />;
};
