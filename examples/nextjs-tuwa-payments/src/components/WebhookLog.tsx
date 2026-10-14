'use client';

import { Badge, Card } from '@/components/ui';
import type { WebhookLogEntry } from '@/lib/orderTypes';

/** The `payments.v1` webhooks the shop verified, newest first. */
export function WebhookLog({ webhooks }: { webhooks: WebhookLogEntry[] }) {
  return (
    <Card>
      <h2 className="m-0 text-base font-semibold text-[var(--tuwa-text-primary)]">Webhooks</h2>
      <p className="mt-1 text-sm text-[var(--tuwa-text-secondary)]">
        Deliveries to <code>/api/webhooks/quasar</code> that passed <code>verifyWebhook</code>.
      </p>
      {webhooks.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--tuwa-text-tertiary)]">
          Nothing yet. Add the webhook endpoint of your Quasar app and issue an invoice.
        </p>
      ) : (
        <ul className="mt-4 flex list-none flex-col gap-2 p-0">
          {webhooks.map((entry) => (
            <li key={`${entry.id}:${entry.receivedAt}`} className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-mono text-[var(--tuwa-text-tertiary)]">
                {new Date(entry.receivedAt).toLocaleTimeString()}
              </span>
              <span className="font-semibold text-[var(--tuwa-text-primary)]">{entry.type}</span>
              {entry.invoiceNumber && (
                <span className="font-mono text-[var(--tuwa-text-secondary)]">{entry.invoiceNumber}</span>
              )}
              {entry.environment === 'test' && <Badge tone="info">test</Badge>}
              {!entry.firstDelivery && <Badge tone="pending">repeat, ignored</Badge>}
              {!entry.orderId && <Badge tone="error">no order</Badge>}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
