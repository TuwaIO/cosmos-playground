// JUST for test

'use client';

import { WalletUiDropdown } from '@wallet-ui/react';

import { TransactionsBlockWrapper } from '@/components/TransactionsBlockWrapper';

export const TransactionsBlock = () => {
  return <TransactionsBlockWrapper connectWidget={<WalletUiDropdown />} />;
};
