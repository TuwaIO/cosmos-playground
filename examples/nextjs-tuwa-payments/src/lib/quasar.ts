import { Quasar } from '@tuwaio/quasar-sdk';

let client: Quasar | undefined;

/**
 * The Quasar client of the shop, created on first use with the secret key of the Payments app. Server only: the key
 * issues invoices in your name, so never import this file from a client component.
 */
export function getQuasar(): Quasar {
  const secretKey = process.env.QUASAR_SECRET_KEY;
  if (!secretKey) {
    throw new Error('QUASAR_SECRET_KEY is not set: copy the secret key of your Quasar Payments app into .env');
  }
  client ??= new Quasar({ secretKey, baseUrl: process.env.NEXT_PUBLIC_QUASAR_BASE_URL || undefined });
  return client;
}
