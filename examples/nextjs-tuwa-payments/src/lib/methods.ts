import type { PaymentMethod } from '@tuwaio/quasar-sdk';

/** A payment method as the shop page shows it: what the buyer pays with, without the wallet that receives it. */
export type ShopMethod = Pick<PaymentMethod, 'id' | 'name' | 'symbol' | 'chainId' | 'assetId' | 'decimals'>;

/** The payment methods of your Quasar app, or why Quasar did not list them. */
export type AcceptedMethods = { ok: true; methods: ShopMethod[] } | { ok: false; error: string };

/** What the shop says while the app has no payment methods. */
export const NO_METHODS =
  'Your Quasar app has no payment methods yet: add them under Payments → Payment methods, then reload this page.';

/** What the shop says when automatic payments have no method to charge. */
export const NO_AUTO_CHARGE_METHOD =
  'Automatic payments charge a token on an EVM network, for example USDC on Base Sepolia: add one to your Quasar app.';

/** Whether automatic payments can charge this method: a token on an EVM network (Quasar checks it is a stablecoin). */
export function canChargeAutomatically(method: ShopMethod): boolean {
  return method.chainId.startsWith('eip155:') && Boolean(method.assetId?.includes('/erc20:'));
}

/** CAIP-2 chains of the test networks: Sepolia, Base Sepolia, Solana devnet and testnet. */
const TEST_CHAINS = new Set([
  'eip155:11155111',
  'eip155:84532',
  'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1',
  'solana:4uhcVJyU9pJkvQyS88uRDiswHXSRkk',
]);

/** Whether a CAIP-2 chain is a test network: the shop then says it takes test payments. */
export function isTestChain(chainId: string): boolean {
  return TEST_CHAINS.has(chainId);
}

/** Block explorers of the networks the shop takes: the link of a payment's transaction. */
const EXPLORERS: Record<string, (hash: string) => string> = {
  'eip155:1': (hash) => `https://etherscan.io/tx/${hash}`,
  'eip155:8453': (hash) => `https://basescan.org/tx/${hash}`,
  'eip155:11155111': (hash) => `https://sepolia.etherscan.io/tx/${hash}`,
  'eip155:84532': (hash) => `https://sepolia.basescan.org/tx/${hash}`,
  'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': (hash) => `https://explorer.solana.com/tx/${hash}`,
  'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1': (hash) => `https://explorer.solana.com/tx/${hash}?cluster=devnet`,
};

/** The explorer page of a transaction, or `null` for a network the shop does not know. */
export function explorerTxUrl(chainId: string | null, hash: string): string | null {
  return chainId && EXPLORERS[chainId] ? EXPLORERS[chainId](hash) : null;
}
