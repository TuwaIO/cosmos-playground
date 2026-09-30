import { createDefaultTransports, impersonated, safeSdkOptions } from '@tuwaio/evm-sdk/satellite';
import { safe, walletConnect } from '@wagmi/connectors';
import { createConfig, hydrate, injected } from '@wagmi/core';
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  Chain,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from 'viem/chains';

export const appConfig = {
  appName: 'Satellite EVM Test App',
  appDescription: 'TUWA Demo App',
  projectId: import.meta.env.VITE_WALLET_PROJECT_ID || '9077e559e63e099f496b921a027d0f04',
  appLogoUrl: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/preview-logo.png',
  // The origin the app runs at, for the WalletConnect metadata
  appUrl: window.location.origin,
};

const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;

export const solanaRPCUrls = {
  mainnet: alchemyKey ? `https://solana-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
};

export const appEVMChains = [
  alchemyKey
    ? {
        ...mainnet,
        rpcUrls: {
          ...mainnet.rpcUrls,
          default: {
            http: [`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`],
          },
        },
      }
    : mainnet,
  alchemyKey
    ? {
        ...sepolia,
        rpcUrls: {
          ...sepolia.rpcUrls,
          default: {
            http: [`https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`],
          },
        },
      }
    : sepolia,
  polygon,
  polygonZkEvm,
  arbitrum,
  arbitrumSepolia,
  optimism,
  avalanche,
  avalancheFuji,
  base,
  bsc,
] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  connectors: [
    injected(),
    safe({
      ...safeSdkOptions,
    }),
    walletConnect({
      projectId: appConfig.projectId,
      metadata: {
        name: appConfig.appName,
        description: appConfig.appDescription,
        url: appConfig.appUrl,
        icons: [appConfig.appLogoUrl],
      },
    }),
    impersonated({}),
  ],
  transports: createDefaultTransports(appEVMChains),
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
});

// There is no `WagmiProvider`, so the app hydrates the wagmi config in the browser itself, as `WagmiProvider` would.
// With `ssr: true`, hydration adds the installed wallets found through EIP-6963 (MetaMask, Rabby, …) to the
// connectors. Satellite Connect reconnects the last wallet, so wagmi does not (`reconnectOnMount: false`).
if (typeof window !== 'undefined') void hydrate(wagmiConfig, { reconnectOnMount: false }).onMount();
