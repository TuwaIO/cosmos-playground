'use client';

import { CheckBadgeIcon, ChevronDownIcon, CpuChipIcon, SignalIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { type ReactNode, useId, useState } from 'react';

import { useShop } from '@/components/shell/ShopProvider';
import { EmptyState } from '@/components/ui/EmptyState';
import { Segmented } from '@/components/ui/Segmented';
import { STATUS_TONES, StatusBadge } from '@/components/ui/StatusBadge';
import { Time } from '@/components/ui/Time';
import type { WebhookLogEntry } from '@/lib/orderTypes';
import { type EventFamily, eventFamily, eventTone, shortOrderId } from '@/lib/status';

type FeedFilter = 'all' | EventFamily;

/** The event type as a mono code chip, toned by what it means for the order. */
export function EventTypeChip({ type, className }: { type: WebhookLogEntry['type']; className?: string }) {
  return (
    <code
      className={cn(
        'inline-flex max-w-full items-center truncate rounded-shop border px-1.5 py-0.5 font-mono text-[12px] font-semibold',
        STATUS_TONES[eventTone(type)],
        className,
      )}
    >
      {type}
    </code>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 justify-between gap-3">
      <dt className="shrink-0 text-[var(--tuwa-text-secondary)]">{label}</dt>
      <dd className="m-0 min-w-0 truncate text-right font-mono tabular-nums">{children}</dd>
    </div>
  );
}

/** One delivery of the log: time, type, invoice and marks; expands to the event's details and its trimmed body. */
function EventRow({ entry }: { entry: WebhookLogEntry }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="border-b border-[var(--tuwa-border-secondary)] last:border-b-0"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer flex-col gap-1.5 px-4 py-3 text-left hover:bg-[color-mix(in_oklab,var(--tuwa-bg-muted)_55%,transparent)]"
      >
        <span className="flex w-full min-w-0 items-center gap-2">
          <time
            dateTime={entry.receivedAt}
            className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--tuwa-text-secondary)]"
          >
            <Time iso={entry.receivedAt} format="clock" />
          </time>
          <EventTypeChip type={entry.type} className="min-w-0" />
          <ChevronDownIcon
            aria-hidden
            className={cn(
              'ml-auto h-4 w-4 shrink-0 text-[var(--tuwa-text-tertiary)] transition-transform motion-reduce:transition-none',
              open && 'rotate-180',
            )}
          />
        </span>
        <span className="flex min-w-0 flex-wrap items-center gap-1.5 text-[12.5px] text-[var(--tuwa-text-secondary)]">
          {entry.invoiceNumber && <span className="font-mono tabular-nums">{entry.invoiceNumber}</span>}
          {entry.orderTitle && <span className="min-w-0 truncate">· {entry.orderTitle}</span>}
          {entry.environment === 'test' && <StatusBadge label="Test" />}
          {!entry.firstDelivery && <StatusBadge label="Repeat, ignored" tone="pending" />}
          {!entry.orderId && <StatusBadge label="No order" tone="error" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 px-4 pb-4">
              <dl className="m-0 flex flex-col gap-1.5 text-[12.5px]">
                <Detail label="Event ID">{entry.id}</Detail>
                <Detail label="Environment">{entry.environment}</Detail>
                <Detail label="Sent at">
                  <Time iso={entry.sentAt} format="date" />
                </Detail>
                <Detail label="Received at">
                  <Time iso={entry.receivedAt} format="clock" />
                </Detail>
                {entry.orderId && (
                  <Detail label="Order">
                    <Link href={`/orders/${entry.orderId}`} className="underline hover:no-underline">
                      {shortOrderId(entry.orderId)}
                    </Link>
                  </Detail>
                )}
              </dl>
              <p className="m-0 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-[var(--shop-success-text)]">
                {entry.source === 'webhook' ? (
                  <>
                    <CheckBadgeIcon className="h-4 w-4" aria-hidden /> Signature verified with verifyWebhook
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[var(--tuwa-text-secondary)]">
                    <CpuChipIcon className="h-4 w-4" aria-hidden /> Simulated in demo mode
                  </span>
                )}
              </p>
              <pre
                // Geist Mono by style, not the `font-mono` class: nova-core forces that class to a line height of 1
                style={{ fontFamily: 'var(--tuwa-font-mono)' }}
                className="m-0 max-h-64 overflow-auto rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] p-3 text-[11.5px] leading-relaxed text-[var(--tuwa-text-primary)]"
              >
                {entry.summary}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/** The live dot: steady while reading every 3 s, pulsing softly while the event stream is connected. */
export function LiveDot({ live }: { live: 'connecting' | 'live' | 'polling' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block h-1.5 w-1.5 shrink-0 rounded-full',
        live === 'live' ? 'shop-pulse bg-[var(--tuwa-success-icon)]' : 'bg-[var(--tuwa-text-tertiary)]',
      )}
    />
  );
}

/** "Listening on /api/webhooks/quasar" and how the page follows the log. */
export function ListeningLine() {
  const { live, mode } = useShop();
  return (
    <p className="m-0 flex min-w-0 items-center gap-2 text-[12.5px] text-[var(--tuwa-text-secondary)]">
      <LiveDot live={live} />
      <span className="min-w-0 truncate">
        {mode.demo ? 'Simulated events · ' : 'Listening on '}
        {!mode.demo && <code className="font-mono">/api/webhooks/quasar</code>}
        {mode.demo && 'demo mode'}
      </span>
      <span className="sr-only">
        {live === 'live' ? ', live' : live === 'polling' ? ', reading every 3 seconds' : ''}
      </span>
    </p>
  );
}

/**
 * The webhook log: filter by family (with counts), then the deliveries, newest first. New rows slide in (at once where
 * motion is reduced).
 */
export function EventFeed({ limit, className }: { limit?: number; className?: string }) {
  const { book } = useShop();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const count = (family: EventFamily) => book.webhooks.filter((entry) => eventFamily(entry.type) === family).length;
  const rows = book.webhooks.filter((entry) => filter === 'all' || eventFamily(entry.type) === filter);
  const shown = limit ? rows.slice(0, limit) : rows;

  return (
    <div className={cn('flex min-h-0 flex-col', className)}>
      <div className="px-4 pb-3">
        <Segmented
          label="Event families"
          size="sm"
          value={filter}
          onChange={setFilter}
          className="w-full"
          options={[
            { value: 'all', label: 'All', count: book.webhooks.length },
            { value: 'invoices', label: 'Invoices', count: count('invoices') },
            { value: 'subscriptions', label: 'Subs', count: count('subscriptions') },
            { value: 'refunds', label: 'Refunds', count: count('refunds') },
          ]}
        />
      </div>
      {shown.length === 0 ? (
        <EmptyState
          bare
          icon={<SignalIcon />}
          title="No events yet"
          description="Buy something: Quasar sends payments.v1 webhooks as the invoice is issued, paid and fulfilled."
          className="border-t border-[var(--tuwa-border-secondary)] py-10"
        />
      ) : (
        <ul className="m-0 min-h-0 list-none overflow-y-auto border-t border-[var(--tuwa-border-secondary)] p-0">
          <AnimatePresence initial={false}>
            {shown.map((entry) => (
              <EventRow key={`${entry.id}:${entry.receivedAt}`} entry={entry} />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
