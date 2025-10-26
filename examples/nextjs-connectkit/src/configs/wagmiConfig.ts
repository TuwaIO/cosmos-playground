import { getDefaultConfig } from 'connectkit';
import { Chain, Transport } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { createConfig, CreateConfigParameters, http } from 'wagmi';

// Your dApps chains
export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

/**
 * Creates default HTTP transports for each chain in the configuration
 *
 * @param chains - Array of chain configurations from wagmi
 * @returns Object mapping chain IDs to their corresponding HTTP transport instances
 *
 * @public
 */
export const createDefaultTransports = (chains: CreateConfigParameters['chains']): Record<number, Transport> => {
  return chains.reduce(
    (acc, chain) => {
      const key = chain.id;
      acc[key] = http() as Transport;
      return acc;
    },
    {} as Record<number, Transport>,
  );
};

export const config = createConfig(
  getDefaultConfig({
    chains: appChains,
    transports: createDefaultTransports(appChains),

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',

    // Required App Info
    appName: 'Your App Name',

    // Optional App Info
    appDescription: 'Your App Description',
    appUrl: 'https://family.co', // your app's url
    appIcon: 'https://family.co/logo.png', // your app's icon, no bigger than 1024x1024px (max. 1MB)
    ssr: true,
  }),
);
