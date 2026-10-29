'use client';

import { CheckBadgeIcon, DocumentDuplicateIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';

import { EventFeed, ListeningLine } from '@/components/events/EventFeed';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

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

/** The whole webhook log, with how the shop treats each delivery beside it. */
export function EventsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Developers"
        title="Events"
        description="The payments.v1 webhooks of Quasar, as the shop received them. Open a row for its details."
      />
      <div className="grid items-start gap-6 lg:grid-cols-4">
        <Card className="flex min-w-0 flex-col pt-4 lg:col-span-3">
          <div className="px-4 pb-3">
            <ListeningLine />
          </div>
          <EventFeed />
        </Card>
        <aside className="flex flex-col gap-4 rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] p-5">
          <h2 className="m-0 text-[15px] font-bold tracking-tight">How the shop treats them</h2>
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {RULES.map((rule) => (
              <li key={rule.title} className="flex gap-3">
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
        </aside>
      </div>
    </div>
  );
}
