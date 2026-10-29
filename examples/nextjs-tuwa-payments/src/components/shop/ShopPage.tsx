'use client';

import {
  ArrowPathRoundedSquareIcon,
  CheckIcon,
  CodeBracketIcon,
  QrCodeIcon,
  ServerStackIcon,
  ShoppingBagIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { TokenIcon } from '@tuwaio/nova-core';
import { networkName } from '@tuwaio/nova-payments';
import { useState } from 'react';

import { buyProduct, type CheckoutStart, subscribe } from '@/app/actions';
import { useShop } from '@/components/shell/ShopProvider';
import { ProductArt } from '@/components/shop/ProductArt';
import { Button, Spinner } from '@/components/ui/Button';
import { Card, Eyebrow } from '@/components/ui/Card';
import { Notice } from '@/components/ui/Notice';
import { PageHeader } from '@/components/ui/PageHeader';
import { Segmented } from '@/components/ui/Segmented';
import { cartStore } from '@/lib/cartStore';
import { CURRENCY, PLAN, type Product, PRODUCTS } from '@/lib/catalog';
import { type AcceptedMethods, canChargeAutomatically, NO_AUTO_CHARGE_METHOD } from '@/lib/methods';

type Collection = 'send_invoice' | 'auto_charge';

/** Where the Quasar dashboard is: the origin of a payment page the shop has seen, if any. */
function useDashboardOrigin(): string | null {
  const { book } = useShop();
  const payUrl = book.orders.flatMap((order) => order.invoices).find((invoice) => invoice.payUrl)?.payUrl;
  try {
    return payUrl ? new URL(payUrl).origin : null;
  } catch {
    return null;
  }
}

/** "Payments → Payment methods", linked to the dashboard when the shop knows where it is. */
function MethodsHint() {
  const origin = useDashboardOrigin();
  return origin ? (
    <a href={origin} target="_blank" rel="noreferrer">
      Payments → Payment methods
    </a>
  ) : (
    <strong>Payments → Payment methods</strong>
  );
}

/** What the buyer can pay with: the methods of the Quasar app, or why nothing can be bought yet. */
function PayWith({ methods }: { methods: AcceptedMethods }) {
  if (!methods.ok) {
    return (
      <Notice tone="error" title="Quasar did not list the payment methods of your app">
        {methods.error}. Check <code>QUASAR_SECRET_KEY</code> and <code>NEXT_PUBLIC_QUASAR_BASE_URL</code> in{' '}
        <code>.env</code>, then reload this page, or set <code>SHOP_DEMO_MODE=true</code> to try the store without
        Quasar.
      </Notice>
    );
  }
  if (methods.methods.length === 0) {
    return (
      <Notice tone="info" title="No payment methods yet">
        Your Quasar app has no payment methods yet: add them under <MethodsHint />, then reload this page.
      </Notice>
    );
  }
  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <Eyebrow className="shrink-0">Pay with</Eyebrow>
      <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Accepted payment methods">
        {methods.methods.map((method) => (
          <li
            key={method.id}
            className="inline-flex h-8 items-center gap-2 rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] pr-2.5 pl-1 text-[13px]"
          >
            <span className="h-6 w-6 shrink-0" aria-hidden>
              <TokenIcon symbol={method.symbol} />
            </span>
            <span className="font-semibold">{method.symbol}</span>
            <span className="text-[var(--tuwa-text-secondary)]">{networkName(method.chainId)}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ProductCard({
  product,
  disabled,
  busy,
  onBuy,
}: {
  product: Product;
  disabled: boolean;
  busy: boolean;
  onBuy: () => void;
}) {
  const [added, setAdded] = useState(false);
  const add = () => {
    cartStore.add(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };
  return (
    <Card as="article" className="flex flex-col gap-4 p-5">
      <ProductArt art={product.art} className="aspect-[4/3] w-full rounded-shop" />
      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="m-0 font-sans text-base font-semibold">{product.name}</h3>
        <p className="m-0 line-clamp-2 text-sm leading-relaxed text-[var(--tuwa-text-secondary)]">
          {product.description}
        </p>
      </div>
      <p className="m-0 flex items-baseline gap-1.5">
        <span className="font-mono text-xl font-bold tabular-nums">{product.price}</span>
        <span className="text-[12px] font-semibold text-[var(--tuwa-text-secondary)]">{CURRENCY}</span>
      </p>
      <div className="flex gap-2">
        <Button className="flex-1" disabled={disabled} onClick={onBuy} aria-busy={busy}>
          {/* Both labels take the same room: the button never changes width */}
          <span className="grid [&>*]:col-start-1 [&>*]:row-start-1">
            <span className={busy ? 'invisible' : undefined}>Buy now</span>
            <span className={busy ? 'inline-flex items-center gap-2' : 'invisible inline-flex items-center gap-2'}>
              <Spinner /> Issuing invoice…
            </span>
          </span>
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={add}
          aria-label={added ? `${product.name} added to the cart` : `Add ${product.name} to the cart`}
        >
          {added ? <CheckIcon className="h-5 w-5" aria-hidden /> : <ShoppingBagIcon className="h-5 w-5" aria-hidden />}
        </Button>
      </div>
    </Card>
  );
}

function PlanCard({
  sellable,
  autoCharge,
  busy,
  onSubscribe,
}: {
  sellable: boolean;
  autoCharge: boolean;
  busy: boolean;
  onSubscribe: (collection: Collection, interval: string) => void;
}) {
  const [interval, setPeriod] = useState(PLAN.periods[0].interval);
  const [collection, setCollection] = useState<Collection>('send_invoice');
  const period = PLAN.periods.find((item) => item.interval === interval) ?? PLAN.periods[0];
  const per = { day: 'day', week: 'week', month: 'month', year: 'year' }[period.interval];

  return (
    <Card as="article" className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-10">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--tuwa-bg-muted)] [&>svg]:h-5 [&>svg]:w-5"
          >
            <ArrowPathRoundedSquareIcon />
          </span>
          <div className="min-w-0">
            <h3 className="m-0 truncate text-lg font-bold tracking-tight">{PLAN.name}</h3>
            <p className="m-0 text-sm text-[var(--tuwa-text-secondary)]">{PLAN.description}</p>
          </div>
        </div>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {PLAN.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-sm">
              <CheckIcon className="h-4 w-4 shrink-0 text-[var(--shop-success-text)]" aria-hidden />
              {perk}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <Eyebrow>Billing</Eyebrow>
          <Segmented
            label="Billing period"
            value={interval}
            onChange={setPeriod}
            className="w-full sm:w-auto"
            options={PLAN.periods.map((item) => ({ value: item.interval, label: item.label }))}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 lg:border-l lg:border-[var(--tuwa-border-secondary)] lg:pl-10">
        <p className="m-0 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-black tabular-nums">{period.price}</span>
          <span className="text-sm font-semibold text-[var(--tuwa-text-secondary)]">
            {CURRENCY} / {per}
          </span>
        </p>
        <p className="m-0 text-[13px] text-[var(--tuwa-text-secondary)]">
          {period.cycles} periods, one invoice each. Cancel any time.
        </p>
        <div className="flex flex-col gap-2">
          <Eyebrow>Payments</Eyebrow>
          <Segmented
            label="How each period is paid"
            value={collection}
            onChange={setCollection}
            className="w-full sm:w-auto"
            options={[
              { value: 'send_invoice', label: 'Pay each invoice' },
              {
                value: 'auto_charge',
                label: 'Automatic payments',
                disabled: !autoCharge,
                describedBy: autoCharge ? undefined : 'auto-charge-note',
              },
            ]}
          />
          {sellable && !autoCharge && (
            <p id="auto-charge-note" className="m-0 text-[12.5px] text-[var(--tuwa-text-secondary)]">
              {NO_AUTO_CHARGE_METHOD}
            </p>
          )}
        </div>
        <Button
          className="mt-auto w-full sm:w-auto sm:self-start"
          disabled={!sellable || busy}
          aria-busy={busy}
          onClick={() => onSubscribe(collection, interval)}
        >
          {busy && <Spinner />}
          {busy ? 'Starting the plan…' : 'Subscribe'}
        </Button>
      </div>
    </Card>
  );
}

const STEPS = [
  {
    icon: <ServerStackIcon />,
    title: 'The server issues the invoice',
    text: 'A Server Action calls quasar.payments.createInvoice with the order ID in the metadata. Only the checkout token reaches the browser.',
  },
  {
    icon: <WalletIcon />,
    title: 'Nova Payments takes the payment',
    text: 'PaymentCheckout locks a quote and pays from an EVM or Solana wallet (Nova Connect), or with a QR code.',
  },
  {
    icon: <QrCodeIcon />,
    title: 'A webhook fulfils the order',
    text: 'Quasar confirms the payment on-chain and sends invoice.paid; the shop verifies it and fulfils the order once.',
  },
];

/** How the store works, for developers: out of the main surface, in a 3 + 1 grid. */
function HowItWorks() {
  const { mode } = useShop();
  return (
    <section aria-labelledby="how-title" className="grid gap-4 lg:grid-cols-4">
      <Card className="flex flex-col gap-5 p-5 sm:p-6 lg:col-span-3">
        <h2 id="how-title" className="m-0 text-lg font-bold tracking-tight">
          How this store works
        </h2>
        <ol className="m-0 grid list-none gap-5 p-0 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--tuwa-bg-muted)] [&>svg]:h-4 [&>svg]:w-4"
                >
                  {step.icon}
                </span>
                <span className="font-mono text-[12px] font-bold text-[var(--tuwa-text-secondary)]">0{index + 1}</span>
              </span>
              <h3 className="m-0 font-sans text-sm font-semibold">{step.title}</h3>
              <p className="m-0 text-[13px] leading-relaxed text-[var(--tuwa-text-secondary)]">{step.text}</p>
            </li>
          ))}
        </ol>
      </Card>
      <aside className="flex flex-col gap-3 rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] p-5">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <CodeBracketIcon className="h-4 w-4" aria-hidden /> Run it yourself
        </span>
        <p className="m-0 text-[13px] leading-relaxed text-[var(--shop-text-label)]">
          {mode.demo
            ? 'This is demo mode: Quasar is simulated. Set QUASAR_SECRET_KEY and QUASAR_WEBHOOK_SECRET to sell for real.'
            : 'Start from the nextjs-tuwa-payments template of Cosmos Playground with the keys of your Quasar app.'}
        </p>
        <a
          href="https://docs.tuwa.io/quasar"
          target="_blank"
          rel="noreferrer"
          className="mt-auto text-[13px] font-semibold underline hover:no-underline"
        >
          Quasar documentation
        </a>
      </aside>
    </section>
  );
}

/** The store: the accepted methods, the products, the plan and how it works. */
export function ShopPage({ methods }: { methods: AcceptedMethods }) {
  const { openCheckout, refresh } = useShop();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const sellable = methods.ok && methods.methods.length > 0;
  const autoCharge = sellable && methods.methods.some(canChargeAutomatically);

  // Issues the invoice on the server (the secret key never reaches the browser), then opens its checkout
  const start = async (key: string, issue: () => Promise<CheckoutStart>) => {
    setBusy(key);
    setError(null);
    try {
      const result = await issue();
      if (result.ok) openCheckout({ token: result.checkoutToken, payUrl: result.payUrl });
      else setError(result.error);
      await refresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Store"
        title="Cosmos Store"
        description="Pay in crypto from an EVM or Solana wallet, or with a QR code"
      />
      <PayWith methods={methods} />
      {error && (
        <Notice
          tone="error"
          title="The invoice was not issued"
          action={
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              Dismiss
            </Button>
          }
        >
          {error}
        </Notice>
      )}
      <section aria-labelledby="products-title" className="flex flex-col gap-4">
        <h2 id="products-title" className="sr-only">
          Products
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              disabled={!sellable || busy !== null}
              busy={busy === product.id}
              onBuy={() => void start(product.id, () => buyProduct(product.id))}
            />
          ))}
        </div>
      </section>
      <section aria-labelledby="plan-title" className="flex flex-col gap-3">
        <h2 id="plan-title" className="m-0 text-lg font-bold tracking-tight">
          Subscription
        </h2>
        <PlanCard
          sellable={sellable}
          autoCharge={autoCharge}
          busy={busy === 'plan'}
          onSubscribe={(collection, interval) => void start('plan', () => subscribe(collection, interval))}
        />
      </section>
      <HowItWorks />
    </div>
  );
}
