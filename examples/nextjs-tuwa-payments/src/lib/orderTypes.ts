import type { InvoiceStatus, PaymentWebhookEventType, SubscriptionStatus } from '@tuwaio/quasar-sdk';

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
};

export type Order = {
  id: string;
  kind: 'product' | 'subscription';
  title: string;
  /** Price in the currency of the catalog, as a decimal string. */
  price: string;
  currency: string;
  createdAt: string;
  /** Newest first: the invoice of a product (and its correction), or one invoice per period of a subscription. */
  invoices: OrderInvoice[];
  subscription: {
    id: string;
    status: SubscriptionStatus;
    collection: 'send_invoice' | 'auto_charge';
    /** Whether the buyer's wallet granted automatic charges (ERC-7715). */
    autoCharge: boolean;
  } | null;
  /** When the shop fulfilled the order: the first `invoice.paid` webhook. */
  fulfilledAt: string | null;
};

export type WebhookLogEntry = {
  /** ID of the Quasar event (the same for every delivery and retry). */
  id: string;
  type: PaymentWebhookEventType;
  environment: 'live' | 'test';
  invoiceNumber: string | null;
  orderId: string | null;
  receivedAt: string;
  /** `false` for a delivery of an event the shop already processed. */
  firstDelivery: boolean;
};

export type OrderBook = {
  orders: Order[];
  webhooks: WebhookLogEntry[];
};
