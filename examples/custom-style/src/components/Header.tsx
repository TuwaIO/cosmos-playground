'use client';

import { ConnectButton } from '@tuwaio/nova-connect/components';

import { usePulsarStore } from '../hooks/pulsarStoreHook';
import { connect_button_customization } from '../styles/customization/connect_button';

export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);

  return (
    <header className="px-4 py-3 flex items-center justify-between gap-4 bg-[var(--tuwa-bg-primary)] border-b border-[var(--tuwa-border-primary)]">
      <a href="https://www.tuwa.io/" target="_blank">
        <img
          width={90}
          height={35}
          className="w-[90px] h-[35px]"
          src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwa_logo.svg"
          alt="TUWA Logo"
        />
      </a>

      <ConnectButton transactionPool={transactionPool} customization={connect_button_customization} />
    </header>
  );
}
