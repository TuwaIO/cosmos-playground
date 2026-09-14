import { createDefaultTransports, impersonated, safeSdkOptions } from '@tuwaio/evm-sdk/satellite';
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
  appName: 'Pulsar & Quasar Cloud Sync Demo',
  appDescription: 'Next.js Demo App with Pulsar and Quasar SDK Integration',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
  appLogoUrl: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/preview-logo.png',
  appUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://demo.tuwa.io/',
};

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

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
    impersonated({}),
  ],
  transports: createDefaultTransports(appEVMChains),
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
});
