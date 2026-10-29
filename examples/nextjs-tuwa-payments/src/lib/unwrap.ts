import { QuasarSDKError } from '@tuwaio/quasar-sdk';

import type { ActionResult } from '@/lib/result';

/**
 * The value of a Server Action's result, or a `QuasarSDKError` with Quasar's code: the checkout and refund stores read
 * the code of a refusal from it.
 */
export function unwrap<T>(result: ActionResult<T>): T {
  if (result.ok) return result.value;
  throw new QuasarSDKError(result.message, 409, new Error(result.message), { code: result.code });
}
