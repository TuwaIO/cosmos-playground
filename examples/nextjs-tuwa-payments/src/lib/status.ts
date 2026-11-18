import type { InvoiceStatus } from '@tuwaio/quasar-sdk';

/** The tone of a status chip: its frame and text colour. */
export type Tone = 'ok' | 'warn' | 'bad' | 'neutral';

/** How the shop names and colours the nine statuses of a Quasar invoice. */
export const INVOICE_STATUS: Record<InvoiceStatus, { label: string; tone: Tone }> = {
  open: { label: 'Awaiting payment', tone: 'warn' },
  processing: { label: 'Processing', tone: 'warn' },
  paid: { label: 'Paid', tone: 'ok' },
  underpaid: { label: 'Underpaid', tone: 'warn' },
  needs_review: { label: 'Needs review', tone: 'warn' },
  partially_refunded: { label: 'Partially refunded', tone: 'neutral' },
  refunded: { label: 'Refunded', tone: 'neutral' },
  expired: { label: 'Expired', tone: 'bad' },
  cancelled: { label: 'Cancelled', tone: 'bad' },
};

/** The statuses of an invoice the buyer can still pay from the shop. */
export const PAYABLE: readonly InvoiceStatus[] = ['open', 'underpaid'];

/** The statuses of an invoice whose money reached the shop: the order is fulfilled, and a member's order counts. */
export const SETTLED: readonly InvoiceStatus[] = ['paid', 'partially_refunded'];

/** The statuses the order page keeps reading for: a payment may still change them. */
export const IN_FLIGHT: readonly InvoiceStatus[] = ['open', 'processing', 'underpaid'];

/** What the shop says for the steps of an invoice's ledger it shows in the timeline of an order. */
export const TIMELINE_TEXT: Record<string, string> = {
  'invoice.issued': 'The shop issued the invoice.',
  'invoice.processing': 'Quasar saw the payment on the network.',
  'invoice.paid': 'Confirmed on-chain. The shop fulfilled the order.',
  'invoice.underpaid': 'Less than the price arrived. The rest can still be paid.',
  'invoice.needs_review': 'The payment waits for the shop to accept or return it.',
  'invoice.payment_accepted': 'The shop accepted the payment.',
  'invoice.expired': 'The invoice was not paid in time.',
  'invoice.cancelled': 'The shop cancelled the invoice.',
  'invoice.partially_refunded': 'A part of the payment went back to the wallet that paid.',
  'invoice.refunded': 'The payment went back to the wallet that paid.',
  'refund.confirmed': 'The refund is confirmed on-chain.',
  'refund.failed': 'The refund did not go through.',
};
