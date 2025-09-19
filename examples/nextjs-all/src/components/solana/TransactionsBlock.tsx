// JUST for test

'use client';

import { WalletUiDropdown } from '@wallet-ui/react';
import { ReactNode } from 'react';

import { TransactionsBlockWrapper } from '@/components/solana/TransactionsBlockWrapper';

export const TransactionsBlockSolana = ({ toggleButton }: { toggleButton: ReactNode }) => {
  return <TransactionsBlockWrapper connectWidget={<WalletUiDropdown />} toggleButton={toggleButton} />;
};
