import type { PaymentMethod } from '@tuwaio/quasar-sdk';

/**
 * A payment method as the shop page shows it: what the buyer pays with, without the wallet that receives it.
 * `featured` is the "Popular" mark of the method in the Quasar dashboard.
 */
export type ShopMethod = Pick<
  PaymentMethod,
  'id' | 'name' | 'symbol' | 'chainId' | 'assetId' | 'decimals' | 'featured'
>;

/** The payment methods of your Quasar app, or why Quasar did not list them. */
export type AcceptedMethods = { ok: true; methods: ShopMethod[] } | { ok: false; error: string };

/** What the shop says while the app has no payment methods. */
export const NO_METHODS =
  'The Quasar app of the shop has no payment methods yet. Add them under Payments, Payment methods, then reload this page.';

/** The networks the shop knows, by CAIP-2 chain: the name, whether it is a test network, and its block explorer. */
const NETWORKS: Record<string, { name: string; test: boolean; tx: (hash: string) => string }> = {
  'eip155:11155111': { name: 'Sepolia', test: true, tx: (hash) => `https://sepolia.etherscan.io/tx/${hash}` },
  'eip155:84532': { name: 'Base Sepolia', test: true, tx: (hash) => `https://sepolia.basescan.org/tx/${hash}` },
  'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': {
    name: 'Solana Devnet',
    test: true,
    tx: (hash) => `https://explorer.solana.com/tx/${hash}?cluster=devnet`,
  },
};

/** The name of a network (`Base Sepolia`), or its CAIP-2 chain for one the shop does not know. */
export function networkName(chainId: string): string {
  return NETWORKS[chainId]?.name ?? chainId;
}

/** Whether a CAIP-2 chain is a test network. */
export function isTestChain(chainId: string): boolean {
  return NETWORKS[chainId]?.test === true;
}

/** The explorer page of a transaction, or `null` for a network the shop does not know. */
export function explorerTxUrl(chainId: string | null, hash: string): string | null {
  return chainId && NETWORKS[chainId] ? NETWORKS[chainId].tx(hash) : null;
}

/** The methods in the order the shop shows them: the popular ones first, each group in the order of the Quasar app. */
export function popularFirst(methods: readonly ShopMethod[]): ShopMethod[] {
  return [...methods.filter((method) => method.featured), ...methods.filter((method) => !method.featured)];
}
