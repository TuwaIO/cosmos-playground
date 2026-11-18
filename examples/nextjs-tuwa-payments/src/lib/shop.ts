import { QuasarSDKError } from '@tuwaio/quasar-sdk';
import { cache } from 'react';

import type { AcceptedMethods } from '@/lib/methods';
import { getQuasar } from '@/lib/quasar';

/** The message to show for a refusal of Quasar, with its stable code. */
export function describeError(error: unknown): string {
  if (error instanceof QuasarSDKError) {
    const reason = typeof error.details?.reason === 'string' ? ` (${error.details.reason})` : '';
    return `${error.code ?? `HTTP ${error.status ?? '?'}`}${reason}: ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
}

/**
 * The active payment methods of your Quasar app, in their order: the pages show what the buyer can pay with, or why
 * nothing can be bought yet. Only what a page shows leaves the server (never the wallets that receive the payments).
 * Read once per request, however many parts of the page ask.
 */
export const readMethods = cache(async (): Promise<AcceptedMethods> => {
  try {
    const { data } = await getQuasar().payments.listMethods();
    return {
      ok: true,
      methods: data.map(({ id, name, symbol, chainId, assetId, decimals, featured }) => ({
        id,
        name,
        symbol,
        chainId,
        assetId,
        decimals,
        featured: Boolean(featured),
      })),
    };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
});
