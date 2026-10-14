'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import type { InvoiceStatus } from '@tuwaio/quasar-sdk';

import { Badge, Button, Card } from '@/components/ui';
import type { Order, OrderInvoice } from '@/lib/orderTypes';

const STATUS_TONE: Record<InvoiceStatus, 'success' | 'pending' | 'info' | 'error'> = {
  open: 'pending',
  processing: 'pending',
  paid: 'success',
  underpaid: 'error',
  held: 'info',
  partially_refunded: 'info',
  refunded: 'info',
  expired: 'error',
  cancelled: 'error',
};

// An invoice the buyer can still pay from the shop
const PAYABLE: InvoiceStatus[] = ['open', 'underpaid'];

function InvoiceRow({ invoice, onPay }: { invoice: OrderInvoice; onPay: (invoice: OrderInvoice) => void }) {
  return (
    <li className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-mono text-[var(--tuwa-text-secondary)]">{invoice.number ?? invoice.id}</span>
      {invoice.period !== null && <span className="text-[var(--tuwa-text-tertiary)]">period {invoice.period}</span>}
      <Badge tone={STATUS_TONE[invoice.status]}>{invoice.status.replace('_', ' ')}</Badge>
      <span className="text-[var(--tuwa-text-secondary)]">
        {invoice.total} {invoice.currency}
      </span>
      <span className="ml-auto flex gap-2">
        {invoice.payUrl && (
          <a
            href={invoice.payUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-[var(--tuwa-text-accent)] underline hover:no-underline"
          >
            Payment page
          </a>
        )}
        {invoice.checkoutToken && PAYABLE.includes(invoice.status) && (
          <Button className="min-h-8 px-3 text-xs" onClick={() => onPay(invoice)}>
            Pay
          </Button>
        )}
      </span>
    </li>
  );
}

/** The orders of the shop with their invoices, as the webhooks of Quasar update them. */
export function Orders({
  orders,
  highlight,
  onPay,
}: {
  orders: Order[];
  highlight: string | null;
  onPay: (invoice: OrderInvoice) => void;
}) {
  return (
    <Card>
      <h2 className="m-0 text-base font-semibold text-[var(--tuwa-text-primary)]">Orders</h2>
      <p className="mt-1 text-sm text-[var(--tuwa-text-secondary)]">
        Kept in the memory of the dev server. An order is fulfilled when the <code>invoice.paid</code> webhook arrives,
        not when the checkout says paid.
      </p>
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--tuwa-text-tertiary)]">No orders yet.</p>
      ) : (
        <ul className="mt-4 flex list-none flex-col gap-3 p-0">
          {orders.map((order) => (
            <li
              key={order.id}
              className={cn(
                'rounded-[var(--tuwa-rounded-corners)] border p-3',
                order.id === highlight ? 'border-[var(--tuwa-text-accent)]' : 'border-[var(--tuwa-border-secondary)]',
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[var(--tuwa-text-primary)]">{order.title}</span>
                <span className="text-sm text-[var(--tuwa-text-secondary)]">
                  {order.price} {order.currency}
                </span>
                {order.subscription && (
                  <Badge tone={order.subscription.status === 'active' ? 'success' : 'pending'}>
                    subscription {order.subscription.status}
                    {order.subscription.autoCharge ? ', automatic payments on' : ''}
                  </Badge>
                )}
                {order.fulfilledAt && (
                  <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[var(--tuwa-success-text)]">
                    <CheckCircleIcon className="h-4 w-4" aria-hidden />
                    Fulfilled {new Date(order.fulfilledAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <ul className="mt-2 flex list-none flex-col gap-1 p-0">
                {order.invoices.map((invoice) => (
                  <InvoiceRow key={invoice.id} invoice={invoice} onPay={onPay} />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
