'use client';

import { RefundButton } from '@tuwaio/nova-payments';
import { createRefundStore } from '@tuwaio/quasar-sdk/checkout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { previewRefund, readRefund, requestRefund, submitRefund } from '@/app/merchantActions';

/**
 * Merchant mode: the refund of a paid order from the merchant's connected wallet. The window is the `RefundButton` of
 * Nova Payments; its store calls Quasar through the Server Actions of `merchantActions.ts`, so the secret key stays on
 * the server.
 */
export function RefundControls({
  invoiceId,
  number,
  currency,
}: {
  invoiceId: string;
  number: string | null;
  currency: string;
}) {
  const router = useRouter();
  // One store per order page: the refund goes on while its window is closed
  const [store] = useState(() =>
    createRefundStore({ request: requestRefund, preview: previewRefund, submit: submitRefund, get: readRefund }),
  );
  return (
    <RefundButton
      store={store}
      invoiceId={invoiceId}
      invoice={number ?? invoiceId}
      currency={currency}
      className="shop-btn is-2"
      onRefunded={() => router.refresh()}
    />
  );
}
