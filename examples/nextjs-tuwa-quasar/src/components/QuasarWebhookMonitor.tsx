'use client';

import {
  ArrowPathIcon,
  BoltIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { textCenterEllipsis } from '@tuwaio/sdk/nova-core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import type { QuasarWebhookEvent } from '@/lib/quasarWebhookStore';
import { TRANSACTION_SUCCESS_EVENT, type TransactionSuccessDetail } from '@/lib/webhookMonitorEvents';

type WebhookResponse = {
  latest: QuasarWebhookEvent | null;
  events: QuasarWebhookEvent[];
  allEventsCount: number;
  byTxKey: Record<string, QuasarWebhookEvent>;
};

export function QuasarWebhookMonitor() {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);

  const [webhookData, setWebhookData] = useState<WebhookResponse>({
    latest: null,
    events: [],
    allEventsCount: 0,
    byTxKey: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isPayloadOpen, setIsPayloadOpen] = useState(true);

  // Extract all tracked transactions sorted by timestamp (newest first)
  const trackedTransactions = useMemo(() => {
    if (!transactionsPool) return [];
    return Object.values(transactionsPool).sort((a, b) => (b.localTimestamp ?? 0) - (a.localTimestamp ?? 0));
  }, [transactionsPool]);

  // Latest executed transaction
  const latestTransaction = trackedTransactions[0] ?? null;
  const targetTxKey = latestTransaction?.txKey ?? null;

  // Fetch webhooks from the server
  const fetchWebhooks = useCallback(async (key?: string | null) => {
    try {
      setIsLoading(true);
      const query = key ? `?txKey=${encodeURIComponent(key)}` : '';
      const response = await fetch(`/api/webhooks/quasar${query}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Webhook status request failed');

      const data = (await response.json()) as WebhookResponse;
      setWebhookData(data);
      setHasError(false);
    } catch (error) {
      console.error('[Webhook Monitor] Failed to fetch status:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Periodic polling for webhook arrivals
  useEffect(() => {
    let isCancelled = false;

    const load = async () => {
      try {
        const query = targetTxKey ? `?txKey=${encodeURIComponent(targetTxKey)}` : '';
        const response = await fetch(`/api/webhooks/quasar${query}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Webhook status request failed');

        const data = (await response.json()) as WebhookResponse;
        if (!isCancelled) {
          setWebhookData(data);
          setHasError(false);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('[Webhook Monitor] Failed to fetch status:', error);
          setHasError(true);
        }
      }
    };

    void load();
    const interval = setInterval(() => {
      void load();
    }, 15_000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [targetTxKey]);

  // Listen for real-time transaction completion events and fast-retry polling
  useEffect(() => {
    const handleTxSuccess = (event: Event) => {
      const customEvent = event as CustomEvent<TransactionSuccessDetail>;
      const txKey = customEvent.detail?.txKey;

      const timer1 = setTimeout(() => void fetchWebhooks(txKey), 2_000);
      const timer2 = setTimeout(() => void fetchWebhooks(txKey), 5_000);
      const timer3 = setTimeout(() => void fetchWebhooks(txKey), 10_000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    };

    window.addEventListener(TRANSACTION_SUCCESS_EVENT, handleTxSuccess);
    return () => window.removeEventListener(TRANSACTION_SUCCESS_EVENT, handleTxSuccess);
  }, [fetchWebhooks]);

  // Resolve webhook for the latest transaction, falling back to latest stored webhook
  const activeWebhook = useMemo(() => {
    if (targetTxKey && webhookData.byTxKey[targetTxKey]) {
      return webhookData.byTxKey[targetTxKey];
    }
    return webhookData.latest;
  }, [targetTxKey, webhookData]);

  // Copy JSON payload to clipboard
  const handleCopyPayload = () => {
    if (!activeWebhook) return;
    navigator.clipboard.writeText(JSON.stringify(activeWebhook.payload, null, 2));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="relative w-full max-w-md overflow-hidden rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Top glowing ambient gradient line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] via-[var(--tuwa-button-gradient-to)] to-[var(--tuwa-button-gradient-from)] opacity-80" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)]/50 px-4 sm:px-5 py-3.5 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--tuwa-rounded-corners)] border transition-colors ${
              activeWebhook
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : hasError
                  ? 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                  : 'border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-accent)]'
            }`}
          >
            {activeWebhook ? (
              <CheckCircleIcon className="h-4.5 w-4.5" />
            ) : hasError ? (
              <ExclamationTriangleIcon className="h-4.5 w-4.5" />
            ) : (
              <BoltIcon className="h-4.5 w-4.5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="text-sm font-semibold tracking-tight text-[var(--tuwa-text-primary)] leading-tight">
                Quasar Webhook Sync
              </h2>
              <span className="inline-flex items-center gap-1 rounded-[var(--tuwa-rounded-corners)] bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-400/20 shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Receiver
              </span>
            </div>
            <p className="text-[11px] text-[var(--tuwa-text-tertiary)] leading-tight mt-0.5">
              {activeWebhook
                ? 'Delivery verified & HMAC authenticated'
                : isLoading
                  ? 'Checking webhook inbox...'
                  : 'Awaiting transaction webhook delivery'}
            </p>
          </div>
        </div>

        <button
          onClick={() => void fetchWebhooks(targetTxKey)}
          disabled={isLoading}
          title="Refresh webhook status"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-secondary)] transition-all duration-200 hover:border-[var(--tuwa-border-primary)] hover:text-[var(--tuwa-text-primary)] disabled:opacity-50 cursor-pointer"
        >
          <ArrowPathIcon className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Target Latest Transaction Bar */}
        {latestTransaction && (
          <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)]/30 p-2.5 text-xs space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="text-[var(--tuwa-text-tertiary)]">Latest Transaction</span>
              <span className="font-mono text-[11px] text-[var(--tuwa-text-accent)] break-all">
                {textCenterEllipsis(latestTransaction.txKey, 10, 8)}
              </span>
            </div>
            {'hash' in latestTransaction && typeof latestTransaction.hash === 'string' && (
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                <span className="text-[var(--tuwa-text-tertiary)]">On-Chain Hash</span>
                <span className="font-mono text-[var(--tuwa-text-primary)] break-all">
                  {textCenterEllipsis(latestTransaction.hash, 8, 6)}
                </span>
              </div>
            )}
          </div>
        )}

        {activeWebhook ? (
          <div className="space-y-3">
            {/* Status & Security Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-emerald-400 min-w-0">
                <ShieldCheckIcon className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-semibold uppercase tracking-wider opacity-75">Verification</div>
                  <div className="truncate font-medium">HMAC-SHA256 Valid</div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)] px-3 py-2 text-[var(--tuwa-text-primary)] min-w-0">
                <ClockIcon className="h-4 w-4 shrink-0 text-[var(--tuwa-text-accent)]" />
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-semibold uppercase tracking-wider text-[var(--tuwa-text-tertiary)]">
                    Pipeline Status
                  </div>
                  <div className="truncate font-medium capitalize">{activeWebhook.payload.status ?? 'Processed'}</div>
                </div>
              </div>
            </div>

            {/* Structured Event Info Details */}
            <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)]/40 p-3 text-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[var(--tuwa-text-tertiary)]">Quasar Event</span>
                <span className="font-mono font-semibold text-[var(--tuwa-text-accent)]">{activeWebhook.event}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[var(--tuwa-text-tertiary)]">Bound txKey</span>
                <span className="font-mono text-[var(--tuwa-text-primary)] break-all">
                  {textCenterEllipsis(activeWebhook.payload.txKey ?? targetTxKey ?? '—', 10, 8)}
                </span>
              </div>
              {activeWebhook.payload.chainId && (
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="text-[var(--tuwa-text-tertiary)]">Chain ID</span>
                  <span className="font-mono text-[var(--tuwa-text-primary)]">
                    {String(activeWebhook.payload.chainId)}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[var(--tuwa-text-tertiary)]">Delivery Time</span>
                <span className="text-[var(--tuwa-text-primary)]">
                  {new Date(activeWebhook.receivedAt).toLocaleTimeString()}
                </span>
              </div>
            </div>

            {/* Collapsible JSON Payload Inspector */}
            <div className="rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)]/20 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[var(--tuwa-bg-secondary)]/50 border-b border-[var(--tuwa-border-secondary)]">
                <button
                  onClick={() => setIsPayloadOpen(!isPayloadOpen)}
                  className="flex items-center gap-1.5 text-xs font-medium text-[var(--tuwa-text-accent)] hover:text-[var(--tuwa-button-gradient-to)] transition-colors cursor-pointer"
                >
                  <span>{isPayloadOpen ? '▼ Hide Payload' : '▶ Show Payload'}</span>
                </button>
                <button
                  onClick={handleCopyPayload}
                  className="flex items-center gap-1 text-[11px] text-[var(--tuwa-text-tertiary)] hover:text-[var(--tuwa-text-primary)] transition-colors cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              {isPayloadOpen && (
                <pre className="max-h-48 overflow-auto p-3 text-[11px] font-mono leading-relaxed text-[var(--tuwa-text-primary)] bg-black/20 scrollbar-thin">
                  {JSON.stringify(activeWebhook.payload, null, 2)}
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[var(--tuwa-rounded-corners)] border border-dashed border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)]/30 p-6 text-center text-xs text-[var(--tuwa-text-secondary)]">
            <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-accent)]">
              <ClockIcon className="h-5 w-5 animate-pulse" />
            </div>
            <p className="font-medium text-[var(--tuwa-text-primary)] mb-1">
              {targetTxKey ? 'Waiting for webhook for this transaction' : 'No transactions executed yet'}
            </p>
            <p className="text-[11px] text-[var(--tuwa-text-tertiary)] max-w-xs mb-3">
              Execute an EVM or Solana action above. Quasar Cloud will index the on-chain event and deliver a signed
              webhook to this server.
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-bg-primary)] px-2.5 py-1 font-mono text-[10px] text-[var(--tuwa-text-secondary)] border border-[var(--tuwa-border-secondary)]">
              <span>Endpoint:</span>
              <code className="text-[var(--tuwa-text-accent)] break-all">POST /api/webhooks/quasar</code>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
