'use client';

import {
  ArrowDownTrayIcon,
  ArrowUturnLeftIcon,
  BoltIcon,
  CheckIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { formatTokenAmount, RefundButton, shortAddress } from '@tuwaio/nova-payments';
import { createRefundStore, type RefundStore } from '@tuwaio/quasar-sdk/checkout';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { controlSubscription, readRefund, requestRefund, simulateRefund, submitRefund } from '@/app/merchantActions';
import { EventTypeChip } from '@/components/events/EventFeed';
import { MethodLabel } from '@/components/orders/MethodLabel';
import { useShop } from '@/components/shell/ShopProvider';
import { Button, buttonClass, ButtonLink, Spinner } from '@/components/ui/Button';
import { Card, DetailCard, KeyValueRow } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { StatusBadge, type StatusTone } from '@/components/ui/StatusBadge';
import { Time } from '@/components/ui/Time';
import { cartStore } from '@/lib/cartStore';
import type { SubscriptionControl } from '@/lib/demo/engine';
import { money } from '@/lib/format';
import { explorerTxUrl, type ShopMethod } from '@/lib/methods';
import type { Order, OrderInvoice } from '@/lib/orderTypes';
import { INVOICE_STATUS, PAYABLE, shortOrderId, SUBSCRIPTION_STATUS } from '@/lib/status';
import { unwrap } from '@/lib/unwrap';

type Hero = { title: string; tone: StatusTone; icon: ReactNode };

/** The headline of the order: paid, waiting, underpaid, expired… */
function heroOf(order: Order): Hero {
  const status = order.invoices[0]?.status;
  if (order.kind === 'subscription' && order.subscription?.status === 'active' && status === 'paid') {
    return { title: 'Subscription active', tone: 'success', icon: <CheckIcon /> };
  }
  switch (status) {
    case 'paid':
      return { title: 'Order paid', tone: 'success', icon: <CheckIcon /> };
    case 'processing':
      return { title: 'Waiting for confirmation', tone: 'pending', icon: <ClockIcon /> };
    case 'underpaid':
      return { title: 'Underpaid', tone: 'error', icon: <ExclamationTriangleIcon /> };
    case 'held':
      return { title: 'Payment held for review', tone: 'pending', icon: <ClockIcon /> };
    case 'refunded':
    case 'partially_refunded':
      return {
        title: status === 'refunded' ? 'Refunded' : 'Partly refunded',
        tone: 'neutral',
        icon: <ArrowUturnLeftIcon />,
      };
    case 'expired':
      return { title: 'Expired', tone: 'error', icon: <XMarkIcon /> };
    case 'cancelled':
      return { title: 'Cancelled', tone: 'error', icon: <XMarkIcon /> };
    default:
      return { title: 'Waiting for payment', tone: 'pending', icon: <ClockIcon /> };
  }
}

const HERO_ICON: Record<StatusTone, string> = {
  success: 'bg-[var(--tuwa-success-bg)] text-[var(--shop-success-text)]',
  pending: 'bg-[var(--tuwa-pending-bg)] text-[var(--shop-pending-text)]',
  error: 'bg-[var(--tuwa-error-bg)] text-[var(--shop-error-text)]',
  neutral: 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-primary)]',
};

function HeroBlock({ order }: { order: Order }) {
  const hero = heroOf(order);
  const invoice = order.invoices[0];
  return (
    <Card className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
      <motion.span
        key={hero.title}
        aria-hidden
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-full [&>svg]:h-7 [&>svg]:w-7',
          HERO_ICON[hero.tone],
        )}
      >
        {hero.icon}
      </motion.span>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--tuwa-text-secondary)] sm:text-xs">
          <Link href="/orders" className="hover:underline">
            Orders
          </Link>{' '}
          / <span className="font-mono">{shortOrderId(order.id)}</span>
        </p>
        <h1
          aria-live="polite"
          className="m-0 truncate text-2xl font-black tracking-tight sm:text-3xl"
          title={hero.title}
        >
          {hero.title}
        </h1>
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-[var(--tuwa-text-secondary)]">
          <span className="text-[var(--tuwa-text-primary)]">{order.title}</span>
          <span aria-hidden>·</span>
          <span className="font-mono tabular-nums">
            <Time iso={order.createdAt} format="date" />
          </span>
          <span aria-hidden>·</span>
          <span className="font-mono font-semibold tabular-nums text-[var(--tuwa-text-primary)]">
            {money(invoice?.total ?? order.price, order.currency)}
          </span>
        </p>
      </div>
      {order.fulfilledAt && (
        <StatusBadge
          label={
            <>
              Fulfilled <Time iso={order.fulfilledAt} format="clock" />
            </>
          }
          tone="success"
          icon={<CheckIcon className="h-3 w-3" />}
        />
      )}
    </Card>
  );
}

/** The webhook events of the order, newest last. */
function EventsCard({ order }: { order: Order }) {
  return (
    <DetailCard title="Timeline" icon={<BoltIcon />} description="The webhooks Quasar sent about this order">
      {order.events.length === 0 ? (
        <p className="m-0 text-[13.5px] text-[var(--tuwa-text-secondary)]">
          No webhook has arrived for this order yet.
        </p>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-0 p-0">
          {order.events.map((event, index) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative flex items-center gap-3 py-2 pl-6"
            >
              <span
                aria-hidden
                className="absolute top-1/2 left-[5px] h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-[var(--tuwa-text-primary)] bg-[var(--tuwa-bg-primary)]"
              />
              {index < order.events.length - 1 && (
                <span aria-hidden className="absolute top-1/2 left-[9px] h-full w-px bg-[var(--tuwa-border-primary)]" />
              )}
              <time
                dateTime={event.receivedAt}
                className="w-[92px] shrink-0 font-mono text-[12px] tabular-nums text-[var(--tuwa-text-secondary)]"
              >
                <Time iso={event.receivedAt} format="clock" />
              </time>
              <EventTypeChip type={event.type} className="min-w-0" />
            </motion.li>
          ))}
        </ol>
      )}
    </DetailCard>
  );
}

/** The invoice and the payment that settled it: method, amount, transaction, payer. */
function PaymentCard({
  order,
  methods,
  onPay,
}: {
  order: Order;
  methods: ShopMethod[];
  onPay: (invoice: OrderInvoice) => void;
}) {
  const { mode } = useShop();
  const invoice = order.invoices[0];
  const payment = order.payment;
  const method = methods.find((item) => item.id === payment?.methodId);
  const explorer = payment && !mode.demo ? explorerTxUrl(payment.chainId, payment.txHash) : null;
  return (
    <DetailCard
      title="Payment"
      icon={<CreditCardIcon />}
      action={
        invoice?.checkoutToken && PAYABLE.includes(invoice.status) ? (
          <Button size="sm" onClick={() => onPay(invoice)}>
            Pay now
          </Button>
        ) : undefined
      }
    >
      <dl className="m-0 flex flex-col gap-3">
        <KeyValueRow label="Invoice">
          <span className="font-mono tabular-nums">{invoice?.number ?? '—'}</span>
        </KeyValueRow>
        <KeyValueRow label="Status">{invoice ? <StatusBadge {...INVOICE_STATUS[invoice.status]} /> : '—'}</KeyValueRow>
        <KeyValueRow label="Total">
          <span className="font-mono tabular-nums">{money(invoice?.total ?? order.price, order.currency)}</span>
        </KeyValueRow>
        {payment ? (
          <>
            <KeyValueRow label="Method">
              {method ? <MethodLabel method={method} /> : (payment.chainId ?? '—')}
            </KeyValueRow>
            {payment.amountPaid && method && (
              <KeyValueRow label="Paid">
                <span className="font-mono tabular-nums">
                  {formatTokenAmount(payment.amountPaid, method.decimals, 'en')} {method.symbol}
                </span>
              </KeyValueRow>
            )}
            <KeyValueRow label="Transaction">
              {explorer ? (
                <a href={explorer} target="_blank" rel="noreferrer" className="font-mono underline hover:no-underline">
                  {shortAddress(payment.txHash, 8, 6)}
                </a>
              ) : (
                <span className="font-mono">
                  {shortAddress(payment.txHash, 8, 6)}
                  {mode.demo && (
                    <span className="ml-1.5 font-sans text-[12px] text-[var(--tuwa-text-secondary)]">(simulated)</span>
                  )}
                </span>
              )}
            </KeyValueRow>
            {payment.payer && (
              <KeyValueRow label="Payer">
                <span className="font-mono">{shortAddress(payment.payer)}</span>
              </KeyValueRow>
            )}
            {payment.paidAt && (
              <KeyValueRow label="Paid at">
                <span className="font-mono tabular-nums">
                  <Time iso={payment.paidAt} format="date" />
                </span>
              </KeyValueRow>
            )}
          </>
        ) : (
          <KeyValueRow label="Payment">
            <span className="text-[var(--tuwa-text-secondary)]">Not received yet</span>
          </KeyValueRow>
        )}
      </dl>
    </DetailCard>
  );
}

function DocumentRow({
  label,
  detail,
  href,
  reason,
}: {
  label: string;
  detail?: string;
  href: string | null;
  reason: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-[var(--tuwa-border-secondary)] pb-3 last:border-b-0 last:pb-0">
      <div className="min-w-0">
        <p className="m-0 text-[13.5px] font-semibold">{label}</p>
        <p className="m-0 text-[12.5px] text-[var(--tuwa-text-secondary)]">{href ? detail : reason}</p>
      </div>
      {href ? (
        <a href={href} download className={buttonClass('secondary', 'sm')} aria-label={`Download ${label}`}>
          <ArrowDownTrayIcon className="h-4 w-4" aria-hidden /> Download
        </a>
      ) : (
        <button type="button" disabled className={buttonClass('secondary', 'sm')} aria-label={`${label}: ${reason}`}>
          <ArrowDownTrayIcon className="h-4 w-4" aria-hidden /> Download
        </button>
      )}
    </li>
  );
}

/** The documents Quasar issued for the order, downloaded through the shop's server (the secret key stays there). */
function DocumentsCard({ order, eInvoiceIssued }: { order: Order; eInvoiceIssued: boolean }) {
  const { mode } = useShop();
  const invoice = order.invoices[0];
  const base = `/api/orders/${order.id}/documents`;
  const query = invoice ? `?invoice=${invoice.id}` : '';
  const notes = order.refunds.filter((refund) => refund.creditNoteNumber);
  return (
    <DetailCard title="Documents" icon={<DocumentTextIcon />}>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        <DocumentRow
          label="Invoice (PDF)"
          detail={invoice?.number ?? undefined}
          href={invoice?.number ? `${base}/invoice${query}` : null}
          reason="Issued with the invoice"
        />
        <DocumentRow
          label="Receipt (PDF)"
          detail={invoice?.receiptNumber ?? undefined}
          href={invoice?.receiptNumber ? `${base}/receipt${query}` : null}
          reason="Issued when the invoice is paid"
        />
        <DocumentRow
          label="E-invoice (XML)"
          detail="UBL, EN 16931"
          href={eInvoiceIssued ? `${base}/invoice.xml${query}` : null}
          reason={
            mode.demo ? 'Not issued in demo mode' : 'Issued when e-invoices are on and the buyer details allow it'
          }
        />
        {notes.length === 0 ? (
          <DocumentRow label="Credit note (PDF)" href={null} reason="Issued after a refund" />
        ) : (
          notes.map((refund) => (
            <DocumentRow
              key={refund.id}
              label="Credit note (PDF)"
              detail={refund.creditNoteNumber ?? undefined}
              href={`${base}/credit-note${query}${query ? '&' : '?'}ref=${encodeURIComponent(refund.creditNoteNumber ?? '')}`}
              reason="Issued after a refund"
            />
          ))
        )}
      </ul>
    </DetailCard>
  );
}

/** The plan: its state, period and invoices, and the merchant's controls in merchant mode. */
function SubscriptionCard({ order, onPay }: { order: Order; onPay: (invoice: OrderInvoice) => void }) {
  const { mode, refresh } = useShop();
  const [busy, setBusy] = useState<SubscriptionControl | null>(null);
  const [error, setError] = useState<string | null>(null);
  const subscription = order.subscription;
  if (!subscription) return null;
  const status = SUBSCRIPTION_STATUS[subscription.status];

  const control = async (action: SubscriptionControl) => {
    setBusy(action);
    setError(null);
    const result = await controlSubscription(order.id, action);
    if (!result.ok) setError(result.message);
    await refresh();
    setBusy(null);
  };
  const controlButton = (action: SubscriptionControl, label: string) => (
    <Button variant="secondary" size="sm" disabled={busy !== null} onClick={() => void control(action)}>
      {busy === action && <Spinner />}
      {label}
    </Button>
  );
  const running = ['active', 'past_due', 'incomplete'].includes(subscription.status);

  return (
    <DetailCard title="Subscription" icon={<ClockIcon />} action={<StatusBadge {...status} />}>
      <dl className="m-0 flex flex-col gap-3">
        <KeyValueRow label="Period">
          <span className="font-mono tabular-nums">
            {subscription.currentPeriod}
            {subscription.cycles ? ` of ${subscription.cycles}` : ''}
          </span>
        </KeyValueRow>
        <KeyValueRow label={subscription.cancelAtPeriodEnd ? 'Ends' : 'Next invoice'}>
          <span className="font-mono tabular-nums">
            {subscription.currentPeriodEnd ? <Time iso={subscription.currentPeriodEnd} format="date" /> : '—'}
          </span>
        </KeyValueRow>
        <KeyValueRow label="Automatic payments">{subscription.autoCharge ? 'On' : 'Off'}</KeyValueRow>
      </dl>
      <div className="overflow-x-auto rounded-shop border border-[var(--tuwa-border-primary)]">
        <table className="w-full border-collapse text-[13px]">
          <caption className="sr-only">Invoices of the periods</caption>
          <thead>
            <tr className="bg-[var(--tuwa-bg-muted)] text-left text-[10.5px] font-bold uppercase tracking-widest text-[var(--shop-text-label)]">
              <th scope="col" className="px-3 py-2">
                Period
              </th>
              <th scope="col" className="px-3 py-2">
                Invoice
              </th>
              <th scope="col" className="px-3 py-2">
                Status
              </th>
              <th scope="col" className="hidden px-3 py-2 text-right sm:table-cell">
                Total
              </th>
              <th scope="col" className="px-3 py-2">
                <span className="sr-only">Pay</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {order.invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-[var(--tuwa-border-secondary)]">
                <td className="px-3 py-2 font-mono tabular-nums">{invoice.period ?? '—'}</td>
                <td className="px-3 py-2 font-mono tabular-nums">{invoice.number ?? '—'}</td>
                <td className="px-3 py-2">
                  <StatusBadge {...INVOICE_STATUS[invoice.status]} />
                </td>
                <td className="hidden px-3 py-2 text-right font-mono tabular-nums sm:table-cell">
                  {money(invoice.total, invoice.currency)}
                </td>
                <td className="px-3 py-2 text-right">
                  {invoice.checkoutToken && PAYABLE.includes(invoice.status) && (
                    <Button size="sm" onClick={() => onPay(invoice)}>
                      Pay
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mode.merchant && (
        <div className="flex flex-col gap-3 border-t border-[var(--tuwa-border-secondary)] pt-4">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--tuwa-text-secondary)]">
            Merchant controls
          </p>
          <div className="flex flex-wrap gap-2">
            {running && controlButton('pause', 'Pause')}
            {subscription.status === 'paused' && controlButton('resume', 'Resume')}
            {running && !subscription.cancelAtPeriodEnd && controlButton('cancel', 'Cancel at period end')}
            {subscription.cancelAtPeriodEnd && controlButton('undo-cancel', 'Undo cancel')}
          </div>
          {error && <Notice tone="error">{error}</Notice>}
        </div>
      )}
    </DetailCard>
  );
}

/** One refund store per invoice: it keeps the refund while the window is closed. */
function useRefundStore(invoiceId: string | undefined): RefundStore | null {
  return useMemo(
    () =>
      invoiceId
        ? createRefundStore({
            request: async (id, params) => unwrap(await requestRefund(id, params)),
            submit: async (id, params) => unwrap(await submitRefund(id, params)),
            get: async (id) => unwrap(await readRefund(id)),
          })
        : null,
    [invoiceId],
  );
}

/** Merchant mode: refund the paid invoice from the merchant's wallet (Nova Payments), and the refunds so far. */
function RefundCard({ order }: { order: Order }) {
  const { mode, refresh } = useShop();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paid = order.invoices.find((invoice) => invoice.status === 'paid' || invoice.status === 'partially_refunded');
  const store = useRefundStore(paid?.id);
  const refundable = paid ? (Number(paid.total) - Number(paid.refundedTotal)).toFixed(2) : '0.00';

  const simulate = async () => {
    setBusy(true);
    setError(null);
    const result = await simulateRefund(order.id);
    if (!result.ok) setError(result.message);
    await refresh();
    setBusy(false);
  };

  return (
    <DetailCard
      title="Refund"
      icon={<ArrowUturnLeftIcon />}
      description={
        mode.demo
          ? 'Demo mode refunds in full and sends the webhooks Quasar would send.'
          : 'Sent from your connected wallet to the payer; Quasar confirms it and issues the credit note.'
      }
    >
      {order.refunds.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {order.refunds.map((refund) => (
            <li key={refund.id} className="flex items-center justify-between gap-3 text-[13.5px]">
              <span className="font-mono tabular-nums">{money(refund.amount, refund.currency)}</span>
              <StatusBadge
                label={refund.status}
                tone={refund.status === 'confirmed' ? 'success' : refund.status === 'failed' ? 'error' : 'pending'}
              />
            </li>
          ))}
        </ul>
      )}
      {!paid ? (
        <p className="m-0 text-[13.5px] text-[var(--tuwa-text-secondary)]">
          {order.refunds.some((refund) => refund.status === 'confirmed')
            ? 'Refunded: nothing is left to refund.'
            : 'A refund is possible once the invoice is paid.'}
        </p>
      ) : mode.demo ? (
        <Button variant="secondary" disabled={busy} onClick={() => void simulate()}>
          {busy && <Spinner />}
          Simulate refund of {money(refundable, paid.currency)}
        </Button>
      ) : (
        store && (
          <RefundButton
            store={store}
            invoiceId={paid.id}
            invoice={paid.number ?? undefined}
            currency={paid.currency}
            refundable={money(refundable, paid.currency)}
            onRefunded={() => void refresh()}
            className={buttonClass('secondary', 'md')}
          />
        )
      )}
      {error && <Notice tone="error">{error}</Notice>}
    </DetailCard>
  );
}

/** The order's page: the outcome, its webhooks, the payment, the documents, and the plan or the refund. */
export function OrderDetail({
  orderId,
  methods,
  eInvoiceIssued,
}: {
  orderId: string;
  methods: ShopMethod[];
  eInvoiceIssued: boolean;
}) {
  const { book, mode, openCheckout } = useShop();
  const order = book.orders.find((item) => item.id === orderId);
  const paid = order?.invoices.some((invoice) => invoice.status === 'paid');

  // The cart empties once the order it was checked out as is paid
  useEffect(() => {
    if (paid) cartStore.paid(orderId);
  }, [paid, orderId]);

  if (!order) {
    return (
      <EmptyState
        icon={<ShoppingBagIcon />}
        title="Order not found"
        description="The orders of this shop live in the memory of its server: a restart forgets them."
        action={<ButtonLink href="/orders">All orders</ButtonLink>}
      />
    );
  }

  const pay = (invoice: OrderInvoice) =>
    invoice.checkoutToken && openCheckout({ token: invoice.checkoutToken, payUrl: invoice.payUrl });

  return (
    <div className="flex flex-col gap-6">
      <HeroBlock order={order} />
      <div className="grid items-start gap-6 2xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 2xl:col-span-2">
          <PaymentCard order={order} methods={methods} onPay={pay} />
          {order.subscription && <SubscriptionCard order={order} onPay={pay} />}
          <EventsCard order={order} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <DocumentsCard order={order} eInvoiceIssued={eInvoiceIssued} />
          {mode.merchant && order.kind === 'product' && <RefundCard order={order} />}
        </div>
      </div>
    </div>
  );
}
