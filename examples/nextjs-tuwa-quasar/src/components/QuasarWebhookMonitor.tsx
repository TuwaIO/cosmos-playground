'use client';

import { CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import type { QuasarWebhookEvent } from '@/lib/quasarWebhookStore';
import { TRANSACTION_SUCCESS_EVENT } from '@/lib/webhookMonitorEvents';

type WebhookResponse = {
  latest: QuasarWebhookEvent | null;
};

export function QuasarWebhookMonitor() {
  const [latest, setLatest] = useState<QuasarWebhookEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let requestTimeout: number | undefined;
    let pollingInterval: number | undefined;
    let isCancelled = false;

    const fetchLatest = async () => {
      try {
        const response = await fetch('/api/webhooks/quasar', { cache: 'no-store' });
        if (!response.ok) throw new Error('Webhook status request failed');

        const data = (await response.json()) as WebhookResponse;
        if (!isCancelled) {
          setLatest(data.latest);
          setHasError(false);
        }
      } catch (error) {
        console.error('[Webhook Monitor] Failed to fetch status:', error);
        if (!isCancelled) setHasError(true);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    const scheduleWebhookRequest = () => {
      if (requestTimeout) window.clearTimeout(requestTimeout);
      if (pollingInterval) window.clearInterval(pollingInterval);

      setIsLoading(true);
      requestTimeout = window.setTimeout(() => {
        void fetchLatest();
        pollingInterval = window.setInterval(() => void fetchLatest(), 30_000);
      }, 3_000);
    };

    window.addEventListener(TRANSACTION_SUCCESS_EVENT, scheduleWebhookRequest);
    return () => {
      isCancelled = true;
      window.removeEventListener(TRANSACTION_SUCCESS_EVENT, scheduleWebhookRequest);
      if (requestTimeout) window.clearTimeout(requestTimeout);
      if (pollingInterval) window.clearInterval(pollingInterval);
    };
  }, []);

  const statusLabel = latest ? 'Webhook received and processed' : 'Waiting for a successful transaction';
  const statusIcon = latest ? CheckCircleIcon : hasError ? ExclamationTriangleIcon : ClockIcon;
  const StatusIcon = statusIcon;

  return (
    <section className="relative w-full max-w-sm overflow-hidden rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-primary)]/90 p-4 shadow-xl backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[var(--tuwa-button-gradient-to)] to-transparent opacity-80" />
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${latest ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400' : hasError ? 'border-amber-400/30 bg-amber-400/10 text-amber-400' : 'border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-secondary)]'}`}
        >
          <StatusIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-wide text-[var(--tuwa-text-primary)]">Quasar Webhook</h2>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--tuwa-button-gradient-to)] shadow-[0_0_8px_var(--tuwa-button-gradient-to)]" />
          </div>
          <p className="text-xs text-[var(--tuwa-text-secondary)]">
            {isLoading ? 'Checking webhook status...' : statusLabel}
          </p>
        </div>
      </div>

      {latest ? (
        <div className="space-y-3 text-xs text-[var(--tuwa-text-secondary)]">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-400">
              <div className="mb-0.5 text-[10px] uppercase tracking-wider opacity-70">Security</div>
              <div className="font-medium">Signature verified</div>
            </div>
            <div className="rounded-lg border border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)] px-3 py-2 text-[var(--tuwa-text-primary)]">
              <div className="mb-0.5 text-[10px] uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">
                Pipeline
              </div>
              <div className="font-medium">Data processed</div>
            </div>
          </div>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-1">
            <dt>Event</dt>
            <dd className="font-mono text-right text-[var(--tuwa-text-primary)]">{latest.event}</dd>
            <dt>Tx key</dt>
            <dd className="truncate text-right font-mono text-[var(--tuwa-text-primary)]">
              {latest.payload.txKey ?? '—'}
            </dd>
            <dt>Status</dt>
            <dd className="text-right text-[var(--tuwa-text-primary)]">{latest.payload.status ?? '—'}</dd>
            <dt>Received</dt>
            <dd className="text-right text-[var(--tuwa-text-primary)]">
              {new Date(latest.receivedAt).toLocaleString()}
            </dd>
          </dl>
          <details>
            <summary className="cursor-pointer text-[var(--tuwa-text-accent)] transition-colors hover:text-[var(--tuwa-button-gradient-to)]">
              Show payload
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-[var(--tuwa-border-secondary)] bg-black/10 p-3 text-[11px] leading-relaxed">
              {JSON.stringify(latest.payload, null, 2)}
            </pre>
          </details>
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)]/60 px-3 py-2 text-xs text-[var(--tuwa-text-secondary)]">
          Endpoint: <code>/api/webhooks/quasar</code>
        </p>
      )}
    </section>
  );
}
