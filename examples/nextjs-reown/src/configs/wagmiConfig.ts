import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

// Your dApps chains
export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? '',
  networks: appChains,
});

export const config = wagmiAdapter.wagmiConfig;
