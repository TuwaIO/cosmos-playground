'use client';

import { WalletUiContextValue } from '@wallet-ui/react';
import { createContext, useContext } from 'react';
import { StoreApi, useStore as uS } from 'zustand';

export type Store = {
  accounts: Record<string, number>;
  getAccounts: (walletUi: WalletUiContextValue) => Promise<void>;
};

export const StoreContext = createContext<StoreApi<Store> | null>(null);

export const useStore = <T>(selector: (state: Store) => T): T => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('usePulsarStore must be used within a PulsarProvider');
  }
  return uS(store, selector);
};
