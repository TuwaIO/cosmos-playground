'use client';

import { ConnectButton } from '@tuwaio/sdk/nova-connect/components';

import { usePulsarStore } from '../hooks/pulsarStoreHook';
import { connect_button_customization } from '../styles/customization/connect_button';

export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);

  return (
    <header className="px-4 py-3 flex items-center justify-between gap-4 bg-[var(--tuwa-bg-primary)] border-b border-[var(--tuwa-border-primary)]">
      <a href="https://www.tuwa.io/" target="_blank" rel="noreferrer">
        <img
          width={126}
          height={40}
          className="w-[126px] h-[40px] brightness-0 invert"
          src="https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/logo_v2.svg"
          alt="TUWA Logo"
        />
      </a>

      <ConnectButton transactionPool={transactionPool} customization={connect_button_customization} />
    </header>
  );
}
