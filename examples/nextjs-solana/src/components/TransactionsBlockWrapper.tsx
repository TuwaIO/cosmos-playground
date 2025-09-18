'use client';

import { useWalletUi } from '@wallet-ui/react';
import { address } from 'gill';
import { ReactNode, useEffect } from 'react';

import { TxActionButtonIncrement } from '@/components/TxActionButton';
import { TxActionButtonInitialize } from '@/components/TxActionButtonInitialize';
import { PROGRAM_ID } from '@/constants';
import { useStore } from '@/hooks/storeHook';

export const TransactionsBlockWrapper = ({ connectWidget }: { connectWidget: ReactNode }) => {
  const walletUi = useWalletUi();
  const accounts = useStore((state) => state.accounts);
  const getAccounts = useStore((state) => state.getAccounts);

  useEffect(() => {
    getAccounts(walletUi);
  }, [walletUi.client]);

  const openSolscan = () => {
    window.open(`https://solscan.io/account/${PROGRAM_ID}?cluster=devnet`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full bg-gradient-to-br from-[var(--tuwa-bg-secondary)] to-[var(--tuwa-bg-muted)] p-4 h-[100dvh] flex overflow-y-auto">
      <div className="m-auto w-full max-w-md h-auto min-h-[680px] bg-[var(--tuwa-bg-primary)] rounded-2xl shadow-2xl border border-[var(--tuwa-border-primary)] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] p-6 flex-shrink-0">
          <div className="flex-1 pr-4">
            <h1 className="text-2xl font-bold text-[var(--tuwa-text-on-accent)] mb-1 leading-tight">
              Pulsar Solana Demo
            </h1>
            <p className="text-blue-100 text-sm leading-tight">Transaction Tracking Example</p>
          </div>
          <div className="flex items-center justify-end min-w-[180px] mt-2.5">
            <div className="transform transition-all duration-200 ease-in-out">{connectWidget}</div>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8">
          <div className="text-center h-16 flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-[var(--tuwa-text-primary)] mb-2 leading-tight">
              Solana Program Interaction
            </h2>
            <p className="text-[var(--tuwa-text-secondary)] text-sm leading-tight">
              Test transaction tracking with a simple counter program
            </p>
          </div>

          <div className="border-t border-[var(--tuwa-border-primary)]"></div>

          <div className="space-y-6 flex-1">
            <div className="bg-[var(--tuwa-bg-secondary)] rounded-xl p-4 border border-[var(--tuwa-border-secondary)] min-h-[100px] flex flex-col justify-center">
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--tuwa-info-bg)] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[var(--tuwa-text-accent)] font-bold text-lg">#</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-[var(--tuwa-text-primary)] leading-tight">Counter Program</h3>
                    <p className="text-xs text-[var(--tuwa-text-tertiary)] leading-tight">Solana Devnet</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm text-[var(--tuwa-text-secondary)] leading-tight">Account</div>
                  <button
                    onClick={openSolscan}
                    className="text-xs font-mono text-[var(--tuwa-text-accent)] hover:text-[var(--tuwa-button-gradient-from-hover)] leading-tight cursor-pointer transition-colors duration-200 underline hover:no-underline"
                  >
                    {PROGRAM_ID.slice(0, 6)}...
                    {PROGRAM_ID.slice(-4)}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-14">{walletUi.connected && <TxActionButtonInitialize walletUi={walletUi} />}</div>
            </div>

            <div className="space-y-4">
              {Object.entries(accounts).map(([key, value]) => {
                return (
                  <div key={key}>
                    <p>{key}</p>
                    <p>Current count: {value}</p>
                    {walletUi.connected && (
                      <TxActionButtonIncrement walletUi={walletUi} currentCount={value} solanatest={address(key)} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-[var(--tuwa-bg-secondary)] px-8 py-4 border-t border-[var(--tuwa-border-primary)] flex-shrink-0 h-16 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-xs text-[var(--tuwa-text-tertiary)]">
            <span className="leading-none">Powered by</span>
            <span className="font-semibold text-[var(--tuwa-text-accent)] leading-none">Pulsar</span>
            <span className="leading-none">•</span>
            <span className="leading-none">Web3 Transaction Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};
