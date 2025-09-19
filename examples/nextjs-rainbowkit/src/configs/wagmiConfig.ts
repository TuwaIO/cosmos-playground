import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
  chains: appChains,
  ssr: true,
});
