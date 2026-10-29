import { ensureDemo } from '@/lib/demo/engine';

// The two switches of the shop, read on the server only.

/**
 * Demo mode (`SHOP_DEMO_MODE=true`): the shop runs without Quasar and without keys, on a simulation of the Payments
 * API with sample orders (`src/lib/demo/engine.ts`). For trying the shop and filming it; turn it off to sell.
 */
export function isDemoMode(): boolean {
  return process.env.SHOP_DEMO_MODE === 'true';
}

/**
 * Merchant mode (`SHOP_MERCHANT_MODE=true`): the order page also shows the merchant's controls (refunds from the
 * merchant's wallet, pause, resume and cancel of subscriptions). They act with the secret key for whoever opens the
 * page, so turn it on only on your own machine, never on a public deployment: a real shop puts them behind its admin
 * sign-in (or leaves them to the Quasar dashboard).
 */
export function isMerchantMode(): boolean {
  return process.env.SHOP_MERCHANT_MODE === 'true';
}

/** The switches as the page reads them. */
export type ShopMode = { demo: boolean; merchant: boolean };

export function shopMode(): ShopMode {
  return { demo: isDemoMode(), merchant: isMerchantMode() };
}

/** Seeds the sample orders and starts the simulation, in demo mode only. */
export function prepareDemo() {
  if (isDemoMode()) ensureDemo();
}
