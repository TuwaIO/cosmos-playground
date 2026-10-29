import type { RefundParams } from '@tuwaio/quasar-sdk';
import type { CheckoutError, RefundState, RefundStore } from '@tuwaio/quasar-sdk/checkout';
import { createStore } from 'zustand/vanilla';

import { readRefund, requestRefund } from '@/app/merchantActions';

/** The refusal of a Server Action as the refund window shows it. */
const errorOf = (code: string, message: string): CheckoutError => ({ code, message });

/**
 * The refund store of demo mode, in place of `createRefundStore`: the same state and phases, so Nova's `RefundDialog`
 * runs unchanged, but no wallet is asked. `start` asks the simulation for the refund, which stands in for the merchant's
 * transfer (it is `submitted` at once), so the window goes from the amount straight to "On its way"; the store then
 * reads the refund every second until the simulation confirms it with its credit note and webhooks.
 *
 * Side effects: the `requestRefund` and `readRefund` Server Actions; a timer while the refund is confirmed.
 */
export function createDemoRefundStore(): RefundStore {
  let timer: ReturnType<typeof setInterval> | null = null;
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  return createStore<RefundState>()((set, get) => ({
    phase: 'idle',
    refund: null,
    instructions: null,
    error: null,
    start: async (invoiceId: string, params: RefundParams = {}) => {
      stop();
      set({ phase: 'requesting', error: null, refund: null, instructions: null });
      const started = await requestRefund(invoiceId, params);
      if (!started.ok) {
        set({ phase: 'idle', error: errorOf(started.code, started.message) });
        return false;
      }
      set({ phase: 'confirming', refund: started.value.refund, instructions: started.value.instructions });
      timer = setInterval(() => {
        const id = get().refund?.id;
        if (!id) return stop();
        void readRefund(id).then((read) => {
          if (!read.ok || get().refund?.id !== id) return;
          if (read.value.status === 'confirmed' || read.value.status === 'failed') {
            stop();
            set({ phase: read.value.status, refund: read.value });
          }
        });
      }, 1000);
      return true;
    },
    resume: (refund, instructions) => set({ phase: 'confirming', refund, instructions, error: null }),
    submit: async () => {
      set({ error: errorOf('demo_mode', 'Demo mode sends nothing from a wallet: the transfer is simulated') });
      return false;
    },
    reset: () => {
      stop();
      set({ phase: 'idle', refund: null, instructions: null, error: null });
    },
  }));
}
