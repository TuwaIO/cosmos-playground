import { config } from '@/configs/wagmiConfig';

import { increment } from './increment';

export const txActions = {
  increment: () => increment({ wagmiConfig: config }),
};

export type TxActionKey = keyof typeof txActions;

export const TxAction = Object.keys(txActions).reduce(
  (acc, key) => {
    acc[key as TxActionKey] = key as TxActionKey;
    return acc;
  },
  {} as { [K in TxActionKey]: K },
);
