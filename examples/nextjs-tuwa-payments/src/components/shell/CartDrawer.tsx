'use client';

import { MinusIcon, PlusIcon, ShoppingBagIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState, useSyncExternalStore, useTransition } from 'react';

import { checkoutCart } from '@/app/actions';
import { useShop } from '@/components/shell/ShopProvider';
import { ProductArt } from '@/components/shop/ProductArt';
import { Button, Spinner } from '@/components/ui/Button';
import { Drawer } from '@/components/ui/Drawer';
import { EmptyState } from '@/components/ui/EmptyState';
import { Notice } from '@/components/ui/Notice';
import { cartItemCount, cartStore, itemsLabel } from '@/lib/cartStore';
import { CURRENCY, findProduct, MAX_QUANTITY, sumPrices } from '@/lib/catalog';
import { money } from '@/lib/format';

const STEP =
  'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-shop text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-muted)] disabled:cursor-not-allowed disabled:opacity-40';

/**
 * The cart: the lines with a quantity stepper and a remove button, the subtotal, and Checkout, which issues one
 * invoice for the whole cart and opens the checkout page.
 */
export function CartDrawer() {
  const { cartOpen, setCartOpen } = useShop();
  const lines = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const items = lines.flatMap((line) => {
    const product = findProduct(line.productId);
    return product ? [{ ...line, product }] : [];
  });
  const subtotal = sumPrices(items.map((item) => ({ price: item.product.price, quantity: item.quantity })));

  const checkout = () => {
    setError(null);
    startTransition(async () => {
      const result = await checkoutCart(items.map(({ productId, quantity }) => ({ productId, quantity })));
      // A client navigation: the cart closes there (it is open on this page only)
      if (result.ok) router.push(`/checkout?order=${encodeURIComponent(result.orderId)}`);
      else setError(result.error);
    });
  };

  return (
    <Drawer
      open={cartOpen}
      onOpenChange={setCartOpen}
      title="Cart"
      description={items.length ? itemsLabel(cartItemCount(items)) : undefined}
      phone="full"
      footer={
        items.length > 0 && (
          <div className="flex flex-col gap-3">
            {error && <Notice tone="error">{error}</Notice>}
            <div className="flex items-baseline justify-between">
              <span className="text-[13.5px] text-[var(--tuwa-text-secondary)]">Subtotal</span>
              <span className="font-mono text-lg font-bold tabular-nums">{money(subtotal, CURRENCY)}</span>
            </div>
            <Button onClick={checkout} disabled={pending} className="w-full">
              {pending && <Spinner />}
              {pending ? 'Issuing invoice…' : 'Checkout'}
            </Button>
            <p className="m-0 text-center text-[12px] text-[var(--tuwa-text-secondary)]">
              One invoice for the whole cart, paid in crypto on the next page
            </p>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <EmptyState
          bare
          icon={<ShoppingBagIcon />}
          title="Your cart is empty"
          description="Add a product from the store: the cart becomes one invoice with a line for each product."
          action={
            <Button variant="secondary" onClick={() => setCartOpen(false)}>
              Browse the store
            </Button>
          }
        />
      ) : (
        <ul className="m-0 list-none p-0">
          {items.map(({ product, quantity }) => (
            <li
              key={product.id}
              className="flex items-center gap-3 border-b border-[var(--tuwa-border-secondary)] px-5 py-4 last:border-b-0"
            >
              <ProductArt art={product.art} className="h-14 w-14 shrink-0 rounded-shop" />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-sm font-semibold">{product.name}</p>
                <p className="m-0 mt-0.5 font-mono text-[12.5px] tabular-nums text-[var(--tuwa-text-secondary)]">
                  {money(product.price, CURRENCY)}
                </p>
                <div
                  className="mt-2 inline-flex items-center rounded-shop border border-[var(--tuwa-border-primary)]"
                  role="group"
                  aria-label={`Quantity of ${product.name}`}
                >
                  <button
                    type="button"
                    className={STEP}
                    aria-label="One less"
                    disabled={quantity <= 1}
                    onClick={() => cartStore.setQuantity(product.id, quantity - 1)}
                  >
                    <MinusIcon className="h-4 w-4" aria-hidden />
                  </button>
                  <output aria-live="polite" className="w-8 text-center font-mono text-[13px] tabular-nums">
                    {quantity}
                  </output>
                  <button
                    type="button"
                    className={STEP}
                    aria-label="One more"
                    disabled={quantity >= MAX_QUANTITY}
                    onClick={() => cartStore.setQuantity(product.id, quantity + 1)}
                  >
                    <PlusIcon className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="font-mono text-sm font-bold tabular-nums">
                  {sumPrices([{ price: product.price, quantity }])}
                </span>
                <button
                  type="button"
                  className={STEP}
                  aria-label={`Remove ${product.name}`}
                  onClick={() => cartStore.remove(product.id)}
                >
                  <TrashIcon className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  );
}
