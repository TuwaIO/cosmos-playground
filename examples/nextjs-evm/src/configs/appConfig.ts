import { createDefaultTransports, impersonated, safeSdkOptions } from '@tuwaio/satellite-evm';
import { baseAccount, safe, walletConnect } from '@wagmi/connectors';
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
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
  appLogoUrl: 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/preview-logo.png',
  appUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://demo.tuwa.io/',
};

export const appEVMChains = [
  mainnet,
  sepolia,
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
    baseAccount({
      appName: appConfig.appName,
      appLogoUrl: appConfig.appLogoUrl,
    }),
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
