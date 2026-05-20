'use server';

import { MiniSessionAuth, Quasar, Transaction, utils } from '@tuwaio/quasar-sdk';

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
export async function syncTransaction(tx: Transaction, authData: MiniSessionAuth) {
  const isValidSignature = await utils.verifyMiniSession({
    walletAddress: authData.walletAddress,
    signature: authData.signature,
    timestamp: authData.timestamp,
    chainType: authData.chainType,
  });

  if (!isValidSignature) {
    throw new Error('Invalid or expired security signature. Please try again.');
  }

  try {
    console.log('Syncing tx to Quasar...', tx.txKey);

    await quasar.pulsar.syncCreate(tx, appConfig.appName);

    return { success: true };
  } catch (error) {
    console.error('Sync failed', error);
    throw error;
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
  authData: MiniSessionAuth,
) {
  const isValidSignature = await utils.verifyMiniSession({
    walletAddress: authData.walletAddress,
    signature: authData.signature,
    timestamp: authData.timestamp,
    chainType: authData.chainType,
  });

  if (!isValidSignature) {
    throw new Error('Invalid or expired security signature. Please try again.');
  }

  try {
    const history = await quasar.pulsar.getHistory({
      ...params,
    });

    return history;
  } catch (error) {
    console.error('Get history failed', error);
    throw error;
  }
}
