import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: appChains,
});
