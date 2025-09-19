'use client';

import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { disconnect } from '@wagmi/core';
import { useWalletUi } from '@wallet-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { TransactionsBlockRainbowKit } from '@/components/evm/TransactionsBlock';
import { TransactionsBlockSolana } from '@/components/solana/TransactionsBlock';
import { config } from '@/configs/wagmiConfig';

export default function HomePage() {
  const walletUi = useWalletUi();

  const [activeAdapter, setActiveAdapter] = useState<TransactionAdapter>(TransactionAdapter.SOLANA);
  const [direction, setDirection] = useState(1);

  const toggleAdapter = () => {
    if (activeAdapter === TransactionAdapter.EVM) {
      setDirection(1);
      disconnect(config);
      localStorage.removeItem('wagmi.store');
      localStorage.removeItem('wagmi.recentConnectorId');
      setActiveAdapter(TransactionAdapter.SOLANA);
    } else {
      setDirection(1);
      walletUi.disconnect();
      localStorage.removeItem('wallet-ui:cluster');
      setActiveAdapter(TransactionAdapter.EVM);
    }
  };

  const ToggleButton = () => {
    return (
      <button
        className="absolute top-1 right-1 bg-white cursor-pointer p-2.5 rounded-full border border-transparent font-semibold shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 z-10"
        onClick={toggleAdapter}
      >
        <ArrowsRightLeftIcon className="w-6 h-6" aria-hidden="true" />
      </button>
    );
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
      <div className="w-full flex justify-center items-center bg-gradient-to-br from-[var(--tuwa-bg-secondary)] to-[var(--tuwa-bg-muted)] gap-4 relative">
        <AnimatePresence mode="wait" custom={direction}>
          {activeAdapter === TransactionAdapter.SOLANA ? (
            <motion.div
              key="solana-block"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              custom={direction}
              className="w-full h-full absolute left-0 top-0 flex justify-center items-center"
            >
              <TransactionsBlockSolana toggleButton={<ToggleButton />} />
            </motion.div>
          ) : (
            <motion.div
              key="evm-block"
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              custom={direction}
              className="w-full h-full absolute left-0 top-0 flex justify-center items-center"
            >
              <TransactionsBlockRainbowKit toggleButton={<ToggleButton />} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
