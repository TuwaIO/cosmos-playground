// JUST for test

'use client';

import { ConnectButton } from '@/components/ConnectButton';
import { TransactionsBlockWrapper } from '@/components/TransactionsBlockWrapper';

export const TransactionsBlock = () => {
  return <TransactionsBlockWrapper connectWidget={<ConnectButton />} />;
};
