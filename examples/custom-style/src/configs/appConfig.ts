import { createDefaultTransports, impersonated, safeSdkOptions } from '@tuwaio/evm-sdk/satellite';
import { safe } from '@wagmi/connectors';
import { createConfig, createStorage, injected, noopStorage } from '@wagmi/core';
import { arbitrum, Chain, mainnet, monad, monadTestnet, sepolia } from 'viem/chains';

export const appConfig = {
  appName: 'Satellite EVM Test App',
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
    impersonated({}),
  ],
  transports: createDefaultTransports(appEVMChains),
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
  // Satellite Connect remembers the last wallet; wagmi keeps nothing in the browser. A storage that saves
  // nothing, not `null`: without a storage wagmi cannot hydrate a config with `ssr: true` and never lists the
  // installed wallets (EIP-6963)
  storage: createStorage({ storage: noopStorage }),
});
