'use client';

import { createPulsarStore } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useWalletUi } from '@wallet-ui/react';
import { PropsWithChildren, useMemo } from 'react';

import { appChains, config } from '@/configs/wagmiConfig';
import { PulsarStoreContext } from '@/hooks/txTrackingHooks';
import { TransactionUnion } from '@/transactions';

const storageName = 'transactions-tracking-storage';

export function PulsarProvider({ children }: PropsWithChildren) {
  const wallet = useWalletUi();

  const store = useMemo(() => {
    return createPulsarStore<TransactionUnion>({
      name: storageName,
      adapter: [
        evmAdapter(config, appChains),
        solanaAdapter({
          wallet: {
            walletAddress: wallet?.account?.address.toString() ?? '',
            walletType: wallet?.account?.label ?? 'solana',
            walletActiveChain: wallet?.cluster.cluster ?? 'mainnet',
          },
          rpcUrls: {
            devnet: 'https://api.devnet.solana.com',
          },
        }),
      ],
    });
  }, [wallet]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}
