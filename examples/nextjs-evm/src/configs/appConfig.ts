import { createDefaultTransports, safeSdkOptions } from '@tuwaio/evm-sdk/satellite';
import { safe, walletConnect } from '@wagmi/connectors';
import { createConfig, injected } from '@wagmi/core';
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
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || '9077e559e63e099f496b921a027d0f04',
  appLogoUrl: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/preview-logo.png',
  // The origin users open the app at: WalletConnect metadata and the domain the SIWX server accepts
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
};

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

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
    ...(typeof window !== 'undefined'
      ? [
          walletConnect({
            projectId: appConfig.projectId,
            metadata: {
              name: appConfig.appName,
              description: appConfig.appDescription,
              url: appConfig.appUrl,
              icons: [appConfig.appLogoUrl],
            },
          }),
        ]
      : []),
  ],
  transports: createDefaultTransports(appEVMChains),
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
});
