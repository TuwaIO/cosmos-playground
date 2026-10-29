import type {
  Invoice,
  InvoiceSettlement,
  InvoiceStatus,
  PaymentMethod,
  PaymentWebhookEvent,
  PaymentWebhookEventType,
  Refund,
  RefundStart,
  Subscription,
  SubscriptionInterval,
} from '@tuwaio/quasar-sdk';
import type { CheckoutQuote, CheckoutView } from '@tuwaio/quasar-sdk/checkout';

import { CURRENCY } from '@/lib/catalog';
import { textPdf } from '@/lib/demo/pdf';
import {
  applyPaymentEvent,
  attachInvoice,
  attachRefund,
  attachSubscription,
  createOrder,
  resetOrderBook,
} from '@/lib/orders';

// Demo mode (`SHOP_DEMO_MODE=true`): a small, in-memory imitation of the Quasar Payments API, so the shop runs, and can
// be filmed, without a Quasar node or keys. It issues invoices and subscriptions, answers the checkout of
// `PaymentCheckout` (through `api`), "receives" a Solana Pay QR payment a few seconds after the quote, and makes the
// `payments.v1` events Quasar would send, which go through the same `applyPaymentEvent` as verified webhooks. Nothing
// is sent on-chain: wallet payments are refused, and the transaction hashes are made up.

/** Why a demo call is refused, as the checkout shows it (the `code` of a Quasar refusal). */
export class DemoRefusal extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

type DemoInvoice = {
  invoice: Invoice;
  /** The quote locked in the checkout. */
  quote: CheckoutQuote | null;
  /** When the simulated payment is seen and confirmed (ms since the epoch). */
  seenAt: number | null;
  confirmAt: number | null;
};

type DemoRefund = Refund & { confirmAt: number };

type DemoState = {
  invoices: Map<string, DemoInvoice>;
  tokens: Map<string, string>;
  subscriptions: Map<string, Subscription>;
  refunds: Map<string, DemoRefund>;
  seq: number;
  seeded: boolean;
  ticker: ReturnType<typeof setInterval> | null;
};

const state: DemoState = ((globalThis as { __paymentsShopDemo?: DemoState }).__paymentsShopDemo ??= {
  invoices: new Map(),
  tokens: new Map(),
  subscriptions: new Map(),
  refunds: new Map(),
  seq: 0,
  seeded: false,
  ticker: null,
});

const SOLANA_DEVNET = 'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1';
const BASE_SEPOLIA = 'eip155:84532';
const SEPOLIA = 'eip155:11155111';

const method = (fields: Pick<PaymentMethod, 'id' | 'name' | 'symbol' | 'chainId' | 'assetId' | 'decimals'>) =>
  ({
    object: 'payment_method',
    recipient: '',
    minAmount: null,
    maxAmount: null,
    markup: null,
    discount: null,
    finality: 'default',
    gasless: 'off',
    // One method is "Popular" in the checkout: the first USDC network
    featured: fields.id === 'pm_demo_usdc_base_sepolia',
    ...fields,
  }) satisfies PaymentMethod;

/** The methods of the demo app: the testnet presets of the Quasar dev seed. */
export const DEMO_METHODS: PaymentMethod[] = [
  method({
    id: 'pm_demo_usdc_base_sepolia',
    name: 'USDC on Base Sepolia',
    symbol: 'USDC',
    chainId: BASE_SEPOLIA,
    assetId: `${BASE_SEPOLIA}/erc20:0x036CbD53842c5426634e7929541eC2318f3dCF7e`,
    decimals: 6,
  }),
  method({
    id: 'pm_demo_eth_base_sepolia',
    name: 'ETH on Base Sepolia',
    symbol: 'ETH',
    chainId: BASE_SEPOLIA,
    assetId: `${BASE_SEPOLIA}/slip44:60`,
    decimals: 18,
  }),
  method({
    id: 'pm_demo_usdc_sepolia',
    name: 'USDC on Sepolia',
    symbol: 'USDC',
    chainId: SEPOLIA,
    assetId: `${SEPOLIA}/erc20:0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`,
    decimals: 6,
  }),
  method({
    id: 'pm_demo_usdc_solana_devnet',
    name: 'USDC on Solana Devnet',
    symbol: 'USDC',
    chainId: SOLANA_DEVNET,
    assetId: `${SOLANA_DEVNET}/token:4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`,
    decimals: 6,
  }),
  method({
    id: 'pm_demo_sol_devnet',
    name: 'SOL on Solana Devnet',
    symbol: 'SOL',
    chainId: SOLANA_DEVNET,
    assetId: `${SOLANA_DEVNET}/slip44:501`,
    decimals: 9,
  }),
];

/** USD per token: fixed, round rates of the simulation. */
const RATES: Record<string, number> = { USDC: 1, ETH: 2500, SOL: 200 };

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function randomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

function base58(bytes: Uint8Array): string {
  let value = BigInt(`0x${Buffer.from(bytes).toString('hex') || '0'}`);
  let text = '';
  while (value > 0n) {
    text = BASE58[Number(value % 58n)] + text;
    value /= 58n;
  }
  return text.padStart(bytes.length === 32 ? 43 : 0, '1');
}

const hex = (length: number) => `0x${Buffer.from(randomBytes(length)).toString('hex')}`;
const nextId = (prefix: string) => `${prefix}_demo_${(++state.seq).toString(36).padStart(4, '0')}`;
const pad = (value: number) => String(value).padStart(4, '0');

/** A made-up transaction of a method's network: a hash for EVM, a signature for Solana. */
function fakeTx(chainId: string): { txHash: string; payer: string } {
  return chainId.startsWith('solana:')
    ? { txHash: base58(randomBytes(64)), payer: base58(randomBytes(32)) }
    : { txHash: hex(32), payer: hex(20) };
}

/** Base units of a USD amount in a method's token, at the fixed rate. */
function baseUnits(usd: string, found: PaymentMethod): string {
  const tokens = Number(usd) / (RATES[found.symbol] ?? 1);
  // 6 significant decimals are enough for the simulation; pad to the token's decimals
  const fixed = tokens.toFixed(Math.min(found.decimals, 6));
  const [whole, fraction = ''] = fixed.split('.');
  return BigInt(whole + fraction.padEnd(found.decimals, '0')).toString();
}

function findMethod(id: string | null): PaymentMethod {
  return DEMO_METHODS.find((item) => item.id === id) ?? DEMO_METHODS[0];
}

const INTERVAL_MS: Record<SubscriptionInterval, number> = {
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30 * 86_400_000,
  year: 365 * 86_400_000,
};

export type DemoLine = { name: string; description?: string; quantity?: string; unitPrice: string };

function issueInvoice(params: {
  lines: readonly DemoLine[];
  metadata: Record<string, unknown> | null;
  successUrl?: string | null;
  cancelUrl?: string | null;
  subscriptionId?: string;
  period?: number;
  at?: Date;
}): DemoInvoice {
  const at = params.at ?? new Date();
  const id = nextId('inv');
  const lineItems = params.lines.map((line) => {
    const quantity = line.quantity ?? '1';
    return {
      name: line.name,
      ...(line.description && { description: line.description }),
      quantity,
      unitPrice: line.unitPrice,
      taxCategory: 'O' as const,
      taxRate: '0',
      net: (Number(line.unitPrice) * Number(quantity)).toFixed(2),
    };
  });
  const total = lineItems.reduce((sum, line) => sum + Math.round(Number(line.net) * 100), 0);
  const token = `ct_demo_${Buffer.from(randomBytes(12)).toString('hex')}`;
  const invoice: Invoice = {
    id,
    object: 'invoice',
    number: `TEST-2026-${pad(state.invoices.size + 1)}`,
    status: 'open',
    environment: 'test',
    currency: CURRENCY,
    locale: 'en',
    issuedAt: at.toISOString(),
    supplyDate: at.toISOString().slice(0, 10),
    dueAt: new Date(at.getTime() + 60 * 60_000).toISOString(),
    seller: { tradingName: 'Cosmos Store' },
    buyer: null,
    expectedPayer: null,
    buyerReference: null,
    orderReference: null,
    lineItems,
    pricesIncludeTax: false,
    subtotal: (total / 100).toFixed(2),
    taxTotal: '0.00',
    rounding: '0.00',
    total: (total / 100).toFixed(2),
    taxBreakdown: [],
    notes: null,
    reverseCharge: null,
    taxExemptionReason: null,
    metadata: params.metadata,
    successUrl: params.successUrl ?? null,
    cancelUrl: params.cancelUrl ?? null,
    checkoutToken: token,
    payUrl: null,
    quote: null,
    settlement: null,
    reviewReason: null,
    aml: null,
    receiptNumber: null,
    eInvoiceSkipped: ['buyer.country'],
    refundedTotal: '0.00',
    replaces: null,
    replacedBy: null,
    subscriptionId: params.subscriptionId ?? null,
    period: params.period ?? null,
    createdAt: at.toISOString(),
    updatedAt: at.toISOString(),
  };
  const record: DemoInvoice = { invoice, quote: null, seenAt: null, confirmAt: null };
  state.invoices.set(id, record);
  state.tokens.set(token, id);
  return record;
}

/** Makes the event Quasar would send and applies it to the order book, as a verified webhook would be. */
function emit(
  type: PaymentWebhookEventType,
  data: PaymentWebhookEvent['data'],
  at: Date = new Date(),
  receivedAt?: Date,
) {
  applyPaymentEvent(
    {
      id: nextId('evt'),
      object: 'event',
      apiVersion: 'payments.v1',
      type,
      createdAt: at.toISOString(),
      sentAt: at.toISOString(),
      environment: 'test',
      data,
    },
    { source: 'demo', receivedAt: (receivedAt ?? at).toISOString() },
  );
}

function setStatus(record: DemoInvoice, status: InvoiceStatus, at: Date) {
  const payable = status === 'open' || status === 'processing' || status === 'underpaid';
  record.invoice = {
    ...record.invoice,
    status,
    checkoutToken: payable ? record.invoice.checkoutToken : null,
    updatedAt: at.toISOString(),
  };
}

/** Settles an invoice with a made-up payment of its method and sends `invoice.paid` (and the subscription's state). */
function settle(record: DemoInvoice, at: Date, methodId?: string) {
  const found = findMethod(methodId ?? record.quote?.methodId ?? null);
  const { txHash, payer } = fakeTx(found.chainId);
  const settlement: InvoiceSettlement = {
    methodId: found.id,
    chainId: found.chainId,
    txHash,
    blockRef: String(Math.floor(at.getTime() / 400)),
    amountPaid: record.quote?.cryptoAmountExpected ?? baseUnits(record.invoice.total, found),
    originWallet: record.quote?.payer?.split(':').pop() ?? payer,
    paidAt: at.toISOString(),
    overpaid: '0',
  };
  setStatus(record, 'paid', at);
  record.invoice = {
    ...record.invoice,
    settlement,
    receiptNumber: `TEST-R-${pad(state.seq)}`,
  };
  const subscription = record.invoice.subscriptionId
    ? state.subscriptions.get(record.invoice.subscriptionId)
    : undefined;
  if (subscription && subscription.status === 'incomplete') {
    subscription.status = 'active';
  }
  emit('invoice.paid', { invoice: record.invoice, settlement, ...(subscription && { subscription }) }, at);
}

/** Moves the simulated payments on: seen 4 s after the QR quote, confirmed 5 s later; refunds confirm after 3 s. */
function advance() {
  const now = Date.now();
  for (const record of state.invoices.values()) {
    if (record.seenAt !== null && now >= record.seenAt && record.invoice.status === 'open') {
      record.seenAt = null;
      setStatus(record, 'processing', new Date());
      emit('invoice.processing', { invoice: record.invoice });
    }
    if (record.confirmAt !== null && now >= record.confirmAt && record.invoice.status === 'processing') {
      record.confirmAt = null;
      settle(record, new Date());
    }
  }
  for (const refund of state.refunds.values()) {
    if (refund.status === 'submitted' && now >= refund.confirmAt) confirmRefund(refund, new Date());
  }
}

/** Starts the clock of the simulation, once per server process. */
function ensureTicker() {
  if (state.ticker) return;
  state.ticker = setInterval(() => {
    try {
      advance();
    } catch (error) {
      console.warn('[Demo] advance failed', error);
    }
  }, 1000);
  state.ticker.unref?.();
}

function confirmRefund(refund: DemoRefund, at: Date) {
  const record = state.invoices.get(refund.invoiceId);
  refund.status = 'confirmed';
  refund.confirmedAt = at.toISOString();
  refund.creditNoteNumber = `TEST-CN-${pad([...state.refunds.values()].filter((item) => item.creditNoteNumber).length + 1)}`;
  refund.txHash = fakeTx(refund.chainId).txHash;
  if (!record) return;
  const refunded = toCents(record.invoice.refundedTotal) + toCents(refund.amount);
  const whole = refunded >= toCents(record.invoice.total);
  setStatus(record, whole ? 'refunded' : 'partially_refunded', at);
  record.invoice = { ...record.invoice, refundedTotal: (refunded / 100).toFixed(2) };
  emit('refund.confirmed', { refund, invoice: record.invoice }, at);
  emit(whole ? 'invoice.refunded' : 'invoice.partially_refunded', { invoice: record.invoice, refund }, at);
}

// ---------------------------------------------------------------------------------------------------------------
// What the server actions of the shop call (the subset of `quasar.payments` the shop uses)

export function demoIssueInvoice(params: {
  lines: readonly DemoLine[];
  metadata: Record<string, unknown>;
  successUrl: string;
  cancelUrl: string;
}): Invoice {
  ensureDemo();
  const record = issueInvoice(params);
  emit('invoice.issued', { invoice: record.invoice });
  return record.invoice;
}

export function demoStartSubscription(params: {
  lines: readonly DemoLine[];
  interval: SubscriptionInterval;
  cycles: number;
  collection: 'send_invoice' | 'auto_charge';
  metadata: Record<string, unknown>;
  successUrl: string;
  cancelUrl: string;
}): { subscription: Subscription; invoice: Invoice } {
  ensureDemo();
  const subscription = makeSubscription({ ...params, at: new Date() });
  const record = issueInvoice({ ...params, subscriptionId: subscription.id, period: 1 });
  emit('subscription.created', { subscription, invoice: record.invoice });
  emit('invoice.issued', { invoice: record.invoice, subscription });
  return { subscription, invoice: record.invoice };
}

function makeSubscription(params: {
  lines: readonly DemoLine[];
  interval: SubscriptionInterval;
  cycles: number;
  collection: 'send_invoice' | 'auto_charge';
  metadata: Record<string, unknown>;
  at: Date;
}): Subscription {
  const subscription: Subscription = {
    id: nextId('sub'),
    object: 'subscription',
    status: 'incomplete',
    environment: 'test',
    buyer: null,
    expectedPayer: null,
    lineItems: params.lines.map((line) => ({
      name: line.name,
      description: line.description,
      unitPrice: line.unitPrice,
    })),
    currency: CURRENCY,
    interval: params.interval,
    intervalCount: 1,
    trialDays: 0,
    collection: params.collection,
    preferredMethodId: null,
    permission: null,
    graceDays: 0,
    currentPeriod: 1,
    currentPeriodStart: params.at.toISOString(),
    currentPeriodEnd: new Date(params.at.getTime() + INTERVAL_MS[params.interval]).toISOString(),
    cycles: params.cycles,
    endsAt: null,
    cancelAtPeriodEnd: false,
    canceledAt: null,
    cancellationReason: null,
    pausedAt: null,
    endedAt: null,
    metadata: params.metadata,
    createdAt: params.at.toISOString(),
  };
  state.subscriptions.set(subscription.id, subscription);
  return subscription;
}

/** The invoice a checkout token opens. */
export function demoInvoiceIdOfToken(token: string): string | undefined {
  return state.tokens.get(token);
}

export function demoInvoice(invoiceId: string): Invoice | undefined {
  ensureDemo();
  return state.invoices.get(invoiceId)?.invoice;
}

/** The made-up documents of an invoice: the invoice, and the receipt once paid. */
export function demoDocument(invoiceId: string, kind: 'invoice' | 'receipt' | 'credit-note'): Uint8Array | null {
  const record = state.invoices.get(invoiceId);
  if (!record) return null;
  const { invoice } = record;
  if (kind === 'receipt' && !invoice.receiptNumber) return null;
  const refund = [...state.refunds.values()].find((item) => item.invoiceId === invoiceId && item.creditNoteNumber);
  if (kind === 'credit-note' && !refund) return null;
  const title =
    kind === 'invoice'
      ? `Invoice ${invoice.number}`
      : kind === 'receipt'
        ? `Receipt ${invoice.receiptNumber}`
        : `Credit note ${refund?.creditNoteNumber}`;
  return textPdf(title, [
    'DEMO MODE - not a tax document. Quasar issues the real documents.',
    '',
    'Cosmos Store',
    `Issued ${invoice.issuedAt?.slice(0, 10) ?? ''}`,
    '',
    ...invoice.lineItems.map((line) => `${line.quantity} x ${line.name}   ${line.net} ${invoice.currency}`),
    '',
    `Total ${invoice.total} ${invoice.currency}`,
    ...(invoice.settlement ? [`Paid ${invoice.settlement.paidAt?.slice(0, 19).replace('T', ' ')} UTC`] : []),
    ...(refund ? [`Refunded ${refund.amount} ${refund.currency}`] : []),
  ]);
}

export type SubscriptionControl = 'pause' | 'resume' | 'cancel' | 'undo-cancel';

/** Pauses, resumes, cancels at the period end, or takes the cancellation back, with the events Quasar would send. */
export function demoControlSubscription(subscriptionId: string, action: SubscriptionControl) {
  ensureDemo();
  const subscription = state.subscriptions.get(subscriptionId);
  if (!subscription) throw new DemoRefusal('subscription_not_found', 'No such subscription');
  const now = new Date();
  let invoice: Invoice | null = null;
  if (action === 'pause') {
    subscription.status = 'paused';
    subscription.pausedAt = now.toISOString();
    for (const record of state.invoices.values()) {
      if (record.invoice.subscriptionId === subscriptionId && record.invoice.status === 'open') {
        setStatus(record, 'cancelled', now);
        emit('invoice.cancelled', { invoice: record.invoice, subscription });
      }
    }
    emit('subscription.paused', { subscription });
  } else if (action === 'resume') {
    subscription.status = 'incomplete';
    subscription.pausedAt = null;
    subscription.currentPeriod += 1;
    subscription.currentPeriodStart = now.toISOString();
    subscription.currentPeriodEnd = new Date(now.getTime() + INTERVAL_MS[subscription.interval]).toISOString();
    const record = issueInvoice({
      lines: subscription.lineItems,
      metadata: subscription.metadata,
      subscriptionId,
      period: subscription.currentPeriod,
    });
    invoice = record.invoice;
    emit('subscription.resumed', { subscription, invoice });
    emit('invoice.issued', { invoice, subscription });
  } else if (action === 'cancel') {
    subscription.cancelAtPeriodEnd = true;
    emit('subscription.cancel_scheduled', { subscription });
  } else {
    subscription.cancelAtPeriodEnd = false;
    emit('subscription.cancel_unscheduled', { subscription });
  }
  return { subscription, invoice };
}

/** What a demo refund asks for: the `RefundParams` of `@tuwaio/quasar-sdk`. */
export type DemoRefundParams = { amount?: string; mode?: 'fiat_value' | 'exact_received'; reason?: string };

/**
 * Refunds a paid invoice: everything left, or `amount` of the invoice currency. The merchant's transfer is simulated
 * (no wallet is asked): the refund is `submitted` at once and confirmed, with its credit note and webhooks, 3 s later.
 * Returns the refund and the transfer a wallet would have sent, as `quasar.payments.refund` does.
 */
export function demoRefund(invoiceId: string, params: DemoRefundParams = {}): RefundStart {
  ensureDemo();
  ensureTicker();
  const refund = startRefund(invoiceId, params, Date.now() + 3000);
  const found = findMethod(state.invoices.get(invoiceId)?.invoice.settlement?.methodId ?? null);
  return {
    refund,
    instructions: {
      chainId: refund.chainId,
      assetId: refund.assetId,
      to: refund.to,
      amount: refund.cryptoAmount,
      decimals: found.decimals,
      symbol: found.symbol,
    },
  };
}

/** A refund of demo mode, as `quasar.payments.getRefund` returns it. */
export function demoReadRefund(refundId: string): Refund {
  const refund = state.refunds.get(refundId);
  if (!refund) throw new DemoRefusal('refund_not_found', 'No such refund');
  // The refund as Quasar returns it: without the simulation's own `confirmAt`
  return Object.fromEntries(Object.entries(refund).filter(([key]) => key !== 'confirmAt')) as Refund;
}

const toCents = (amount: string) => Math.round(Number(amount) * 100);

function startRefund(invoiceId: string, params: DemoRefundParams, confirmAt: number): DemoRefund {
  const record = state.invoices.get(invoiceId);
  if (!record || (record.invoice.status !== 'paid' && record.invoice.status !== 'partially_refunded')) {
    throw new DemoRefusal('invoice_not_refundable', 'Only a paid invoice can be refunded');
  }
  const left = toCents(record.invoice.total) - toCents(record.invoice.refundedTotal);
  const asked = params.mode !== 'exact_received' && params.amount ? toCents(params.amount) : left;
  if (!Number.isFinite(asked) || asked <= 0 || asked > left) {
    throw new DemoRefusal('amount_too_large', `Refund at most ${(left / 100).toFixed(2)} ${record.invoice.currency}`);
  }
  const settlement = record.invoice.settlement;
  const found = findMethod(settlement?.methodId ?? null);
  const amount = (asked / 100).toFixed(2);
  const refund: DemoRefund = {
    id: nextId('re'),
    object: 'refund',
    invoiceId,
    status: 'submitted',
    amount,
    currency: record.invoice.currency,
    mode: params.mode ?? 'fiat_value',
    cryptoAmount: baseUnits(amount, found),
    assetId: found.assetId ?? '',
    chainId: found.chainId,
    to: settlement?.originWallet ?? '',
    txHash: null,
    from: null,
    reason: params.reason || 'Refunded from the demo shop',
    failureReason: null,
    creditNoteNumber: null,
    createdAt: new Date().toISOString(),
    confirmedAt: null,
    confirmAt,
  };
  state.refunds.set(refund.id, refund);
  return refund;
}

// ---------------------------------------------------------------------------------------------------------------
// The checkout API of an invoice (`CheckoutApi`), for `PaymentCheckout` in demo mode

function recordOf(token: string): DemoInvoice {
  ensureDemo();
  const id = state.tokens.get(token);
  const record = id ? state.invoices.get(id) : undefined;
  if (!record) throw new DemoRefusal('checkout_not_found', 'This checkout link does not exist (demo mode)');
  return record;
}

export function demoCheckoutView(token: string): CheckoutView {
  const record = recordOf(token);
  const { invoice } = record;
  const subscription = invoice.subscriptionId ? state.subscriptions.get(invoice.subscriptionId) : undefined;
  const totalMinor = String(Math.round(Number(invoice.total) * 100));
  return {
    object: 'checkout',
    merchant: {
      name: 'Cosmos Store',
      website: null,
      supportEmail: null,
      // The store mark (`/icon.svg`), read through `url('logo')` of the demo checkout API
      logo: true,
      seller: null,
      links: { terms: null, refundPolicy: null, privacy: null },
      fundingUrl: null,
    },
    theme: { mode: 'system', accentColor: null },
    invoice: {
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      environment: 'test',
      currency: invoice.currency,
      total: invoice.total,
      totalMinor,
      lineItems: invoice.lineItems.map((line) => ({
        name: line.name,
        ...(line.description && { description: line.description }),
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxCategory: line.taxCategory,
        taxRate: line.taxRate,
        netMinor: String(Math.round(Number(line.net) * 100)),
      })),
      locale: invoice.locale,
      dueAt: invoice.dueAt,
      successUrl: invoice.successUrl,
      cancelUrl: invoice.cancelUrl,
      amountPaid: invoice.settlement?.amountPaid ?? null,
      review: null,
      refundedTotalMinor: String(Math.round(Number(invoice.refundedTotal) * 100)),
      replacedBy: null,
      subscription:
        subscription && invoice.period !== null
          ? {
              status: subscription.status,
              interval: subscription.interval,
              intervalCount: subscription.intervalCount,
              period: invoice.period,
              periodStart: subscription.currentPeriodStart ?? invoice.createdAt,
              periodEnd: subscription.currentPeriodEnd ?? invoice.createdAt,
              cycles: subscription.cycles,
              endsAt: subscription.endsAt,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            }
          : null,
    },
    buyer: { collect: 'off', required: false, companyInvoice: false },
    consent: null,
    amlScreening: false,
    methods: DEMO_METHODS.map((item) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      chainId: item.chainId,
      assetId: item.assetId,
      decimals: item.decimals,
      gasless: 'off',
      featured: item.featured,
      markupBps: 0,
      discountBps: 0,
    })),
    quoteTtlSeconds: 600,
    quote: record.quote,
    autoCharge: null,
  };
}

/**
 * Locks a quote. A QR quote (no payer) of a Solana method is "paid" by the simulation a few seconds later; a wallet is
 * never asked to send anything in demo mode, so a quote for a connected wallet is refused with a note.
 */
export function demoCheckoutQuote(token: string, body: { methodId: string; payer?: string }): CheckoutQuote {
  const record = recordOf(token);
  if (record.invoice.status !== 'open') throw new DemoRefusal('invoice_not_open', 'This invoice is not open');
  if (body.payer) {
    throw new DemoRefusal(
      'demo_wallet_payment',
      'Demo mode takes no wallet payments: choose a Solana method and its QR code, and the demo pays it in a few seconds.',
    );
  }
  const found = findMethod(body.methodId);
  if (!found.chainId.startsWith('solana:')) {
    throw new DemoRefusal('demo_wallet_payment', 'Demo mode pays Solana methods by QR code only.');
  }
  const amount = baseUnits(record.invoice.total, found);
  const reference = base58(randomBytes(32));
  const recipient = base58(randomBytes(32));
  const decimal = (Number(amount) / 10 ** found.decimals).toString();
  const mint = found.assetId?.split('/token:')[1];
  const now = Date.now();
  const quote: CheckoutQuote = {
    object: 'checkout_quote',
    methodId: found.id,
    payer: null,
    cryptoAmountExpected: amount,
    amountToSend: amount,
    transferFee: null,
    decimals: found.decimals,
    symbol: found.symbol,
    lockedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 600_000).toISOString(),
    reference,
    rates: null,
    markupBps: 0,
    discountBps: 0,
    instructions: {
      family: 'solana',
      chainId: found.chainId,
      to: recipient,
      token: mint ?? 'native',
      amount,
      decimals: found.decimals,
      symbol: found.symbol,
      reference,
      solanaPayUrl: `solana:${recipient}?amount=${decimal}${mint ? `&spl-token=${mint}` : ''}&reference=${reference}&label=Cosmos%20Store%20(demo)`,
    },
    gasless: null,
  };
  record.quote = quote;
  record.seenAt = now + 4000;
  record.confirmAt = now + 9000;
  ensureTicker();
  return quote;
}

export function demoCheckoutLocale(token: string, locale: Invoice['locale']) {
  const record = recordOf(token);
  record.invoice = { ...record.invoice, locale };
}

// ---------------------------------------------------------------------------------------------------------------
// Sample orders, so a fresh demo shows a store that has been selling for a while

/** Fixed IDs of the sample orders. */
export const DEMO_ORDER_IDS = {
  paid: '7c1f3a52-94de-4b0a-8f5e-2d6b1c9e4a70',
  subscription: 'b84e2c19-0f6a-4d37-9c51-6e2f8a3d7b14',
  refunded: '3e9d7f60-2a1b-48c5-b7e4-91f0c6d2a853',
  expired: 'e25a8b4c-7d3f-4e19-a6c0-5b8f2d1e9c37',
  open: 'a6f04d2e-1b7c-4985-8e3a-c2d9f5b70e16',
  cap: '5d2c8e17-3f4a-4b69-9e01-7a6c4f2b8d35',
  stickers: '91b6e4d0-8c2f-4a37-b5e8-2f0d7c3a6e19',
  mugs: 'c3f7a9e2-6b14-4d58-8a2c-e9b0f1d4c763',
} as const;

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000);

type SeedLine = { productId: string; name: string; quantity: number; unitPrice: string };

/**
 * A product order of the sample: the order, its invoice and the events of its life. `paid` settles it with the method
 * (seen and confirmed a few minutes later), `expired` lets it lapse, `open` leaves it waiting.
 */
function seedOrder(params: {
  id: string;
  lines: SeedLine[];
  minutesAgo: number;
  outcome: { paid: string } | 'expired' | 'open';
}): DemoInvoice {
  const { id, lines, minutesAgo, outcome } = params;
  const price = (lines.reduce((sum, line) => sum + toCents(line.unitPrice) * line.quantity, 0) / 100).toFixed(2);
  createOrder({
    id,
    kind: 'product',
    title: lines.length === 1 ? lines[0].name : `${lines[0].name} + ${lines.length - 1} more`,
    lines,
    price,
    currency: CURRENCY,
    createdAt: ago(minutesAgo).toISOString(),
  });
  const record = issueInvoice({
    lines: lines.map((line) => ({ name: line.name, quantity: String(line.quantity), unitPrice: line.unitPrice })),
    metadata: { orderId: id },
    at: ago(minutesAgo),
    successUrl: null,
    cancelUrl: null,
  });
  const open = outcome === 'open';
  attachInvoice(id, record.invoice, { checkoutToken: open ? record.invoice.checkoutToken : null, payUrl: null });
  emit('invoice.issued', { invoice: record.invoice }, ago(minutesAgo));
  if (outcome === 'expired') {
    setStatus(record, 'expired', ago(minutesAgo - 60));
    emit('invoice.expired', { invoice: record.invoice }, ago(minutesAgo - 60));
  } else if (!open) {
    const found = findMethod(outcome.paid);
    setStatus(record, 'processing', ago(minutesAgo - 2));
    emit('invoice.processing', { invoice: record.invoice }, ago(minutesAgo - 2));
    settle(record, ago(minutesAgo - 2.5), found.id);
  }
  return record;
}

function seed() {
  const line = (productId: string, name: string, quantity: number, unitPrice: string): SeedLine => ({
    productId,
    name,
    quantity,
    unitPrice,
  });

  // The weekly Pro plan in its second period, paid with USDC on Solana Devnet
  createOrder({
    id: DEMO_ORDER_IDS.subscription,
    kind: 'subscription',
    title: 'Pro plan, weekly',
    lines: [{ productId: 'pro', name: 'Pro plan', quantity: 1, unitPrice: '5.00' }],
    price: '5.00',
    currency: CURRENCY,
    createdAt: ago(8 * 1440).toISOString(),
  });
  const plan = [{ name: 'Pro plan', description: 'Billed weekly', unitPrice: '5.00' }];
  const subscription = makeSubscription({
    lines: plan,
    interval: 'week',
    cycles: 12,
    collection: 'send_invoice',
    metadata: { orderId: DEMO_ORDER_IDS.subscription },
    at: ago(8 * 1440),
  });
  attachSubscription(DEMO_ORDER_IDS.subscription, subscription);
  const first = issueInvoice({
    lines: plan,
    metadata: { orderId: DEMO_ORDER_IDS.subscription },
    subscriptionId: subscription.id,
    period: 1,
    at: ago(8 * 1440),
  });
  emit('subscription.created', { subscription, invoice: first.invoice }, ago(8 * 1440));
  emit('invoice.issued', { invoice: first.invoice, subscription }, ago(8 * 1440));
  settle(first, ago(8 * 1440 - 3), 'pm_demo_usdc_solana_devnet');
  subscription.currentPeriod = 2;
  subscription.currentPeriodStart = ago(1440).toISOString();
  subscription.currentPeriodEnd = new Date(ago(1440).getTime() + INTERVAL_MS.week).toISOString();
  const second = issueInvoice({
    lines: plan,
    metadata: { orderId: DEMO_ORDER_IDS.subscription },
    subscriptionId: subscription.id,
    period: 2,
    at: ago(1440),
  });
  emit('subscription.renewed', { subscription, invoice: second.invoice }, ago(1440));
  emit('invoice.issued', { invoice: second.invoice, subscription }, ago(1440));
  settle(second, ago(1440 - 12), 'pm_demo_usdc_solana_devnet');

  // Three sticker packs, two days ago, USDC on Base Sepolia
  seedOrder({
    id: DEMO_ORDER_IDS.stickers,
    lines: [line('stickers', 'Sticker pack', 3, '0.50')],
    minutesAgo: 2 * 1440 + 130,
    outcome: { paid: 'pm_demo_usdc_base_sepolia' },
  });

  // Two mugs, yesterday, USDC on Sepolia
  seedOrder({
    id: DEMO_ORDER_IDS.mugs,
    lines: [line('mug', 'Orbit mug', 2, '1.20')],
    minutesAgo: 1440 + 260,
    outcome: { paid: 'pm_demo_usdc_sepolia' },
  });

  // A notebook that was never paid
  seedOrder({
    id: DEMO_ORDER_IDS.expired,
    lines: [line('notebook', 'Dot-grid notebook', 1, '0.80')],
    minutesAgo: 300,
    outcome: 'expired',
  });

  // A poster paid with SOL, then refunded in full
  const poster = seedOrder({
    id: DEMO_ORDER_IDS.refunded,
    lines: [line('poster', 'Quasar poster', 1, '1.00')],
    minutesAgo: 180,
    outcome: { paid: 'pm_demo_sol_devnet' },
  });
  const refund = startRefund(poster.invoice.id, { reason: 'Arrived with a torn corner' }, 0);
  attachRefund(DEMO_ORDER_IDS.refunded, refund);
  confirmRefund(refund, ago(95));

  // A hoodie and a notebook, USDC on Solana Devnet
  seedOrder({
    id: DEMO_ORDER_IDS.paid,
    lines: [line('hoodie', 'Cosmos hoodie', 1, '2.00'), line('notebook', 'Dot-grid notebook', 1, '0.80')],
    minutesAgo: 70,
    outcome: { paid: 'pm_demo_usdc_solana_devnet' },
  });

  // A cap paid with ETH on Base Sepolia
  seedOrder({
    id: DEMO_ORDER_IDS.cap,
    lines: [line('cap', 'Satellite cap', 1, '1.50')],
    minutesAgo: 25,
    outcome: { paid: 'pm_demo_eth_base_sepolia' },
  });

  // A cart waiting to be paid: two sticker packs and a mug
  seedOrder({
    id: DEMO_ORDER_IDS.open,
    lines: [line('stickers', 'Sticker pack', 2, '0.50'), line('mug', 'Orbit mug', 1, '1.20')],
    minutesAgo: 2,
    outcome: 'open',
  });
}

/** Seeds the sample orders once per server process and starts the clock of the simulation. */
export function ensureDemo() {
  ensureTicker();
  if (state.seeded) return;
  state.seeded = true;
  try {
    seed();
  } catch (error) {
    console.warn('[Demo] seeding failed', error);
  }
}

/** Forgets every order, invoice, refund and event, and seeds the sample orders again: a clean store for a take. */
export function resetDemo() {
  state.invoices.clear();
  state.tokens.clear();
  state.subscriptions.clear();
  state.refunds.clear();
  state.seq = 0;
  state.seeded = false;
  resetOrderBook();
  ensureDemo();
}
