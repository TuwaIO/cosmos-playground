import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '9077e559e63e099f496b921a027d0f04', // TODO: need change for personal
  chains: appChains,
});
