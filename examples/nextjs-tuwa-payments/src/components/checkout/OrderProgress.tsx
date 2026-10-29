'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { motion } from 'framer-motion';

import { DetailCard } from '@/components/ui/Card';
import { Time } from '@/components/ui/Time';
import type { Order } from '@/lib/orderTypes';

type Step = { label: string; detail: string; at: string | null };

/** The four steps of an order from the invoice to fulfilment, with the time each one happened. */
function stepsOf(order: Order): Step[] {
  const at = (type: string) => order.events.find((event) => event.type === type)?.receivedAt ?? null;
  const paid = at('invoice.paid');
  return [
    { label: 'Invoice issued', detail: 'invoice.issued', at: at('invoice.issued') ?? order.createdAt },
    { label: 'Payment seen', detail: 'invoice.processing', at: at('invoice.processing') ?? paid },
    { label: 'Confirmed', detail: 'invoice.paid', at: paid },
    { label: 'Fulfilled by webhook', detail: 'the shop acted on invoice.paid', at: order.fulfilledAt },
  ];
}

/**
 * The order status timeline: what the server learnt from the webhooks while the buyer pays, beside the checkout. A step
 * comes in when its webhook lands (at once where motion is reduced).
 */
export function OrderProgress({ order, className }: { order: Order; className?: string }) {
  const steps = stepsOf(order);
  const current = steps.findIndex((step) => !step.at);
  return (
    <DetailCard
      title="Order status"
      description="Updated by the webhooks of Quasar, not by the checkout"
      className={className}
    >
      <ol className="m-0 flex list-none flex-col p-0" aria-live="polite">
        {steps.map((step, index) => {
          const done = Boolean(step.at);
          const active = index === current;
          return (
            <li key={step.label} className="relative flex gap-3 pb-5 last:pb-0">
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute top-7 bottom-0 left-[13px] w-px',
                    done ? 'bg-[var(--tuwa-text-primary)]' : 'bg-[var(--tuwa-border-primary)]',
                  )}
                />
              )}
              <motion.span
                aria-hidden
                initial={false}
                animate={{ scale: done ? [0.6, 1.08, 1] : 1 }}
                transition={{ duration: 0.35 }}
                className={cn(
                  'relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border',
                  done
                    ? 'border-[var(--tuwa-button-primary-bg)] bg-[var(--tuwa-button-primary-bg)] text-[var(--tuwa-text-on-accent)]'
                    : active
                      ? 'border-[var(--tuwa-text-primary)] bg-[var(--tuwa-bg-primary)]'
                      : 'border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)]',
                )}
              >
                {done ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <span
                    className={cn(
                      'h-2 w-2 rounded-full',
                      active ? 'shop-pulse bg-[var(--tuwa-text-primary)]' : 'bg-[var(--tuwa-border-primary)]',
                    )}
                  />
                )}
              </motion.span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
                <span className="flex items-baseline justify-between gap-3">
                  <span className={cn('text-sm font-semibold', !done && 'text-[var(--tuwa-text-secondary)]')}>
                    {step.label}
                    <span className="sr-only">{done ? ', done' : active ? ', waiting' : ''}</span>
                  </span>
                  {step.at && (
                    <time
                      dateTime={step.at}
                      className="font-mono text-[12px] tabular-nums text-[var(--tuwa-text-secondary)]"
                    >
                      <Time iso={step.at} format="clock" />
                    </time>
                  )}
                </span>
                <code className="truncate font-mono text-[12px] text-[var(--tuwa-text-secondary)]">{step.detail}</code>
              </div>
            </li>
          );
        })}
      </ol>
    </DetailCard>
  );
}
