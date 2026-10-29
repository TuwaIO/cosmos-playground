'use server';

import {
  QuasarSDKError,
  type Refund,
  type RefundParams,
  type RefundStart,
  type SubmitRefundParams,
} from '@tuwaio/quasar-sdk';

import {
  demoControlSubscription,
  demoReadRefund,
  demoRefund,
  DemoRefusal,
  type SubscriptionControl,
} from '@/lib/demo/engine';
import { isDemoMode, isMerchantMode } from '@/lib/mode';
import { attachInvoice, attachRefund, attachSubscription, findOrder, findOrderByInvoice } from '@/lib/orders';
import { getQuasar } from '@/lib/quasar';
import { type ActionResult, ok, refused } from '@/lib/result';

// The merchant's controls of the order page: refunds and subscription changes. They act with the secret key, so they
// work only in merchant mode (`SHOP_MERCHANT_MODE=true`, on your own machine), and only on the shop's own orders.

const MERCHANT_MODE_OFF = refused(
  'merchant_mode_off',
  'Merchant actions are off: set SHOP_MERCHANT_MODE=true in .env on your own machine, never on a public deployment.',
);

function failure(error: unknown): ActionResult<never> {
  if (error instanceof QuasarSDKError || error instanceof DemoRefusal) {
    return refused(error.code ?? 'request_failed', error.message);
  }
  return refused('request_failed', error instanceof Error ? error.message : String(error));
}

/**
 * Asks Quasar for the refund of a paid invoice of the shop (the `request` of `createRefundStore`). In demo mode the
 * simulation takes it, with the merchant's transfer simulated (see `createDemoRefundStore`).
 */
export async function requestRefund(invoiceId: string, params: RefundParams): Promise<ActionResult<RefundStart>> {
  if (!isMerchantMode()) return MERCHANT_MODE_OFF;
  const order = findOrderByInvoice(invoiceId);
  if (!order) return refused('invoice_not_found', 'This invoice is not an order of the shop');
  try {
    const start = isDemoMode() ? demoRefund(invoiceId, params) : await getQuasar().payments.refund(invoiceId, params);
    attachRefund(order.id, start.refund);
    return ok(start);
  } catch (error) {
    return failure(error);
  }
}

/** Hands Quasar the refund transaction the merchant's wallet sent (the `submit` of `createRefundStore`). */
export async function submitRefund(refundId: string, params: SubmitRefundParams): Promise<ActionResult<Refund>> {
  if (!isMerchantMode()) return MERCHANT_MODE_OFF;
  if (isDemoMode()) return refused('demo_mode', 'Demo mode sends nothing from a wallet: the transfer is simulated');
  try {
    const refund = await getQuasar().payments.submitRefund(refundId, params);
    const order = findOrderByInvoice(refund.invoiceId);
    if (order) attachRefund(order.id, refund);
    return ok(refund);
  } catch (error) {
    return failure(error);
  }
}

/** Reads a refund while Quasar confirms it (the `get` of `createRefundStore`). */
export async function readRefund(refundId: string): Promise<ActionResult<Refund>> {
  if (!isMerchantMode()) return MERCHANT_MODE_OFF;
  try {
    return ok(isDemoMode() ? demoReadRefund(refundId) : await getQuasar().payments.getRefund(refundId));
  } catch (error) {
    return failure(error);
  }
}

/** Pauses, resumes, cancels at the period end, or takes the cancellation back. The webhooks follow. */
export async function controlSubscription(orderId: string, action: SubscriptionControl): Promise<ActionResult<null>> {
  if (!isMerchantMode()) return MERCHANT_MODE_OFF;
  const order = findOrder(orderId);
  const subscriptionId = order?.subscription?.id;
  if (!order || !subscriptionId) return refused('subscription_not_found', 'This order has no subscription');
  try {
    if (isDemoMode()) {
      const { subscription, invoice } = demoControlSubscription(subscriptionId, action);
      attachSubscription(order.id, subscription);
      if (invoice) attachInvoice(order.id, invoice, { checkoutToken: invoice.checkoutToken, payUrl: null });
      return ok(null);
    }
    const payments = getQuasar().payments;
    if (action === 'resume') {
      const { subscription, invoice, checkoutToken, payUrl } = await payments.resumeSubscription(subscriptionId);
      attachSubscription(order.id, subscription);
      if (invoice) attachInvoice(order.id, invoice, { checkoutToken, payUrl });
    } else {
      const subscription =
        action === 'pause'
          ? await payments.pauseSubscription(subscriptionId)
          : action === 'cancel'
            ? await payments.cancelSubscription(subscriptionId, { atPeriodEnd: true, reason: 'Cancelled by the shop' })
            : await payments.undoSubscriptionCancel(subscriptionId);
      attachSubscription(order.id, subscription);
    }
    return ok(null);
  } catch (error) {
    return failure(error);
  }
}
