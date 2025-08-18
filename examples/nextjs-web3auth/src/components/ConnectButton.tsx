'use client';

import { ChevronDownIcon, UserCircleIcon, WalletIcon } from '@heroicons/react/24/outline';
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useWeb3AuthUser } from '@web3auth/modal/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export function ConnectButton() {
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading, error: disconnectError } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { address, connector } = useAccount();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  function uiConsole(...args: any[]): void {
    const el = document.querySelector('#console>p');
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
      console.log(...args);
    }
  }

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const ConnectedView = () => (
    <div className="relative">
      <motion.button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="
          cursor-pointer flex items-center gap-3 px-4 py-3 rounded-2xl
          bg-[var(--tuwa-success-bg)] text-[var(--tuwa-success-text)]
          border border-[var(--tuwa-success-icon)]
          hover:shadow-lg transition-all duration-200
          min-w-[200px] relative
        "
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-8 h-8 rounded-full bg-[var(--tuwa-success-icon)] flex items-center justify-center">
          <WalletIcon className="w-4 h-4 text-white" />
        </div>

        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-[var(--tuwa-success-text)]">{connector?.name || 'Wallet'}</span>
          <span className="text-xs font-mono text-[var(--tuwa-text-secondary)]">{formatAddress(address || '')}</span>
        </div>

        <ChevronDownIcon
          className={`w-4 h-4 text-[var(--tuwa-success-icon)] transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`}
        />

        {disconnectLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--tuwa-success-bg)]/80 rounded-2xl">
            <div className="w-5 h-5 border-2 border-[var(--tuwa-success-icon)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.button>

      {isDropdownOpen && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          className="
            absolute top-full mt-2 right-0 w-full min-w-[240px]
            bg-[var(--tuwa-bg-primary)] border border-[var(--tuwa-border-primary)]
            rounded-2xl shadow-lg overflow-hidden z-50
          "
        >
          <button
            onClick={() => {
              uiConsole(userInfo);
              setIsDropdownOpen(false);
            }}
            className="
              w-full px-4 py-3 text-left flex items-center gap-3
              hover:bg-[var(--tuwa-bg-secondary)] transition-colors duration-150
              text-[var(--tuwa-text-primary)]
            "
          >
            <UserCircleIcon className="w-5 h-5 text-[var(--tuwa-text-secondary)]" />
            <span className="font-medium">User Info</span>
          </button>

          <div className="h-px bg-[var(--tuwa-border-secondary)]" />

          <button
            onClick={() => {
              disconnect();
              setIsDropdownOpen(false);
            }}
            disabled={disconnectLoading}
            className="
              w-full px-4 py-3 text-left flex items-center gap-3
              hover:bg-[var(--tuwa-error-bg)] hover:text-[var(--tuwa-error-text)]
              transition-colors duration-150 text-[var(--tuwa-text-primary)]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            <div className="w-5 h-5 rounded border-2 border-[var(--tuwa-error-icon)]" />
            <span className="font-medium">{disconnectLoading ? 'Disconnecting...' : 'Disconnect'}</span>
          </button>
        </motion.div>
      )}

      {disconnectError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            absolute top-full mt-2 left-0 right-0
            p-3 bg-[var(--tuwa-error-bg)] text-[var(--tuwa-error-text)]
            border border-[var(--tuwa-error-icon)] rounded-xl text-sm
          "
        >
          {disconnectError.message}
        </motion.div>
      )}
    </div>
  );

  const DisconnectedView = () => (
    <div className="relative">
      <motion.button
        onClick={connect}
        disabled={connectLoading}
        className="
          relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-white
          bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]
          hover:from-[var(--tuwa-button-gradient-from-hover)] hover:to-[var(--tuwa-button-gradient-to-hover)]
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200 shadow-lg hover:shadow-xl
          min-w-[200px] flex items-center justify-center gap-3
        "
        whileHover={!connectLoading ? { scale: 1.02 } : {}}
        whileTap={!connectLoading ? { scale: 0.98 } : {}}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        <div className="relative flex items-center gap-3">
          {connectLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <WalletIcon className="w-5 h-5" />
              <span>Connect Wallet</span>
            </>
          )}
        </div>
      </motion.button>

      {connectError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            absolute top-full mt-3 left-0 right-0
            p-4 bg-[var(--tuwa-error-bg)] text-[var(--tuwa-error-text)]
            border border-[var(--tuwa-error-icon)] rounded-xl text-sm
            flex items-start gap-3
          "
        >
          <div className="w-5 h-5 rounded-full bg-[var(--tuwa-error-icon)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <div>
            <p className="font-medium">Connection Failed</p>
            <p className="text-xs mt-1 opacity-90">{connectError.message}</p>
          </div>
        </motion.div>
      )}

      {connectLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="
            absolute top-full mt-3 left-0 right-0
            p-3 bg-[var(--tuwa-pending-bg)] text-[var(--tuwa-pending-text)]
            border border-[var(--tuwa-pending-icon)] rounded-xl text-sm
            flex items-center gap-3
          "
        >
          <div className="w-4 h-4 border-2 border-[var(--tuwa-pending-icon)] border-t-transparent rounded-full animate-spin" />
          <span>Please check your wallet for connection request...</span>
        </motion.div>
      )}
    </div>
  );

  return <div className="relative inline-block">{isConnected ? <ConnectedView /> : <DisconnectedView />}</div>;
}
