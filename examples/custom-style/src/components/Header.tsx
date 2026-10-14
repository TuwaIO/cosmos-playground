import { ConnectButton } from '@tuwaio/sdk/nova-connect/components';

import { appConfig } from '../configs/appConfig';
import { usePulsarStore } from '../hooks/pulsarStoreHook';
import { connect_button_customization } from '../styles/customization/connect_button';

export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);

  return (
    <header className="px-4 py-3 flex items-center justify-between gap-4 bg-[var(--tuwa-bg-primary)] border-b border-[var(--tuwa-border-primary)]">
      <a href="/" className="text-sm font-semibold text-[var(--tuwa-text-primary)]">
        {appConfig.appName}
      </a>

      <ConnectButton transactionPool={transactionPool} customization={connect_button_customization} />
    </header>
  );
}
