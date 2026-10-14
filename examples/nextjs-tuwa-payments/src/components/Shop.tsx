'use client';

import { ArrowPathRoundedSquareIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

import { Button, Card } from '@/components/ui';
import { CURRENCY, PLAN, PRODUCTS } from '@/lib/catalog';

export type ShopAction =
  { kind: 'product'; productId: string } | { kind: 'plan'; collection: 'send_invoice' | 'auto_charge' };

/** The products and the plan. Each button issues an invoice on the server and opens its checkout. */
export function Shop({ busy, onBuy }: { busy: string | null; onBuy: (action: ShopAction, key: string) => void }) {
  return (
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
            disabled={busy !== null}
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
          disabled={busy !== null}
          onClick={() => onBuy({ kind: 'plan', collection: 'send_invoice' }, 'send_invoice')}
        >
          {busy === 'send_invoice' ? 'Starting…' : 'Subscribe, pay each invoice'}
        </Button>
        <Button
          variant="secondary"
          disabled={busy !== null}
          onClick={() => onBuy({ kind: 'plan', collection: 'auto_charge' }, 'auto_charge')}
        >
          {busy === 'auto_charge' ? 'Starting…' : 'Subscribe with automatic payments'}
        </Button>
      </Card>
    </div>
  );
}
