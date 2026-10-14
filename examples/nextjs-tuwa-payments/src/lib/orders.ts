import type { Invoice, PaymentWebhookEvent, Subscription } from '@tuwaio/quasar-sdk';

import type { Order, OrderBook, OrderInvoice, WebhookLogEntry } from '@/lib/orderTypes';

// The order book of the demo shop, in memory. It lives on `globalThis` so it survives hot reloads in `next dev`; a
// real shop keeps orders in its database and fulfils them in a job queue, not in the request of the webhook.
type Book = { orders: Map<string, Order>; webhooks: WebhookLogEntry[]; processed: Set<string> };

const MAX_WEBHOOKS = 50;
const book: Book = ((globalThis as { __paymentsShop?: Book }).__paymentsShop ??= {
  orders: new Map(),
  webhooks: [],
  processed: new Set(),
});

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
  };
}

/** Adds the invoice to the order, or updates it: webhooks carry the invoice as it is when they are sent. */
function upsertInvoice(order: Order, invoice: OrderInvoice) {
  const index = order.invoices.findIndex((item) => item.id === invoice.id);
  if (index >= 0) order.invoices[index] = { ...order.invoices[index], ...invoice };
  else order.invoices.unshift(invoice);
}

export function createOrder(order: Omit<Order, 'createdAt' | 'invoices' | 'subscription' | 'fulfilledAt'>): Order {
  const created: Order = {
    ...order,
    createdAt: new Date().toISOString(),
    invoices: [],
    subscription: null,
    fulfilledAt: null,
  };
  book.orders.set(created.id, created);
  return created;
}

export function attachInvoice(
  orderId: string,
  invoice: Invoice,
  links: { checkoutToken: string | null; payUrl: string | null },
) {
  const order = book.orders.get(orderId);
  if (order) upsertInvoice(order, { ...toOrderInvoice(invoice), ...links });
}

export function attachSubscription(orderId: string, subscription: Subscription) {
  const order = book.orders.get(orderId);
  if (!order) return;
  order.subscription = {
    id: subscription.id,
    status: subscription.status,
    collection: subscription.collection,
    autoCharge: subscription.permission?.status === 'active',
  };
}

export function removeOrder(orderId: string) {
  book.orders.delete(orderId);
}

/** The order of an event: by the `orderId` the shop put in the metadata, else by the subscription it bills. */
function orderOf(event: PaymentWebhookEvent): Order | undefined {
  const metadata = event.data.invoice?.metadata ?? event.data.subscription?.metadata;
  const orderId = typeof metadata?.orderId === 'string' ? metadata.orderId : undefined;
  if (orderId && book.orders.has(orderId)) return book.orders.get(orderId);
  const subscriptionId = event.data.subscription?.id ?? event.data.invoice?.subscriptionId;
  if (!subscriptionId) return undefined;
  return [...book.orders.values()].find((order) => order.subscription?.id === subscriptionId);
}

/**
 * Applies a verified `payments.v1` event to the order book. Quasar may deliver an event more than once (retries,
 * redeliveries from the dashboard), so the shop acts on each event ID once.
 */
export function applyPaymentEvent(event: PaymentWebhookEvent): { firstDelivery: boolean; order: Order | undefined } {
  const firstDelivery = !book.processed.has(event.id);
  const order = orderOf(event);

  if (firstDelivery) {
    book.processed.add(event.id);
    if (order) {
      if (event.data.invoice) upsertInvoice(order, toOrderInvoice(event.data.invoice));
      if (event.data.subscription) attachSubscription(order.id, event.data.subscription);
      // Fulfil the order once, on the first payment (a subscription renews with more `invoice.paid` events)
      if (event.type === 'invoice.paid' && !order.fulfilledAt) order.fulfilledAt = event.createdAt;
    }
  }

  book.webhooks.unshift({
    id: event.id,
    type: event.type,
    environment: event.environment,
    invoiceNumber: event.data.invoice?.number ?? null,
    orderId: order?.id ?? null,
    receivedAt: new Date().toISOString(),
    firstDelivery,
  });
  book.webhooks.splice(MAX_WEBHOOKS);

  return { firstDelivery, order };
}

export function getOrderBook(): OrderBook {
  const orders = [...book.orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { orders, webhooks: book.webhooks };
}
