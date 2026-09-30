'use server';

import { Quasar, QuasarSDKError, type Transaction } from '@tuwaio/quasar-sdk';
import { getSiwxServerSession, isSessionMatchingTarget } from '@tuwaio/sdk/siwx/server';
import { cookies } from 'next/headers';

import { appConfig } from '@/configs/appConfig';
import { DEMO_SIGNING_SECRET } from '@/lib/authConfig';

const quasar = new Quasar({
  secretKey: process.env.QUASAR_SECRET_KEY ?? '',
  baseUrl: process.env.NEXT_PUBLIC_QUASAR_BASE_URL,
});

// The session comes from the HttpOnly cookie set by /api/siwx/verify, never from the browser
async function getSession() {
  return getSiwxServerSession({ cookieSource: await cookies(), signingSecret: DEMO_SIGNING_SECRET });
}

/**
 * Sends a new Pulsar transaction to Quasar (`onRemoteCreate` of the Pulsar store). Refuses transactions that the
 * signed-in wallet did not send, so nobody can spend the quota of the app for another address.
 */
export async function syncTransaction(tx: Transaction): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session || !isSessionMatchingTarget(session, tx.from, tx.chainId)) {
    return { success: false, error: 'The signed-in wallet did not send this transaction.' };
  }

  try {
    await quasar.pulsar.syncCreate(tx, appConfig.appName);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof QuasarSDKError ? error.message : 'Quasar is unavailable.' };
  }
}

/**
 * Returns one page of the Quasar history of the signed-in wallet, or `null` for another address.
 */
export async function getHistory(params: { walletAddress: string; page?: number }) {
  const session = await getSession();
  if (!session || !isSessionMatchingTarget(session, params.walletAddress)) {
    return null;
  }

  return quasar.pulsar.getHistory({
    walletAddress: params.walletAddress,
    page: params.page,
    limit: 10,
    appName: appConfig.appName,
  });
}
