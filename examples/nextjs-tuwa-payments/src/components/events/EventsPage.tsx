'use client';

import {
  CheckBadgeIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  SignalIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Fragment, type ReactNode, useState } from 'react';

import { EventAmount, EventDetails, EventRow, EventTypeChip, ListeningLine } from '@/components/events/EventFeed';
import { useShop } from '@/components/shell/ShopProvider';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Segmented } from '@/components/ui/Segmented';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Time } from '@/components/ui/Time';
import type { WebhookLogEntry } from '@/lib/orderTypes';
import { type EventFamily, eventFamily, shortOrderId } from '@/lib/status';

type FeedFilter = 'all' | EventFamily;

const RULES: { icon: ReactNode; title: string; text: ReactNode }[] = [
  {
    icon: <ShieldCheckIcon />,
    title: 'Verified',
    text: (
      <>
        <code>verifyWebhook</code> checks the HMAC of the raw body and refuses a payment event sent more than 5 minutes
        ago.
      </>
    ),
  },
  {
    icon: <DocumentDuplicateIcon />,
    title: 'Once per event',
    text: 'Retries and redeliveries carry the same event ID: the shop acts on each ID once and logs repeats.',
  },
  {
    icon: <CheckBadgeIcon />,
    title: 'Fulfilled by the server',
    text: (
      <>
        The order is fulfilled on the first <code>invoice.paid</code>, never on what the checkout says in the browser.
      </>
    ),
  },
];

const HEAD =
  'whitespace-nowrap border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] px-3 py-2.5 text-left text-[10.5px] font-bold uppercase tracking-widest text-[var(--shop-text-label)] first:pl-5 last:pr-5';
const CELL = 'border-b border-[var(--tuwa-border-secondary)] px-3 py-3 align-middle text-[13.5px] first:pl-5 last:pr-5';
const ROW_OPEN = 'bg-[color-mix(in_oklab,var(--tuwa-bg-muted)_55%,transparent)]';
const ROW_HOVER = 'hover:bg-[color-mix(in_oklab,var(--tuwa-bg-muted)_55%,transparent)]';

/** One delivery as a table row; a click opens its details and highlighted body under it, across the table. */
function EventTableRow({ entry }: { entry: WebhookLogEntry }) {
  const [open, setOpen] = useState(false);
  const panelId = `event-${entry.id}-${entry.receivedAt}`;
  return (
    <Fragment>
      <tr
        onClick={(event) => {
          if (!(event.target as HTMLElement).closest('a, button')) setOpen((value) => !value);
        }}
        className={cn('cursor-pointer transition-colors', open ? ROW_OPEN : ROW_HOVER)}
      >
        <td
          className={cn(
            CELL,
            'whitespace-nowrap font-mono text-[12.5px] tabular-nums text-[var(--tuwa-text-secondary)]',
          )}
        >
          <time dateTime={entry.receivedAt}>
            <Time iso={entry.receivedAt} format="clock" />
          </time>
        </td>
        <td className={CELL}>
          <EventTypeChip type={entry.type} />
        </td>
        <td className={cn(CELL, 'whitespace-nowrap font-mono tabular-nums')}>{entry.invoiceNumber ?? '—'}</td>
        <td className={cn(CELL, 'max-w-[280px]')}>
          {entry.orderId ? (
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-semibold">{entry.orderTitle}</span>
              <Link
                href={`/orders/${entry.orderId}`}
                className="self-start font-mono text-[12px] text-[var(--tuwa-text-secondary)] hover:underline"
              >
                {shortOrderId(entry.orderId)}
              </Link>
            </span>
          ) : (
            <StatusBadge label="No order" tone="error" />
          )}
        </td>
        <td className={cn(CELL, 'text-right')}>
          <EventAmount entry={entry} />
        </td>
        <td className={CELL}>
          <span className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-[var(--tuwa-text-secondary)]">
            {entry.source === 'webhook' ? 'Verified' : 'Simulated'}
            {!entry.firstDelivery && <StatusBadge label="Repeat, ignored" tone="pending" />}
          </span>
        </td>
        <td className={cn(CELL, 'w-12 text-right')}>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`Details of ${entry.type}${entry.invoiceNumber ? ` for ${entry.invoiceNumber}` : ''}`}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-shop text-[var(--tuwa-text-secondary)] hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
          >
            <ChevronDownIcon
              aria-hidden
              className={cn('h-4 w-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')}
            />
          </button>
        </td>
      </tr>
      {open && (
        <tr id={panelId}>
          <td colSpan={7} className="border-b border-[var(--tuwa-border-secondary)] px-5 py-4">
            <EventDetails entry={entry} wide />
          </td>
        </tr>
      )}
    </Fragment>
  );
}

/** The log as a table from 768 px: time, event, invoice, order, amount and delivery; a row opens its details. */
function EventsTable({ entries }: { entries: WebhookLogEntry[] }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full border-collapse">
        <caption className="sr-only">Webhook events</caption>
        <thead>
          <tr>
            <th scope="col" className={HEAD}>
              Received
            </th>
            <th scope="col" className={HEAD}>
              Event
            </th>
            <th scope="col" className={HEAD}>
              Invoice
            </th>
            <th scope="col" className={HEAD}>
              Order
            </th>
            <th scope="col" className={cn(HEAD, 'text-right')}>
              Amount
            </th>
            <th scope="col" className={HEAD}>
              Delivery
            </th>
            <th scope="col" className={HEAD}>
              <span className="sr-only">Details</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <EventTableRow key={`${entry.id}:${entry.receivedAt}`} entry={entry} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Whether a delivery matches the search: its type, invoice, order, or event ID. */
function matches(entry: WebhookLogEntry, needle: string): boolean {
  if (!needle) return true;
  return [entry.type, entry.invoiceNumber, entry.orderTitle, entry.id, entry.orderId && shortOrderId(entry.orderId)]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(needle));
}

/** The whole webhook log: filters and search, the table (a list on phones), and how the shop treats each delivery. */
export function EventsPage() {
  const { book } = useShop();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [query, setQuery] = useState('');
  const count = (family: EventFamily) => book.webhooks.filter((entry) => eventFamily(entry.type) === family).length;
  const needle = query.trim().toLowerCase();
  const rows = book.webhooks.filter(
    (entry) => (filter === 'all' || eventFamily(entry.type) === filter) && matches(entry, needle),
  );
  const clear = () => {
    setFilter('all');
    setQuery('');
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Developers"
        title="Events"
        description="The payments.v1 webhooks of Quasar, as the shop received them. Open a row for its details."
        actions={<ListeningLine />}
      />
      <Card className="flex min-w-0 flex-col overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--tuwa-border-primary)] p-4 md:flex-row md:items-center">
          <Segmented
            label="Event families"
            value={filter}
            onChange={setFilter}
            arrows
            className="w-full md:w-auto md:shrink-0"
            options={[
              { value: 'all', label: 'All', count: book.webhooks.length },
              { value: 'invoices', label: 'Invoices', count: count('invoices') },
              { value: 'subscriptions', label: 'Subscriptions', count: count('subscriptions') },
              { value: 'refunds', label: 'Refunds', count: count('refunds') },
            ]}
          />
          <label className="relative block md:flex-1">
            <span className="sr-only">Search events</span>
            <MagnifyingGlassIcon
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--tuwa-text-tertiary)]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by event, invoice or order"
              className="h-10 w-full rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] pr-3 pl-9 text-sm placeholder:text-[var(--tuwa-text-secondary)]"
            />
          </label>
        </div>
        {rows.length === 0 ? (
          <EmptyState
            bare
            icon={book.webhooks.length ? <MagnifyingGlassIcon /> : <SignalIcon />}
            title={book.webhooks.length ? 'No events match' : 'No events yet'}
            description={
              book.webhooks.length
                ? 'Try another filter or search.'
                : 'Buy something: Quasar sends payments.v1 webhooks as the invoice is issued, paid and fulfilled.'
            }
            action={
              book.webhooks.length ? (
                <Button variant="secondary" onClick={clear}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <>
            <EventsTable entries={rows} />
            <ul className="m-0 list-none p-0 md:hidden">
              <AnimatePresence initial={false}>
                {rows.map((entry) => (
                  <EventRow key={`${entry.id}:${entry.receivedAt}`} entry={entry} />
                ))}
              </AnimatePresence>
            </ul>
          </>
        )}
      </Card>
      <section aria-labelledby="rules-title" className="flex flex-col gap-3">
        <h2 id="rules-title" className="m-0 text-lg font-bold tracking-tight">
          How the shop treats them
        </h2>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-3">
          {RULES.map((rule) => (
            <li
              key={rule.title}
              className="flex gap-3 rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] p-5"
            >
              <span aria-hidden className="mt-0.5 shrink-0 [&>svg]:h-4 [&>svg]:w-4">
                {rule.icon}
              </span>
              <span className="flex flex-col gap-1">
                <span className="text-[13.5px] font-semibold">{rule.title}</span>
                <span className="text-[13px] leading-relaxed text-[var(--shop-text-label)]">{rule.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
