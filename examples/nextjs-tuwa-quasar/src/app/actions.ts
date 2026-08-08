'use server';

import { Quasar, Transaction } from '@tuwaio/quasar-sdk';
import { isSessionMatchingTarget, SiwxClientSession } from '@tuwaio/sdk/siwx';
import { SiwxSession } from '@tuwaio/sdk/siwx/server';

import { appConfig } from '@/configs/appConfig';
import { QUASAR_BASE_URL } from '@/constants';

const quasar = new Quasar({
  baseUrl: QUASAR_BASE_URL,
  secretKey: process.env.QUASAR_SDK_SK ?? '',
});

// --- Server Action for onRemoteCreate ---
/**
 * Syncs a transaction to Quasar.
 * Requires a valid signature to prevent quota draining.
 */
export async function syncTransaction(tx: Transaction, session: SiwxClientSession | SiwxSession | null) {
  if (!session) {
    return { success: false, reason: 'unauthenticated' };
  }

  if (tx.from && !isSessionMatchingTarget(session, tx.from, tx.chainId)) {
    console.warn('[Quasar Action] Session mismatch for syncTransaction:', {
      sessionAddress: session.address,
      txFrom: tx.from,
    });
    return { success: false, reason: 'session_mismatch' };
  }

  try {
    console.log('Syncing tx to Quasar...', tx.txKey);

    await quasar.pulsar.syncCreate(tx, appConfig.appName);

    return { success: true };
  } catch (error) {
    console.warn('[Quasar Engine Sync Error]', error instanceof Error ? error.message : error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// --- Server Action for getHistory ---
/**
 * Retrieves transaction history from Quasar.
 * Requires a valid Mini-Session signature to protect the API quota.
 */
export async function getHistory(
  params: {
    walletAddress: string;
    page?: number;
    limit?: number;
    chainId?: string;
    status?: string;
    txKey?: string;
    appName?: string;
  },
  session: SiwxClientSession | SiwxSession | null,
) {
  if (!session || !isSessionMatchingTarget(session, params.walletAddress, params.chainId)) {
    return {
      docs: [],
      totalDocs: 0,
      limit: params.limit ?? 10,
      page: params.page ?? 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }

  try {
    const history = await quasar.pulsar.getHistory({
      ...params,
    });

    return history;
  } catch (error) {
    console.warn('[Quasar Engine GetHistory Error]', error instanceof Error ? error.message : error);
    return {
      docs: [],
      totalDocs: 0,
      limit: params.limit ?? 10,
      page: params.page ?? 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  }
}
