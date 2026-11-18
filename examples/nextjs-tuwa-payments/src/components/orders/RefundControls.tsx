'use client';

import { RefundDialog } from '@tuwaio/nova-payments';
import { createRefundStore } from '@tuwaio/quasar-sdk/checkout';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { previewRefund, readRefund, requestRefund, submitRefund, withdrawRefund } from '@/app/merchantActions';
import type { WaitingRefund } from '@/lib/orders';

/**
 * Merchant mode: the refund of a paid order from the merchant's connected wallet. The window is the `RefundDialog` of
 * Nova Payments; its store calls Quasar through the Server Actions of `merchantActions.ts`, so the secret key stays on
 * the server.
 *
 * A refund asked for and not sent keeps its amount in Quasar. So the refunds that wait for their transaction are listed
 * under the button, each with "Withdraw", and the page reads them again whenever the window closes.
 */
export function RefundControls({
  invoiceId,
  number,
  currency,
  waiting,
}: {
  invoiceId: string;
  number: string | null;
  currency: string;
  waiting: WaitingRefund[];
}) {
  const router = useRouter();
  // One store per order page: the refund goes on while its window is closed
  const [store] = useState(() =>
    createRefundStore({ request: requestRefund, preview: previewRefund, submit: submitRefund, get: readRefund }),
  );
  const [open, setOpen] = useState(false);
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const withdraw = (refundId: string) =>
    startTransition(async () => {
      setError(null);
      const result = await withdrawRefund(refundId);
      // `refund_not_waiting`: it was sent or ended meanwhile, and the refreshed page says which
      if ('refused' in result && result.refused.code !== 'refund_not_waiting') {
        setError(result.refused.message);
        return;
      }
      // The store may still hold it: it would offer to send a refund Quasar no longer waits for
      if (store.getState().refund?.id === refundId) store.getState().reset();
      router.refresh();
    });

  return (
    <div className="shop-stack" style={{ gap: 12, alignItems: 'flex-end' }}>
      <button type="button" className="shop-btn is-2" onClick={() => setOpen(true)}>
        Refund
      </button>
      {waiting.map((refund) => (
        <p key={refund.id} className="shop-small shop-row" style={{ gap: 12, justifyContent: 'flex-end' }}>
          <span>
            A refund of {refund.amount} {refund.currency} waits for its transaction.
          </span>
          <button type="button" className="shop-link" disabled={busy} onClick={() => withdraw(refund.id)}>
            Withdraw
          </button>
        </p>
      ))}
      {error && (
        <p className="shop-small" role="alert">
          {error}
        </p>
      )}
      <RefundDialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          // A window closed before sending leaves its refund waiting: the page reads the refunds again
          if (!next) router.refresh();
        }}
        store={store}
        invoiceId={invoiceId}
        invoice={number ?? invoiceId}
        currency={currency}
        onRefunded={() => router.refresh()}
      />
    </div>
  );
}
