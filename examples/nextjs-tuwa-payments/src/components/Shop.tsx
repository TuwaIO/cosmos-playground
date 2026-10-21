'use client';

import { ArrowPathRoundedSquareIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { getChainName, TokenIcon } from '@tuwaio/nova-core';
import { toEvmChainId } from '@tuwaio/orbit-core';

import { Button, Card } from '@/components/ui';
import { CURRENCY, PLAN, PRODUCTS } from '@/lib/catalog';
import { type AcceptedMethods, canChargeAutomatically, NO_AUTO_CHARGE_METHOD, NO_METHODS } from '@/lib/methods';

export type ShopAction =
  { kind: 'product'; productId: string } | { kind: 'plan'; collection: 'send_invoice' | 'auto_charge' };

/** The name of a method's network (`Base Sepolia`, `Solana Devnet`) from its CAIP-2 chain. */
const networkName = (chainId: string) => getChainName(toEvmChainId(chainId) ?? chainId).name;

/** What the buyer can pay with, from the payment methods of your Quasar app, or why nothing can be bought yet. */
function AcceptedMethodsCard({ methods }: { methods: AcceptedMethods }) {
  return (
    <Card className="flex flex-col gap-3">
      <h2 className="m-0 text-sm font-semibold text-[var(--tuwa-text-primary)]">Pay with crypto</h2>
      {!methods.ok ? (
        <p className="m-0 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-error-bg)] p-3 text-sm text-[var(--tuwa-error-text)]">
          Quasar did not list the payment methods of your app: {methods.error}. Check <code>QUASAR_SECRET_KEY</code> and{' '}
          <code>NEXT_PUBLIC_QUASAR_BASE_URL</code> in <code>.env</code>, then reload this page.
        </p>
      ) : methods.methods.length === 0 ? (
        <p className="m-0 rounded-[var(--tuwa-rounded-corners)] bg-[var(--tuwa-info-bg)] p-3 text-sm text-[var(--tuwa-info-text)]">
          {NO_METHODS}
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {methods.methods.map((method) => (
            <li
              key={method.id}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--tuwa-border-primary)] py-1 pr-3 pl-1 text-sm"
            >
              <span className="h-6 w-6 shrink-0" aria-hidden>
                <TokenIcon symbol={method.symbol} />
              </span>
              <span className="font-semibold text-[var(--tuwa-text-primary)]">{method.symbol}</span>
              <span className="text-[var(--tuwa-text-secondary)]">{networkName(method.chainId)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/**
 * The payment methods, the products and the plan. Each button issues an invoice on the server and opens its checkout;
 * the buttons stay off while the app has no payment methods, and automatic payments while it has no EVM token method.
 */
export function Shop({
  methods,
  busy,
  onBuy,
}: {
  methods: AcceptedMethods;
  busy: string | null;
  onBuy: (action: ShopAction, key: string) => void;
}) {
  const sellable = methods.ok && methods.methods.length > 0;
  const autoCharge = sellable && methods.methods.some(canChargeAutomatically);

  return (
    <div className="flex flex-col gap-4">
      <AcceptedMethodsCard methods={methods} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Card key={product.id} className="flex flex-col gap-3">
            <ShoppingBagIcon className="h-6 w-6 text-[var(--tuwa-text-accent)]" aria-hidden />
            <div className="flex-1">
              <h3 className="m-0 text-base font-semibold text-[var(--tuwa-text-primary)]">{product.name}</h3>
              <p className="mt-1 text-sm text-[var(--tuwa-text-secondary)]">{product.description}</p>
            </div>
            <p className="m-0 text-lg font-bold text-[var(--tuwa-text-primary)]">
              {product.price} {CURRENCY}
            </p>
            <Button
              disabled={busy !== null || !sellable}
              onClick={() => onBuy({ kind: 'product', productId: product.id }, product.id)}
            >
              {busy === product.id ? 'Issuing the invoice…' : 'Buy with crypto'}
            </Button>
          </Card>
        ))}

        <Card className="flex flex-col gap-3">
          <ArrowPathRoundedSquareIcon className="h-6 w-6 text-[var(--tuwa-text-accent)]" aria-hidden />
          <div className="flex-1">
            <h3 className="m-0 text-base font-semibold text-[var(--tuwa-text-primary)]">{PLAN.name}</h3>
            <p className="mt-1 text-sm text-[var(--tuwa-text-secondary)]">{PLAN.description}</p>
          </div>
          <p className="m-0 text-lg font-bold text-[var(--tuwa-text-primary)]">
            {PLAN.price} {CURRENCY} <span className="text-sm font-normal">per {PLAN.interval}</span>
          </p>
          <Button
            disabled={busy !== null || !sellable}
            onClick={() => onBuy({ kind: 'plan', collection: 'send_invoice' }, 'send_invoice')}
          >
            {busy === 'send_invoice' ? 'Starting…' : 'Subscribe, pay each invoice'}
          </Button>
          <Button
            variant="secondary"
            disabled={busy !== null || !autoCharge}
            aria-describedby={sellable && !autoCharge ? 'auto-charge-note' : undefined}
            onClick={() => onBuy({ kind: 'plan', collection: 'auto_charge' }, 'auto_charge')}
          >
            {busy === 'auto_charge' ? 'Starting…' : 'Subscribe with automatic payments'}
          </Button>
          {sellable && !autoCharge && (
            <p id="auto-charge-note" className="m-0 text-xs text-[var(--tuwa-text-secondary)]">
              {NO_AUTO_CHARGE_METHOD}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
