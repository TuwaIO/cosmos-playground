import { createDefaultTransports, impersonated, safeSdkOptions } from '@tuwaio/evm-sdk/satellite';
import { safe, walletConnect } from '@wagmi/connectors';
import { createConfig, injected } from '@wagmi/core';
import { arbitrum, Chain, mainnet, monad, monadTestnet, sepolia } from 'viem/chains';

export const appConfig = {
  appName: 'Satellite EVM Test App',
  appDescription: 'TUWA Custom Style Demo App',
  projectId: '147ee28e5b18bd6d3302da6dd90a9cf1',
  appLogoUrl: 'https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/preview-logo.png',
  appUrl: 'https://custom-style.tuwa.io/',
};

const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;

export const appEVMChains = [
  monad,
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
  arbitrum,
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
  monadTestnet,
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
