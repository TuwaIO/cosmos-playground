import { Quasar } from '@tuwaio/quasar-sdk';

let client: Quasar | undefined;

/** Whether the secret key issues test invoices (`sk_test_…`): the shop then says its payments are test payments. */
export function isTestKey(): boolean {
  return (process.env.QUASAR_SECRET_KEY ?? '').startsWith('sk_test_');
}

/**
 * The Quasar client of the shop, created on first use with the secret key of the Payments app. Server only: the key
 * issues invoices in your name, so never import this file from a client component.
 *
 * The shop takes test payments unless told otherwise: a live key (`sk_live_…`) is refused until
 * `SHOP_LIVE_PAYMENTS=true`, so a deployment meant as a demo cannot issue real invoices by mistake.
 *
 * @throws {Error} When `QUASAR_SECRET_KEY` is not set, or is a live key while `SHOP_LIVE_PAYMENTS` is not `true`.
 */
export function getQuasar(): Quasar {
  const secretKey = process.env.QUASAR_SECRET_KEY;
  if (!secretKey) {
    throw new Error('QUASAR_SECRET_KEY is not set: copy the secret key of your Quasar Payments app into .env');
  }
  if (!isTestKey() && process.env.SHOP_LIVE_PAYMENTS !== 'true') {
    throw new Error(
      'QUASAR_SECRET_KEY is a live key: the shop takes test payments only. Set SHOP_LIVE_PAYMENTS=true to sell for real',
    );
  }
  client ??= new Quasar({ secretKey, baseUrl: process.env.NEXT_PUBLIC_QUASAR_BASE_URL || undefined });
  return client;
}
