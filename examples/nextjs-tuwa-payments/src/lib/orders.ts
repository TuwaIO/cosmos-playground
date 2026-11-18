import { formatBaseUnits } from '@tuwaio/orbit-core';
import type { Invoice, InvoiceStatus } from '@tuwaio/quasar-sdk';

import { type ShopMethod } from '@/lib/methods';
import { getQuasar } from '@/lib/quasar';
import { TIMELINE_TEXT } from '@/lib/status';

// The shop has no database. An order is a Quasar invoice: issued with the visitor's ID as the buyer's external ID and
// with the shop's order ID in its metadata. The pages read the invoices of the visitor from Quasar, so a visitor sees
// their own orders only, on any number of servers. A real shop keeps its orders in its own database and fulfils them
// from the webhooks (`src/app/api/webhooks/quasar/route.ts`).

/** What an order is: a cart, one product bought at once, or the membership of Cosmos Club. */
export type OrderKind = 'cart' | 'product' | 'club';

export type OrderLine = { name: string; quantity: string; unitPrice: string; net: string };

/** The payment of an order, from the settlement of its invoice. */
export type OrderPayment = {
  /** Token symbol and CAIP-2 chain of the method paid with, when the app still lists it. */
  symbol: string | null;
  chainId: string | null;
  /** Amount received, as a decimal string of the token; `null` when the method is no longer listed. */
  amountPaid: string | null;
  txHash: string;
  /** The address that paid. */
  payer: string | null;
  paidAt: string | null;
};

export type Order = {
  /** The shop's order ID (the `orderId` of the invoice metadata): the address of the order page. */
  id: string;
  invoiceId: string;
  /** Series number (`TEST-…` for invoices issued with a test key). */
  number: string | null;
  kind: OrderKind;
  title: string;
  status: InvoiceStatus;
  total: string;
  currency: string;
  issuedAt: string;
  lines: OrderLine[];
  /** Opens the checkout while the invoice can be paid. */
  checkoutToken: string | null;
  /** The payment page of the invoice on the Quasar dashboard. */
  payUrl: string | null;
  payment: OrderPayment | null;
  /** Whether the receipt exists (the invoice is paid). */
  hasReceipt: boolean;
  refundedTotal: string;
};

/** A step of an order's timeline: an event of the invoice's ledger in Quasar. */
export type TimelineEntry = { id: string; type: string; at: string; text: string | null };

const KINDS: readonly OrderKind[] = ['cart', 'product', 'club'];

/** Pages of 100 invoices the shop reads for one visitor at most. */
const MAX_PAGES = 3;

/** What the order is called in the lists: the first line, and how many others. */
export function titleOf(lines: readonly { name: string }[]): string {
  if (lines.length === 0) return 'Order';
  return lines.length === 1 ? lines[0].name : `${lines[0].name} + ${lines.length - 1} more`;
}

/** The order of an invoice, or `null` for an invoice the shop did not issue as an order. */
function toOrder(invoice: Invoice, methods: readonly ShopMethod[]): Order | null {
  const orderId = invoice.metadata?.orderId;
  if (typeof orderId !== 'string') return null;
  const kind = KINDS.find((item) => item === invoice.metadata?.kind) ?? 'cart';
  const settlement = invoice.settlement;
  const method = settlement ? methods.find((item) => item.id === settlement.methodId) : undefined;
  return {
    id: orderId,
    invoiceId: invoice.id,
    number: invoice.number,
    kind,
    title: titleOf(invoice.lineItems),
    status: invoice.status,
    total: invoice.total,
    currency: invoice.currency,
    issuedAt: invoice.issuedAt ?? invoice.createdAt,
    lines: invoice.lineItems.map(({ name, quantity, unitPrice, net }) => ({ name, quantity, unitPrice, net })),
    checkoutToken: invoice.checkoutToken,
    payUrl: invoice.payUrl,
    payment: settlement
      ? {
          symbol: method?.symbol ?? null,
          chainId: settlement.chainId,
          amountPaid: method ? (formatBaseUnits(settlement.amountPaid, method.decimals) ?? null) : null,
          txHash: settlement.txHash,
          payer: settlement.originWallet,
          paidAt: settlement.paidAt,
        }
      : null,
    hasReceipt: Boolean(invoice.receiptNumber),
    refundedTotal: invoice.refundedTotal,
  };
}

/**
 * The orders of a visitor, newest first: the invoices of the app whose buyer has the visitor's ID.
 *
 * @param visitorId - The visitor ID of the browser (`readVisitor`).
 * @param methods - The payment methods of the app, to name what an order was paid with.
 * @throws {QuasarSDKError} When Quasar refuses the request.
 */
export async function listOrders(visitorId: string, methods: readonly ShopMethod[] = []): Promise<Order[]> {
  const payments = getQuasar().payments;
  const orders: Order[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const { data, nextCursor } = await payments.listInvoices({ externalId: visitorId, limit: 100, cursor });
    for (const invoice of data) {
      const order = toOrder(invoice, methods);
      if (order) orders.push(order);
    }
    if (!nextCursor) break;
    cursor = nextCursor;
  }
  return orders;
}

/**
 * One order of a visitor. It is looked up among the visitor's own invoices, so the ID of another visitor's order finds
 * nothing.
 */
export async function findOrder(
  visitorId: string,
  orderId: string,
  methods: readonly ShopMethod[] = [],
): Promise<Order | null> {
  return (await listOrders(visitorId, methods)).find((order) => order.id === orderId) ?? null;
}

/** A refund that was asked for and whose transaction no wallet has sent yet. */
export interface WaitingRefund {
  /** The refund in Quasar. */
  id: string;
  /** Its amount in the invoice currency. */
  amount: string;
  /** The invoice currency. */
  currency: string;
}

/**
 * The refunds of an invoice that wait for their transaction, newest first. Such a refund keeps its amount until it is
 * sent or withdrawn, so the merchant controls of the order page show it. Call it in merchant mode only.
 */
export async function waitingRefunds(invoiceId: string): Promise<WaitingRefund[]> {
  const { data } = await getQuasar().payments.listInvoiceRefunds(invoiceId, { limit: 100 });
  return data
    .filter(({ status }) => status === 'requested')
    .map(({ id, amount, currency }) => ({ id, amount, currency }));
}

/**
 * The timeline of an order: the invoice and refund events of its ledger in Quasar, oldest first. They are the events
 * the webhooks of the app carry.
 */
export async function orderTimeline(invoiceId: string): Promise<TimelineEntry[]> {
  const { data } = await getQuasar().payments.getEvents(invoiceId, { limit: 100 });
  return data
    .filter(({ type }) => type.startsWith('invoice.') || type.startsWith('refund.') || type.startsWith('payment.'))
    .map(({ id, type, createdAt }) => ({ id, type, at: createdAt, text: TIMELINE_TEXT[type] ?? null }));
}
