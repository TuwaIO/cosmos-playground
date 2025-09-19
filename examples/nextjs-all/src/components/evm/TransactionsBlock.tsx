// JUST for test

'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ReactNode } from 'react';

import { TransactionsBlockWrapper } from '@/components/evm/TransactionsBlockWrapper';

export const TransactionsBlockRainbowKit = ({ toggleButton }: { toggleButton: ReactNode }) => {
  return <TransactionsBlockWrapper connectWidget={<ConnectButton />} toggleButton={toggleButton} />;
};
