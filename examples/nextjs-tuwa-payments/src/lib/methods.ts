import type { PaymentMethod } from '@tuwaio/quasar-sdk';

/** A payment method as the shop page shows it: what the buyer pays with, without the wallet that receives it. */
export type ShopMethod = Pick<PaymentMethod, 'id' | 'name' | 'symbol' | 'chainId' | 'assetId'>;

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
