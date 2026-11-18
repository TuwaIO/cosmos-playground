'use server';

import { QuasarSDKError, type RefundParams, type SubmitRefundParams } from '@tuwaio/quasar-sdk';
import { refundAction } from '@tuwaio/quasar-sdk/checkout';

import { isMerchantMode } from '@/lib/mode';
import { getQuasar } from '@/lib/quasar';

// The merchant's refund of an order: the three calls of the refund store of `@tuwaio/quasar-sdk/checkout`, which the
// refund window of Nova Payments drives. They act with the secret key, so they answer only in merchant mode
// (`SHOP_MERCHANT_MODE=true`, on your own machine). `refundAction` returns a refusal of Quasar to the browser with
// its code, which a thrown error of a Server Action would lose.

/** The Payments API of the shop, in merchant mode only. */
function merchantPayments() {
  if (!isMerchantMode()) {
    throw new QuasarSDKError(
      'Merchant actions are off: set SHOP_MERCHANT_MODE=true on your own machine, never on a public deployment',
      403,
      new Error('merchant_mode_off'),
      { code: 'merchant_mode_off' },
    );
  }
  return getQuasar().payments;
}

/**
 * Asks Quasar for the refund of a paid invoice (the `request` of the refund store). A refund asked for keeps its amount
 * until its transaction is sent or the refund is withdrawn, and the refund window asks for one each time it reaches the
 * confirmation. So the new refund takes the place of those that still wait: an invoice of this shop never has two of
 * them, and a window closed before sending leaves at most the last one, which the order page shows with "Withdraw".
 */
export const requestRefund = refundAction(async (invoiceId: string, params: RefundParams) => {
  const payments = merchantPayments();
  const { data } = await payments.listInvoiceRefunds(invoiceId, { limit: 100 });
  for (const refund of data) {
    if (refund.status !== 'requested') continue;
    try {
      await payments.withdrawRefund(refund.id);
    } catch (error) {
      // Sent or ended in the meantime: nothing waits any more, and what was sent stays as it is
      if (!(error instanceof QuasarSDKError && error.code === 'refund_not_waiting')) throw error;
    }
  }
  return payments.refund(invoiceId, params);
});

/** Takes back a refund that waits for its transaction (the "Withdraw" of the order page). */
export const withdrawRefund = refundAction(async (refundId: string) => merchantPayments().withdrawRefund(refundId));

/** Shows what a refund would send (the `preview` of the refund store). */
export const previewRefund = refundAction(async (invoiceId: string, params: RefundParams) =>
  merchantPayments().previewRefund(invoiceId, params),
);

/** Hands Quasar the refund transaction the merchant's wallet sent (the `submit` of the refund store). */
export const submitRefund = refundAction(async (refundId: string, params: SubmitRefundParams) =>
  merchantPayments().submitRefund(refundId, params),
);

/** Reads a refund while Quasar confirms it (the `get` of the refund store). */
export const readRefund = refundAction(async (refundId: string) => merchantPayments().getRefund(refundId));
