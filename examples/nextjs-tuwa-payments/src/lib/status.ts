import type { InvoiceStatus, PaymentWebhookEventType, SubscriptionStatus } from '@tuwaio/quasar-sdk';

import type { StatusTone } from '@/components/ui/StatusBadge';
import type { Order } from '@/lib/orderTypes';

// How the shop names and colours the states of Quasar: invoices, orders, subscriptions and webhook events

export const INVOICE_STATUS: Record<InvoiceStatus, { label: string; tone: StatusTone }> = {
  open: { label: 'Open', tone: 'pending' },
  processing: { label: 'Confirming', tone: 'pending' },
  paid: { label: 'Paid', tone: 'success' },
  underpaid: { label: 'Underpaid', tone: 'error' },
  held: { label: 'Held', tone: 'pending' },
  partially_refunded: { label: 'Part refunded', tone: 'neutral' },
  refunded: { label: 'Refunded', tone: 'neutral' },
  expired: { label: 'Expired', tone: 'error' },
  cancelled: { label: 'Cancelled', tone: 'error' },
};

export const SUBSCRIPTION_STATUS: Record<SubscriptionStatus, { label: string; tone: StatusTone }> = {
  trialing: { label: 'Trial', tone: 'neutral' },
  incomplete: { label: 'Awaiting payment', tone: 'pending' },
  active: { label: 'Active', tone: 'success' },
  past_due: { label: 'Past due', tone: 'error' },
  paused: { label: 'Paused', tone: 'neutral' },
  canceled: { label: 'Canceled', tone: 'error' },
  ended: { label: 'Ended', tone: 'neutral' },
};

/** The filters of the Orders page. */
export type OrderFilter = 'all' | 'paid' | 'open' | 'refunded' | 'subscriptions';

/** An invoice the buyer can still pay from the shop. */
export const PAYABLE: readonly InvoiceStatus[] = ['open', 'underpaid'];

/** The state of an order: its newest invoice (a subscription's current period). */
export function orderStatus(order: Order): { label: string; tone: StatusTone; status: InvoiceStatus | null } {
  const latest = order.invoices[0];
  if (!latest) return { label: 'Issuing', tone: 'neutral', status: null };
  return { ...INVOICE_STATUS[latest.status], status: latest.status };
}

/** Whether an order belongs under a filter of the Orders page. */
export function matchesFilter(order: Order, filter: OrderFilter): boolean {
  const status = order.invoices[0]?.status;
  switch (filter) {
    case 'all':
      return true;
    case 'paid':
      return status === 'paid';
    case 'open':
      return status === 'open' || status === 'underpaid' || status === 'processing';
    case 'refunded':
      return status === 'refunded' || status === 'partially_refunded';
    case 'subscriptions':
      return order.kind === 'subscription';
  }
}

/** The families of webhook events, for the filters of the event log. */
export type EventFamily = 'invoices' | 'subscriptions' | 'refunds';

export function eventFamily(type: PaymentWebhookEventType): EventFamily {
  if (type.startsWith('subscription.')) return 'subscriptions';
  if (type.startsWith('refund.')) return 'refunds';
  return 'invoices';
}

const SUCCESS_EVENTS = new Set<PaymentWebhookEventType>(['invoice.paid', 'refund.confirmed']);
const ERROR_EVENTS = new Set<PaymentWebhookEventType>([
  'invoice.underpaid',
  'invoice.expired',
  'invoice.cancelled',
  'refund.failed',
  'payment.reverted',
  'subscription.charge_failed',
]);
const PENDING_EVENTS = new Set<PaymentWebhookEventType>(['invoice.processing', 'invoice.held']);

/** The tone of an event: money in or back, something that went wrong, something on its way, or a notice. */
export function eventTone(type: PaymentWebhookEventType): StatusTone {
  if (SUCCESS_EVENTS.has(type)) return 'success';
  if (ERROR_EVENTS.has(type)) return 'error';
  if (PENDING_EVENTS.has(type)) return 'pending';
  return 'neutral';
}

/** The short ID of an order, as the buyer sees it: `#7C1F3A`. */
export function shortOrderId(orderId: string): string {
  return `#${orderId.replace(/-/g, '').slice(0, 6).toUpperCase()}`;
}
