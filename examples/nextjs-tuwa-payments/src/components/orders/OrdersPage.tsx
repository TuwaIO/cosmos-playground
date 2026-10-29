'use client';

import {
  ArrowRightIcon,
  BanknotesIcon,
  BoltIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

import { MethodLabel } from '@/components/orders/MethodLabel';
import { useShop } from '@/components/shell/ShopProvider';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type DataColumn, DataTable } from '@/components/ui/DataTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { MetricCard } from '@/components/ui/MetricCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Segmented } from '@/components/ui/Segmented';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Time } from '@/components/ui/Time';
import { useNow } from '@/hooks/useNow';
import { money } from '@/lib/format';
import type { ShopMethod } from '@/lib/methods';
import type { Order } from '@/lib/orderTypes';
import { matchesFilter, type OrderFilter, orderStatus, shortOrderId } from '@/lib/status';

const FILTERS: { value: OrderFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'paid', label: 'Paid' },
  { value: 'open', label: 'Open' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'subscriptions', label: 'Subscriptions' },
];

/** The orders of the shop: three numbers, the filters and the table. A whole row opens its order. */
export function OrdersPage({ methods }: { methods: ShopMethod[] }) {
  const { book } = useShop();
  const now = useNow();
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [query, setQuery] = useState('');
  const { orders, webhooks } = book;

  const paidInvoices = orders.flatMap((order) =>
    order.invoices.filter((invoice) => invoice.status === 'paid' || invoice.status === 'partially_refunded'),
  );
  const paidTotal = paidInvoices.reduce((sum, invoice) => sum + Math.round(Number(invoice.total) * 100), 0) / 100;
  const fulfilled = orders.filter((order) => order.fulfilledAt).length;
  const open = orders.filter((order) => ['open', 'underpaid'].includes(order.invoices[0]?.status ?? '')).length;
  const lastWebhook = webhooks[0];

  const needle = query.trim().toLowerCase();
  const rows = orders.filter(
    (order) =>
      matchesFilter(order, filter) &&
      (!needle ||
        order.title.toLowerCase().includes(needle) ||
        order.id.toLowerCase().includes(needle) ||
        shortOrderId(order.id).toLowerCase().includes(needle) ||
        order.invoices.some((invoice) => invoice.number?.toLowerCase().includes(needle))),
  );

  const methodOf = (order: Order) => methods.find((method) => method.id === order.payment?.methodId);

  const columns: DataColumn<Order>[] = [
    {
      id: 'order',
      header: 'Order',
      cell: (order) => (
        <span className="flex min-w-0 flex-col">
          <span className="truncate font-semibold">{order.title}</span>
          <span className="font-mono text-[12px] text-[var(--tuwa-text-secondary)]">{shortOrderId(order.id)}</span>
        </span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (order) => {
        const status = orderStatus(order);
        return <StatusBadge label={status.label} tone={status.tone} />;
      },
    },
    {
      id: 'total',
      header: 'Total',
      align: 'right',
      cell: (order) => <span className="font-mono tabular-nums">{money(order.price, order.currency)}</span>,
    },
    {
      id: 'method',
      header: 'Method',
      cell: (order) => {
        const method = methodOf(order);
        return method ? (
          <MethodLabel method={method} compact />
        ) : (
          <span className="text-[var(--tuwa-text-secondary)]">—</span>
        );
      },
    },
    {
      id: 'created',
      header: 'Created',
      cell: (order) => (
        <time dateTime={order.createdAt} className="whitespace-nowrap text-[var(--tuwa-text-secondary)]">
          <Time iso={order.createdAt} format="ago" now={now} />
        </time>
      ),
    },
    {
      id: 'open',
      header: 'Open',
      srOnlyHeader: true,
      align: 'right',
      cell: (order) => (
        <Link
          href={`/orders/${order.id}`}
          data-row-open
          aria-label={`Open order ${shortOrderId(order.id)}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-shop text-[var(--tuwa-text-secondary)] hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
        >
          <ArrowRightIcon className="h-4 w-4" aria-hidden />
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Orders"
        title="Orders"
        description="Every order and the state its webhooks gave it. An order is fulfilled when invoice.paid arrives."
      />

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <MetricCard
          icon={<BanknotesIcon />}
          label="Paid"
          value={
            <>
              {paidTotal.toFixed(2)}
              <span className="ml-1 text-[11px] font-bold sm:ml-1.5 sm:text-base">USD</span>
            </>
          }
          subValue={`${fulfilled} ${fulfilled === 1 ? 'order' : 'orders'} fulfilled`}
        />
        <MetricCard icon={<ClockIcon />} label="Open" value={open} subValue="waiting for payment" />
        <MetricCard
          icon={<BoltIcon />}
          label="Webhooks"
          value={webhooks.length}
          subValue={
            lastWebhook ? (
              <>
                last <Time iso={lastWebhook.receivedAt} format="ago" now={now} />
              </>
            ) : (
              'none yet'
            )
          }
        />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--tuwa-border-primary)] p-4">
          <Segmented
            label="Show orders"
            value={filter}
            onChange={setFilter}
            arrows
            className="w-full md:w-auto md:self-start"
            options={FILTERS.map((item) => ({
              ...item,
              count: orders.filter((order) => matchesFilter(order, item.value)).length,
            }))}
          />
          <label className="relative block">
            <span className="sr-only">Search orders</span>
            <MagnifyingGlassIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--tuwa-text-tertiary)]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders and invoices"
              className="h-10 w-full rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] pr-3 pl-9 text-sm placeholder:text-[var(--tuwa-text-secondary)]"
            />
          </label>
        </div>
        {orders.length === 0 ? (
          <EmptyState
            bare
            icon={<ShoppingBagIcon />}
            title="No orders yet"
            description="Buy something in the store: the order shows up here and follows its webhooks."
            action={<ButtonLink href="/">Browse the store</ButtonLink>}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            bare
            icon={<MagnifyingGlassIcon />}
            title="No orders match"
            description="Try another filter or search."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setFilter('all');
                  setQuery('');
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <DataTable caption="Orders" columns={columns} rows={rows} rowKey={(order) => order.id} />
        )}
      </Card>
    </div>
  );
}
