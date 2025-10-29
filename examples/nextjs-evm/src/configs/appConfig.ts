import { createDefaultTransports, initAllConnectors } from '@tuwaio/satellite-evm';
import { createConfig } from '@wagmi/core';
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
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
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
  connectors: initAllConnectors({
    initialParameters: {
      ...appConfig,
    },
    geminiParameters: {
      appMetadata: {
        name: appConfig.appName,
        description: 'TUWA Demo App',
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://demo.tuwa.io/',
      },
    },
  }),
  transports: createDefaultTransports(appEVMChains),
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
});
