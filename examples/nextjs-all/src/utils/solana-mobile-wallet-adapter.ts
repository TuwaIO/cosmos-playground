'use client';

import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from '@solana-mobile/wallet-standard-mobile';
import { SolanaCluster } from '@wallet-ui/react';

interface SolanaWalletAdapterProps {
  appIdentity?: { uri?: string; icon?: string; name?: string };
  clusters: SolanaCluster[];
}

export function solanaMobileWalletAdapter({
  appIdentity = { name: 'Wallet UI' },
  clusters,
}: SolanaWalletAdapterProps): void {
  if (typeof window !== 'undefined') {
    if (!window.isSecureContext) {
      console.warn(`Solana Mobile Wallet Adapter not loaded: https connection required`);
      return;
    }

    const chains = clusters.map((c) => c.id);
    if (chains.length === 0) {
      console.warn(`Solana Mobile Wallet Adapter not loaded: no clusters provided`);
      return;
    }

    registerMwa({
      appIdentity,
      authorizationCache: createDefaultAuthorizationCache(),
      chains,
      chainSelector: createDefaultChainSelector(),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
    console.log(`Loaded Solana Mobile Wallet Adapter`);
  }
}
