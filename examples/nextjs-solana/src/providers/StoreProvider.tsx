'use client';

import { produce } from 'immer';
import { PropsWithChildren, useMemo } from 'react';
import { createStore } from 'zustand/vanilla';

import { PROGRAM_ID } from '@/constants';
import { Store, StoreContext } from '@/hooks/storeHook';
import { getSolanatestProgramAccounts } from '@/programs';

export function StoreProvider({ children }: PropsWithChildren) {
  const store = useMemo(() => {
    return createStore<Store>()((set) => ({
      accounts: {},
      getAccounts: async (walletUi) => {
        const accountsInfo = (await getSolanatestProgramAccounts(walletUi.client.rpc, PROGRAM_ID)) as never as {
          address: string;
          data: { count: number };
          executable: boolean;
          exists: boolean;
          lamports: bigint;
          programAddress: string;
          space: bigint;
        }[];
        console.log('accountsInfo', accountsInfo);
        set((state) =>
          produce(state, (draft) => {
            accountsInfo.forEach((account) => {
              draft.accounts[account.address] = account.data.count;
            });
          }),
        );
      },
    }));
  }, []);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
