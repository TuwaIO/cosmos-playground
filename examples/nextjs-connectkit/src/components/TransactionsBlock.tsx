// JUST for test

'use client';

import { ConnectKitButton } from 'connectkit';

import { TransactionsBlockWrapper } from '@/components/TransactionsBlockWrapper';

export const TransactionsBlock = () => {
  return <TransactionsBlockWrapper connectWidget={<ConnectKitButton />} />;
};
