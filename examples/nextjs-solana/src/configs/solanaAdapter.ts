import { WalletUiContextValue } from '@wallet-ui/react';

export function createSolanaAdapterParams({ wallet }: { wallet: WalletUiContextValue }) {
  return {
    wallet: {
      walletAddress: wallet?.account?.address.toString() ?? '',
      walletType: wallet?.account?.label ?? 'solana',
      walletActiveChain: wallet?.cluster.cluster ?? 'mainnet',
    },
    rpcUrls: {
      devnet: 'https://api.devnet.solana.com',
    },
  };
}
