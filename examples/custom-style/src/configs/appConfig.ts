import { createDefaultTransports, impersonated, safeSdkOptions } from '@tuwaio/satellite-evm';
import { baseAccount, safe, walletConnect } from '@wagmi/connectors';
import { createConfig, injected } from '@wagmi/core';
import { arbitrum, Chain, mainnet, monad, monadTestnet, sepolia } from 'viem/chains';

export const appConfig = {
  appName: 'Satellite EVM Test App',
  appDescription: 'TUWA Custom Style Demo App',
  projectId: '147ee28e5b18bd6d3302da6dd90a9cf1',
  appLogoUrl: 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/preview-logo.png',
  appUrl: 'https://custom-style.tuwa.io/',
};

export const appEVMChains = [monad, mainnet, arbitrum, sepolia, monadTestnet] as readonly [Chain, ...Chain[]];

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
