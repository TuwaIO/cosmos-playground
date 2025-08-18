// JUST for test

'use client';

import { DynamicWidget } from '@dynamic-labs/sdk-react-core';

import { TransactionsBlockWrapper } from '@/components/TransactionsBlockWrapper';

export const TransactionsBlock = () => {
  return <TransactionsBlockWrapper connectWidget={<DynamicWidget />} />;
};
