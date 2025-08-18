import { getDefaultConfig } from 'connectkit';
import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';

// Your dApps chains
export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

export const config = createConfig(
  getDefaultConfig({
    chains: appChains,
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '',

    // Required App Info
    appName: 'Your App Name',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
    ssr: true,
  }),
);
