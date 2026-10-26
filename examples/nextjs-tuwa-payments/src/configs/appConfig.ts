import { createDefaultTransports } from '@tuwaio/satellite-evm';
import { walletConnect } from '@wagmi/connectors';
import { createConfig, injected } from '@wagmi/core';
import { base, baseSepolia, Chain, mainnet, sepolia } from 'viem/chains';

export const appConfig = {
  appName: 'Quasar Payments Shop',
  appDescription: 'Next.js shop that sells with Quasar Payments',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID || '9077e559e63e099f496b921a027d0f04',
  appLogoUrl: 'https://tuwa.io/brand/preview-logo.png',
  // The origin users open the shop at: WalletConnect metadata and the links the checkout returns to
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3012',
};

// The Quasar API: a self-hosted node, else Quasar Cloud (the default of the SDK and of the checkout)
export const quasarBaseUrl = process.env.NEXT_PUBLIC_QUASAR_BASE_URL || undefined;

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;

/** The chain with an Alchemy RPC URL when the app has a key. */
function withAlchemy(chain: Chain, network: string): Chain {
  if (!alchemyKey) return chain;
  return {
    ...chain,
    rpcUrls: { ...chain.rpcUrls, default: { http: [`https://${network}.g.alchemy.com/v2/${alchemyKey}`] } },
  };
}

export const solanaRPCUrls = {
  mainnet: alchemyKey ? `https://solana-mainnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.mainnet-beta.solana.com',
  devnet: alchemyKey ? `https://solana-devnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.devnet.solana.com',
};

// The networks of the payment methods you add in Quasar must be here: the checkout switches the wallet to them and
// reads balances through these RPC URLs. Ethereum Mainnet also resolves ENS names.
export const appEVMChains = [
  withAlchemy(mainnet, 'eth-mainnet'),
  withAlchemy(base, 'base-mainnet'),
  withAlchemy(sepolia, 'eth-sepolia'),
  withAlchemy(baseSepolia, 'base-sepolia'),
] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  connectors: [
    injected(),
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
