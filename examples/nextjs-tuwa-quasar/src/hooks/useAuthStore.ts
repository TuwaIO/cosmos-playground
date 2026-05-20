import { utils } from '@tuwaio/quasar-sdk';

/**
 * Store to persist the Quasar Mini-Session signature on the client side.
 * This prevents repeated signature requests while the wallet is connected.
 *
 * Uses the factory from the SDK to ensure compatibility and consistency.
 */
export const useAuthStore = utils.createMiniSessionStore('quasar-mini-session-storage');
