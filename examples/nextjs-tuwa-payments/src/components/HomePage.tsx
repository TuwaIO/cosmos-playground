'use client';

import { PaymentCheckout } from '@tuwaio/nova-payments';
import { useState } from 'react';

import { buyProduct, subscribe } from '@/app/actions';
import { Orders } from '@/components/Orders';
import { Shop, type ShopAction } from '@/components/Shop';
import { WebhookLog } from '@/components/WebhookLog';
import { useOrderBook } from '@/hooks/useOrderBook';

type OpenCheckout = { token: string; payUrl: string | null };

export function HomePage({ highlight }: { highlight: string | null }) {
  const { book, refresh } = useOrderBook();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkout, setCheckout] = useState<OpenCheckout | null>(null);
  const [open, setOpen] = useState(false);

  const showCheckout = (next: OpenCheckout) => {
    setCheckout(next);
    setOpen(true);
  };

  // Issues the invoice on the server (the secret key never reaches the browser), then opens its checkout
  const onBuy = async (action: ShopAction, key: string) => {
    setBusy(key);
    setError(null);
    try {
      const result =
        action.kind === 'product' ? await buyProduct(action.productId) : await subscribe(action.collection);
      if (result.ok) showCheckout({ token: result.checkoutToken, payUrl: result.payUrl });
      else setError(result.error);
      await refresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="min-h-[calc(100dvh-57px)] bg-[var(--tuwa-bg-secondary)] px-4 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div>
          <h1 className="m-0 text-2xl font-bold text-[var(--tuwa-text-primary)]">Quasar Payments shop</h1>
          <p className="mt-2 max-w-3xl text-sm text-[var(--tuwa-text-secondary)]">
            Each purchase issues a Quasar invoice on the server and opens the Nova Payments checkout: choose a network
            and token, then pay from a connected EVM or Solana wallet or with a QR code. Quasar checks the payment
            on-chain and sends the webhooks that fulfil the order below.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="m-0 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-error-bg)] p-3 text-sm text-[var(--tuwa-error-text)]"
          >
            {error}
          </p>
        )}

        <Shop busy={busy} onBuy={(action, key) => void onBuy(action, key)} />

        <div className="grid gap-6 lg:grid-cols-2">
          <Orders
            orders={book.orders}
            highlight={highlight}
            onPay={(invoice) =>
              invoice.checkoutToken && showCheckout({ token: invoice.checkoutToken, payUrl: invoice.payUrl })
            }
          />
          <WebhookLog webhooks={book.webhooks} />
        </div>
      </div>

      {checkout && (
        <PaymentCheckout
          // A new invoice is a new checkout
          key={checkout.token}
          token={checkout.token}
          payUrl={checkout.payUrl}
          open={open}
          onOpenChange={setOpen}
          onPaid={() => void refresh()}
        />
      )}
    </main>
  );
}
