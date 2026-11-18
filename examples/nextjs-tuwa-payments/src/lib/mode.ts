/**
 * Merchant mode (`SHOP_MERCHANT_MODE=true`): the order page also shows the merchant's refund button. It acts with the
 * secret key for whoever opens the page, so turn it on only on your own machine, never on a public deployment: a real
 * shop puts refunds behind its admin sign-in, or leaves them to the Quasar dashboard. Read on the server only.
 */
export function isMerchantMode(): boolean {
  return process.env.SHOP_MERCHANT_MODE === 'true';
}
