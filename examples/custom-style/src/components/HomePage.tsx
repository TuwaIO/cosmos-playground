'use client';

import { WalletIcon } from '@heroicons/react/24/outline';
import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';
import { cn } from '@tuwaio/nova-core';
import { getAdapterFromConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import { motion } from 'framer-motion';

import { TransactionsBlockWrapper } from './evm/TransactionsBlockWrapper';

export default function HomePage() {
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);

  return (
    <div className="w-full flex justify-center items-center bg-[var(--tuwa-bg-primary)] gap-4 flex-wrap relative min-h-[calc(100dvh-65px)]">
      {activeConnection ? (
        <>
          {getAdapterFromConnectorType(activeConnection.connectorType) === OrbitAdapter.EVM && (
            <TransactionsBlockWrapper />
          )}
        </>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.1, 0.1, 0.2, 1] }}
          className={cn(
            'flex flex-col items-center justify-center p-8 m-8 max-w-sm text-center',
            'rounded-[var(--tuwa-rounded-corners)]',
            'bg-[var(--tuwa-bg-secondary)] border border-[var(--tuwa-border-primary)]',
          )}
        >
          <div className="w-12 h-12 p-2 rounded-full mb-4 bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-accent)]">
            <WalletIcon className="w-full h-full" />
          </div>
          <h2 className="text-xl font-medium text-[var(--tuwa-text-primary)] mb-2 font-[DM_Mono]">
            Wallet Required
          </h2>
          <p className="text-[var(--tuwa-text-secondary)] font-[DM_Mono] text-sm">
            Connect your wallet to view and process transactions in the Pulsar module.
          </p>
        </motion.div>
      )}
    </div>
  );
}
