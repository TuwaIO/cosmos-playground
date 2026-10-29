import { EventEmitter } from 'node:events';

import type { Invoice, PaymentWebhookEvent, Refund, Subscription } from '@tuwaio/quasar-sdk';

import type {
  Order,
  OrderBook,
  OrderInvoice,
  OrderLine,
  OrderRefund,
  OrderSubscription,
  WebhookLogEntry,
} from '@/lib/orderTypes';

// The order book of the demo shop, in memory. It lives on `globalThis` so it survives hot reloads in `next dev`; a
// real shop keeps orders in its database and fulfils them in a job queue, not in the request of the webhook.
type Book = {
  orders: Map<string, Order>;
  webhooks: WebhookLogEntry[];
  processed: Set<string>;
  /** Tells `GET /api/events` (Server-Sent Events) that the book changed. */
  changes: EventEmitter;
};

const MAX_WEBHOOKS = 60;
const book: Book = ((globalThis as { __paymentsShop?: Book }).__paymentsShop ??= {
  orders: new Map(),
  webhooks: [],
  processed: new Set(),
  changes: new EventEmitter().setMaxListeners(100),
});

/** Calls `listener` after every change of the order book; returns the unsubscribe. */
export function onOrderBookChange(listener: () => void): () => void {
  book.changes.on('change', listener);
  return () => {
    book.changes.off('change', listener);
  };
}

function changed() {
  book.changes.emit('change');
}

function toOrderInvoice(invoice: Invoice): OrderInvoice {
  return {
    id: invoice.id,
    number: invoice.number,
    status: invoice.status,
    total: invoice.total,
    currency: invoice.currency,
    checkoutToken: invoice.checkoutToken,
    payUrl: invoice.payUrl,
    period: invoice.period,
    receiptNumber: invoice.receiptNumber,
    refundedTotal: invoice.refundedTotal,
    issuedAt: invoice.issuedAt,
  };
}

function toOrderSubscription(subscription: Subscription): OrderSubscription {
  return {
    id: subscription.id,
    status: subscription.status,
    collection: subscription.collection,
    autoCharge: subscription.permission?.status === 'active',
    interval: subscription.interval,
    currentPeriod: subscription.currentPeriod,
    cycles: subscription.cycles,
    currentPeriodEnd: subscription.currentPeriodEnd,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
  };
}

function toOrderRefund(refund: Refund): OrderRefund {
  return {
    id: refund.id,
    status: refund.status,
    amount: refund.amount,
    currency: refund.currency,
    creditNoteNumber: refund.creditNoteNumber,
    confirmedAt: refund.confirmedAt,
  };
}

/** Adds the invoice to the order, or updates it: webhooks carry the invoice as it is when they are sent. */
function upsertInvoice(order: Order, invoice: OrderInvoice) {
  const index = order.invoices.findIndex((item) => item.id === invoice.id);
  if (index >= 0) order.invoices[index] = { ...order.invoices[index], ...invoice };
  else order.invoices.unshift(invoice);
}

function upsertRefund(order: Order, refund: OrderRefund) {
  const index = order.refunds.findIndex((item) => item.id === refund.id);
  if (index >= 0) order.refunds[index] = refund;
  else order.refunds.push(refund);
}

export function createOrder(order: {
  id: string;
  kind: Order['kind'];
  title: string;
  lines: OrderLine[];
  price: string;
  currency: string;
  createdAt?: string;
}): Order {
  const created: Order = {
    ...order,
    createdAt: order.createdAt ?? new Date().toISOString(),
    invoices: [],
    subscription: null,
    payment: null,
    refunds: [],
    events: [],
    fulfilledAt: null,
  };
  book.orders.set(created.id, created);
  changed();
  return created;
}

export function attachInvoice(
  orderId: string,
  invoice: Invoice,
  links: { checkoutToken: string | null; payUrl: string | null },
) {
  const order = book.orders.get(orderId);
  if (!order) return;
  upsertInvoice(order, { ...toOrderInvoice(invoice), ...links });
  changed();
}

export function attachSubscription(orderId: string, subscription: Subscription) {
  const order = book.orders.get(orderId);
  if (!order) return;
  order.subscription = toOrderSubscription(subscription);
  changed();
}

export function attachRefund(orderId: string, refund: Refund) {
  const order = book.orders.get(orderId);
  if (!order) return;
  upsertRefund(order, toOrderRefund(refund));
  changed();
}

/** Forgets every order and webhook (the reset of demo mode). */
export function resetOrderBook() {
  book.orders.clear();
  book.webhooks.length = 0;
  book.processed.clear();
  changed();
}

export function removeOrder(orderId: string) {
  book.orders.delete(orderId);
  changed();
}

export function findOrder(orderId: string): Order | undefined {
  return book.orders.get(orderId);
}

/** The order an invoice of the shop belongs to. */
export function findOrderByInvoice(invoiceId: string): Order | undefined {
  return [...book.orders.values()].find((order) => order.invoices.some((invoice) => invoice.id === invoiceId));
}

/** The order of an event: by the `orderId` the shop put in the metadata, else by its subscription or invoice. */
function orderOf(event: PaymentWebhookEvent): Order | undefined {
  const metadata = event.data.invoice?.metadata ?? event.data.subscription?.metadata;
  const orderId = typeof metadata?.orderId === 'string' ? metadata.orderId : undefined;
  if (orderId && book.orders.has(orderId)) return book.orders.get(orderId);
  const orders = [...book.orders.values()];
  const subscriptionId = event.data.subscription?.id ?? event.data.invoice?.subscriptionId;
  const bySubscription = subscriptionId && orders.find((order) => order.subscription?.id === subscriptionId);
  if (bySubscription) return bySubscription;
  const invoiceId = event.data.refund?.invoiceId ?? event.data.invoice?.id;
  return invoiceId ? orders.find((order) => order.invoices.some((invoice) => invoice.id === invoiceId)) : undefined;
}

/**
 * A trimmed copy of the event for the log on the page: what happened and to what, without the checkout token, the
 * payment link, the buyer or metadata beyond the order ID. Secrets never reach the log (the event carries none).
 */
function summarize(event: PaymentWebhookEvent): string {
  const { invoice, settlement, refund, subscription } = event.data;
  const orderId = invoice?.metadata?.orderId;
  const summary = {
    id: event.id,
    type: event.type,
    createdAt: event.createdAt,
    environment: event.environment,
    data: {
      ...(invoice && {
        invoice: {
          id: invoice.id,
          number: invoice.number,
          status: invoice.status,
          total: invoice.total,
          currency: invoice.currency,
          ...(invoice.period !== null && { period: invoice.period }),
          ...(typeof orderId === 'string' && { metadata: { orderId } }),
        },
      }),
      ...(settlement && {
        settlement: {
          chainId: settlement.chainId,
          txHash: settlement.txHash,
          amountPaid: settlement.amountPaid,
          paidAt: settlement.paidAt,
        },
      }),
      ...(refund && {
        refund: { id: refund.id, status: refund.status, amount: refund.amount, creditNote: refund.creditNoteNumber },
      }),
      ...(subscription && {
        subscription: {
          id: subscription.id,
          status: subscription.status,
          currentPeriod: subscription.currentPeriod,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        },
      }),
    },
  };
  return JSON.stringify(summary, null, 2);
}

/**
 * Applies a verified `payments.v1` event to the order book. Quasar may deliver an event more than once (retries,
 * redeliveries from the dashboard), so the shop acts on each event ID once.
 *
 * @param event - The event, verified by `verifyWebhook` (or made by the simulation of demo mode).
 * @param options - `source`: where it came from, for the log; `receivedAt`: when it arrived (the sample orders of demo
 *   mode arrived earlier).
 */
export function applyPaymentEvent(
  event: PaymentWebhookEvent,
  options: { source?: WebhookLogEntry['source']; receivedAt?: string } = {},
): { firstDelivery: boolean; order: Order | undefined } {
  const firstDelivery = !book.processed.has(event.id);
  const order = orderOf(event);
  const receivedAt = options.receivedAt ?? new Date().toISOString();

  if (firstDelivery) {
    book.processed.add(event.id);
    if (order) {
      const { invoice, settlement, refund, subscription } = event.data;
      if (invoice) upsertInvoice(order, toOrderInvoice(invoice));
      if (subscription) order.subscription = toOrderSubscription(subscription);
      if (refund) upsertRefund(order, toOrderRefund(refund));
      if (settlement && (!order.payment || event.type === 'invoice.paid')) {
        order.payment = {
          methodId: settlement.methodId,
          chainId: settlement.chainId,
          txHash: settlement.txHash,
          payer: settlement.originWallet,
          amountPaid: settlement.amountPaid,
          paidAt: settlement.paidAt,
        };
      }
      order.events.push({ id: event.id, type: event.type, createdAt: event.createdAt, receivedAt });
      // Fulfil the order once, on the first payment (a subscription renews with more `invoice.paid` events)
      if (event.type === 'invoice.paid' && !order.fulfilledAt) order.fulfilledAt = receivedAt;
    }
  }

  book.webhooks.unshift({
    id: event.id,
    type: event.type,
    environment: event.environment,
    invoiceNumber: event.data.invoice?.number ?? null,
    amount: event.data.refund
      ? { value: event.data.refund.amount, currency: event.data.refund.currency, refund: true }
      : event.data.invoice
        ? { value: event.data.invoice.total, currency: event.data.invoice.currency, refund: false }
        : null,
    orderId: order?.id ?? null,
    orderTitle: order?.title ?? null,
    createdAt: event.createdAt,
    sentAt: event.sentAt,
    receivedAt,
    firstDelivery,
    source: options.source ?? 'webhook',
    summary: summarize(event),
  });
  book.webhooks.splice(MAX_WEBHOOKS);
  changed();

  return { firstDelivery, order };
}

export function getOrderBook(): OrderBook {
  const orders = [...book.orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  // Newest first by arrival (the sample orders of demo mode arrive out of order)
  const webhooks = [...book.webhooks].sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  return { orders, webhooks };
}
