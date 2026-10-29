import type {
  InvoiceStatus,
  PaymentWebhookEventType,
  SubscriptionInterval,
  SubscriptionStatus,
} from '@tuwaio/quasar-sdk';

// The shapes the order book shares with the page (no secrets: the page shows them as they are)

export type OrderInvoice = {
  id: string;
  /** Series number (`TEST-…` for invoices issued with a test key); `null` until Quasar numbers it. */
  number: string | null;
  status: InvoiceStatus;
  total: string;
  currency: string;
  /** Opens the checkout while the invoice can be paid. */
  checkoutToken: string | null;
  /** The payment page of the invoice on the Quasar dashboard. */
  payUrl: string | null;
  /** The billing period of a subscription invoice, from 1. */
  period: number | null;
  /** The receipt number, once paid: the receipt PDF exists from then on. */
  receiptNumber: string | null;
  /** Refunded so far, in the invoice currency. */
  refundedTotal: string;
  issuedAt: string | null;
};

/** A line of an order: one product of the catalog and how many. */
export type OrderLine = { productId: string; name: string; quantity: number; unitPrice: string };

/** The payment that settled the order, from `event.data.settlement`. */
export type OrderPayment = {
  methodId: string | null;
  /** CAIP-2 chain of the payment. */
  chainId: string | null;
  txHash: string;
  /** The address that paid. */
  payer: string | null;
  /** Amount received, in base units of the method's token. */
  amountPaid: string | null;
  paidAt: string | null;
};

export type OrderRefund = {
  id: string;
  status: 'requested' | 'submitted' | 'confirmed' | 'failed';
  amount: string;
  currency: string;
  creditNoteNumber: string | null;
  confirmedAt: string | null;
};

export type OrderSubscription = {
  id: string;
  status: SubscriptionStatus;
  collection: 'send_invoice' | 'auto_charge';
  /** Whether the buyer's wallet granted automatic charges (ERC-7715). */
  autoCharge: boolean;
  interval: SubscriptionInterval;
  /** The running period, from 1. */
  currentPeriod: number;
  /** Periods bought; `null` without an end. */
  cycles: number | null;
  /** When the running period ends: the next invoice is issued then. */
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

/** A webhook event of an order, for its timeline. */
export type OrderEvent = { id: string; type: PaymentWebhookEventType; createdAt: string; receivedAt: string };

export type Order = {
  id: string;
  kind: 'product' | 'subscription';
  title: string;
  lines: OrderLine[];
  /** Total in the currency of the catalog, as a decimal string. */
  price: string;
  currency: string;
  createdAt: string;
  /** Newest first: the invoice of a product (and its correction), or one invoice per period of a subscription. */
  invoices: OrderInvoice[];
  subscription: OrderSubscription | null;
  payment: OrderPayment | null;
  refunds: OrderRefund[];
  /** The webhook events of the order, oldest first. */
  events: OrderEvent[];
  /** When the shop fulfilled the order: the first `invoice.paid` webhook. */
  fulfilledAt: string | null;
};

export type WebhookLogEntry = {
  /** ID of the Quasar event (the same for every delivery and retry). */
  id: string;
  type: PaymentWebhookEventType;
  environment: 'live' | 'test';
  invoiceNumber: string | null;
  /** What the event is worth: the invoice total, or the amount of a refund event (`refund: true`). */
  amount: { value: string; currency: string; refund: boolean } | null;
  orderId: string | null;
  orderTitle: string | null;
  /** When Quasar recorded the event. */
  createdAt: string;
  /** When this delivery was sent (signed with the body). */
  sentAt: string;
  receivedAt: string;
  /** `false` for a delivery of an event the shop already processed. */
  firstDelivery: boolean;
  /** `webhook`: verified with `verifyWebhook`; `demo`: made by the simulation of demo mode. */
  source: 'webhook' | 'demo';
  /** A trimmed copy of the event for the log: no checkout tokens, payment links or metadata beyond the order ID. */
  summary: string;
};

export type OrderBook = {
  orders: Order[];
  webhooks: WebhookLogEntry[];
};
