'use client';

import { QuasarLoader } from '@tuwaio/sdk/nova-core';
import { cn, getChainName } from '@tuwaio/sdk/nova-core/utils';
import {
  ArrowPathIcon,
  BoltIcon,
  CheckCircleIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
} from '@tuwaio/sdk/nova-icons/24/outline';
import { shortAddress } from '@tuwaio/sdk/orbit';
import { TransactionStatus, useTxFinished } from '@tuwaio/sdk/pulsar';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { chipClassName, labelClassName } from '@/components/classNames';
import { Panel } from '@/components/Panel';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';
import type { QuasarWebhookEvent } from '@/lib/quasarWebhookStore';

// Quasar sends EVM chains as numbers or numeric strings and Solana clusters as CAIP-2 chain IDs with the genesis hash
function formatWebhookChain(chainId: string | number): string {
  const id = typeof chainId === 'string' && /^\d+$/.test(chainId) ? Number(chainId) : chainId;
  const { name } = getChainName(id);
  const raw = String(chainId);
  const shortId = raw.length > 20 ? shortAddress(raw, 10, 6) : raw;
  return name === 'Unknown' ? shortId : `${name} (${shortId})`;
}

type WebhookResponse = {
  latest: QuasarWebhookEvent | null;
  events: QuasarWebhookEvent[];
  allEventsCount: number;
  byTxKey: Record<string, QuasarWebhookEvent>;
};

export function QuasarWebhookMonitor() {
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const subscribeTxFinished = usePulsarStore((state) => state.subscribeTxFinished);

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

  // Quasar delivers the webhook a moment after a transaction succeeds, so it is fetched a few times after the store
  // reports the success, also for a transaction restored after a page reload
  useTxFinished({
    subscribeTxFinished,
    onFinished: (tx) => {
      if (tx.status !== TransactionStatus.Success) return;
      for (const delay of [2_000, 5_000, 10_000]) {
        setTimeout(() => void fetchWebhooks(tx.txKey), delay);
      }
    },
  });

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

  const rowClassName = 'flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-2.5';
  const rowLabelClassName = cn(labelClassName, 'text-[var(--tuwa-text-secondary)]');
  const rowValueClassName = 'font-mono text-xs break-all text-[var(--tuwa-text-primary)]';

  return (
    <Panel
      name="Quasar webhook sync"
      aside={
        <div className="flex items-center gap-2">
          <span className={chipClassName}>Live receiver</span>
          <button
            type="button"
            onClick={() => void fetchWebhooks(targetTxKey)}
            disabled={isLoading}
            aria-label="Refresh the webhook status"
            title="Refresh the webhook status"
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center border border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-standart-button-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <QuasarLoader size={14} accent="currentColor" />
            ) : (
              <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      }
    >
      {/* The state of the delivery: the mark and one line */}
      <div className="flex items-center gap-3 border-b border-[var(--tuwa-border-primary)] px-5 py-3.5">
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center border',
            activeWebhook
              ? 'border-[var(--tuwa-success-text)] text-[var(--tuwa-success-text)]'
              : hasError
                ? 'border-[var(--tuwa-error-text)] text-[var(--tuwa-error-text)]'
                : 'border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)]',
          )}
        >
          {activeWebhook ? (
            <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
          ) : hasError ? (
            <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <BoltIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </span>
        <p className="text-sm text-[var(--tuwa-text-primary)]">
          {activeWebhook
            ? 'Delivery verified and HMAC authenticated'
            : isLoading
              ? 'Checking the webhook inbox...'
              : hasError
                ? 'Could not read the webhook inbox'
                : 'Awaiting the webhook of a transaction'}
        </p>
      </div>

      {latestTransaction && (
        <dl className="border-b border-[var(--tuwa-border-primary)] py-1.5">
          <div className={rowClassName}>
            <dt className={rowLabelClassName}>Latest transaction</dt>
            <dd className={rowValueClassName}>{shortAddress(latestTransaction.txKey, 10, 8)}</dd>
          </div>
          {'hash' in latestTransaction && typeof latestTransaction.hash === 'string' && (
            <div className={rowClassName}>
              <dt className={rowLabelClassName}>On-chain hash</dt>
              <dd className={rowValueClassName}>{shortAddress(latestTransaction.hash, 8, 6)}</dd>
            </div>
          )}
        </dl>
      )}

      {activeWebhook ? (
        <>
          <dl className="grid grid-cols-1 border-b border-[var(--tuwa-border-primary)] sm:grid-cols-2">
            <div className="flex items-start gap-2.5 border-b border-[var(--tuwa-border-primary)] px-5 py-3.5 sm:border-r sm:border-b-0">
              <ShieldCheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--tuwa-success-text)]" aria-hidden="true" />
              <div className="min-w-0">
                <dt className={rowLabelClassName}>Verification</dt>
                <dd className="mt-1 text-sm text-[var(--tuwa-text-primary)]">HMAC-SHA256 valid</dd>
              </div>
            </div>
            <div className="flex items-start gap-2.5 px-5 py-3.5">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--tuwa-text-primary)]" aria-hidden="true" />
              <div className="min-w-0">
                <dt className={rowLabelClassName}>Pipeline status</dt>
                <dd className="mt-1 truncate text-sm text-[var(--tuwa-text-primary)] capitalize">
                  {activeWebhook.payload.status ?? 'Processed'}
                </dd>
              </div>
            </div>
          </dl>

          <dl className="border-b border-[var(--tuwa-border-primary)] py-1.5">
            <div className={rowClassName}>
              <dt className={rowLabelClassName}>Quasar event</dt>
              <dd className={cn(rowValueClassName, 'font-bold')}>{activeWebhook.event}</dd>
            </div>
            <div className={rowClassName}>
              <dt className={rowLabelClassName}>Bound txKey</dt>
              <dd className={rowValueClassName}>
                {shortAddress(activeWebhook.payload.txKey ?? targetTxKey ?? '—', 10, 8)}
              </dd>
            </div>
            {activeWebhook.payload.chainId && (
              <div className={rowClassName}>
                <dt className={rowLabelClassName}>Chain ID</dt>
                <dd className={rowValueClassName} title={String(activeWebhook.payload.chainId)}>
                  {formatWebhookChain(activeWebhook.payload.chainId)}
                </dd>
              </div>
            )}
            <div className={rowClassName}>
              <dt className={rowLabelClassName}>Delivery time</dt>
              <dd className={rowValueClassName}>{new Date(activeWebhook.receivedAt).toLocaleTimeString()}</dd>
            </div>
          </dl>

          {/* The payload of the webhook, folded or open */}
          <div>
            <div className="flex items-center justify-between gap-3 px-5 py-2.5">
              <button
                type="button"
                onClick={() => setIsPayloadOpen(!isPayloadOpen)}
                aria-expanded={isPayloadOpen}
                className={cn(
                  labelClassName,
                  'flex min-h-6 cursor-pointer items-center gap-1.5 text-[var(--tuwa-text-primary)] hover:underline',
                )}
              >
                {isPayloadOpen ? (
                  <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                )}
                Payload
              </button>
              <button
                type="button"
                onClick={handleCopyPayload}
                className={cn(
                  labelClassName,
                  'flex min-h-6 cursor-pointer items-center gap-1.5 text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
                )}
              >
                {isCopied ? (
                  <>
                    <CheckIcon className="h-4 w-4 text-[var(--tuwa-success-text)]" aria-hidden="true" />
                    <span className="text-[var(--tuwa-success-text)]">Copied</span>
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="h-4 w-4" aria-hidden="true" />
                    Copy JSON
                  </>
                )}
              </button>
            </div>
            {isPayloadOpen && (
              <pre
                tabIndex={0}
                className="max-h-48 overflow-auto border-t border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] p-4 font-mono text-[11px] leading-relaxed text-[var(--tuwa-text-primary)]"
              >
                {JSON.stringify(activeWebhook.payload, null, 2)}
              </pre>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-start gap-3 p-5">
          <span className="flex h-11 w-11 items-center justify-center border border-[var(--tuwa-border-strong)] text-[var(--tuwa-text-primary)]">
            <ClockIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-sm font-bold text-[var(--tuwa-text-primary)]">
              {targetTxKey ? 'Waiting for the webhook of this transaction' : 'No transaction yet'}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-[var(--tuwa-text-secondary)]">
              Run an EVM or Solana action above. Quasar Cloud indexes the on-chain event and delivers a signed webhook
              to this server.
            </p>
          </div>
          <p className="border border-[var(--tuwa-border-primary)] px-2.5 py-1.5 font-mono text-[11px] break-all text-[var(--tuwa-text-secondary)]">
            Endpoint: <code className="text-[var(--tuwa-text-primary)]">POST /api/webhooks/quasar</code>
          </p>
        </div>
      )}
    </Panel>
  );
}
