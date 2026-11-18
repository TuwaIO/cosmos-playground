import { createDefaultTransports, safeSdkOptions } from '@tuwaio/satellite-evm';
import { safe } from '@wagmi/connectors';
import { createConfig, createStorage, injected, noopStorage } from '@wagmi/core';
import { baseSepolia, type Chain, sepolia } from 'viem/chains';

export const appConfig = {
  appName: 'Cosmos Store',
  // The origin users open the shop at: the links the checkout returns to
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

// The shop takes test payments only, so it lists test networks only. To sell for real, add the networks of your
// payment methods here (and to `NETWORKS` in `src/lib/methods.ts`); the public RPC of Solana mainnet refuses browsers,
// so give it an RPC URL of your own.
export const solanaRPCUrls = {
  devnet: alchemyKey ? `https://solana-devnet.g.alchemy.com/v2/${alchemyKey}` : 'https://api.devnet.solana.com',
};

// The networks of the payment methods you add in Quasar must be here: the checkout switches the wallet to them and
// reads balances through these RPC URLs
export const appEVMChains = [
  withAlchemy(sepolia, 'eth-sepolia'),
  withAlchemy(baseSepolia, 'base-sepolia'),
] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  connectors: [
    injected(),
    safe({
      ...safeSdkOptions,
    }),
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
