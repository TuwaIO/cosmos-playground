'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRightIcon, TrashIcon, XMarkIcon } from '@tuwaio/nova-icons/24/outline';
import { useSyncExternalStore } from 'react';

import { checkoutCart } from '@/app/actions';
import { useShop } from '@/components/shell/ShopProvider';
import { PRODUCT_ART } from '@/components/shop/art';
import { Quantity } from '@/components/ui/Quantity';
import { cartItemCount, cartStore, itemsLabel } from '@/lib/cartStore';
import { CURRENCY, findProduct, sumPrices } from '@/lib/catalog';
import { amount } from '@/lib/format';

/**
 * The cart: a panel from the right, a sheet from the bottom on a phone (Radix Dialog). "Check out" issues one invoice
 * for the whole cart and opens its checkout.
 */
export function CartDrawer() {
  const { cartOpen, setCartOpen, purchase, busy, sellable } = useShop();
  const cart = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const lines = cart.flatMap((line) => {
    const product = findProduct(line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  const total = sumPrices(lines.map(({ product, quantity }) => ({ price: product.price, quantity })));
  const count = cartItemCount(cart);

  return (
    <Dialog.Root open={cartOpen} onOpenChange={setCartOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="shop-shade" />
        <Dialog.Content className="shop-drawer">
          <div className="shop-bar is-plain is-first" style={{ padding: '8px 12px 8px 20px' }}>
            <Dialog.Title asChild>
              <span>
                Cart / <b>{itemsLabel(count)}</b>
              </span>
            </Dialog.Title>
            <Dialog.Description className="sr-only">The products you are about to buy.</Dialog.Description>
            <Dialog.Close className="shop-btn is-2 is-icon is-sm" aria-label="Close the cart">
              <XMarkIcon className="shop-icon" aria-hidden />
            </Dialog.Close>
          </div>

          {lines.length === 0 ? (
            <div className="shop-in shop-stack" style={{ flex: 1, alignItems: 'center', gap: 12, textAlign: 'center' }}>
              <h2 className="shop-h3">The cart is empty</h2>
              <p className="shop-small">Add a product, or buy one at once with "Buy now".</p>
            </div>
          ) : (
            <ul style={{ flex: 1, overflowY: 'auto' }}>
              {lines.map(({ product, quantity }) => {
                const Art = PRODUCT_ART[product.id];
                return (
                  <li key={product.id} className="shop-line" style={{ alignItems: 'start' }}>
                    <div className="shop-frame">{Art && <Art className="shop-art" aria-hidden />}</div>
                    <div className="shop-stack" style={{ gap: 8, minWidth: 0, alignItems: 'flex-start' }}>
                      <h3 className="shop-h3" style={{ fontSize: 14 }}>
                        {product.name}
                      </h3>
                      <span className="shop-label">
                        {amount(product.price)} {CURRENCY} each
                      </span>
                      <Quantity
                        small
                        label={`Quantity of ${product.name}`}
                        value={quantity}
                        onChange={(next) => cartStore.setQuantity(product.id, next)}
                      />
                    </div>
                    <div
                      className="shop-stack"
                      style={{ alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch' }}
                    >
                      <span className="shop-price" style={{ fontSize: 15 }}>
                        {sumPrices([{ price: product.price, quantity }])}
                        <small>{CURRENCY}</small>
                      </span>
                      <button
                        type="button"
                        className="shop-btn is-2 is-icon is-sm"
                        aria-label={`Remove ${product.name}`}
                        onClick={() => cartStore.remove(product.id)}
                      >
                        <TrashIcon className="shop-icon" aria-hidden />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="shop-drawer-foot">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span className="shop-label">Total</span>
              <span className="shop-price" style={{ fontSize: 24 }}>
                {total}
                <small>{CURRENCY}</small>
              </span>
            </div>
            <p className="shop-small">One invoice for the whole cart. You choose the token in the checkout.</p>
            <button
              type="button"
              className="shop-btn is-wide"
              disabled={lines.length === 0 || !sellable || busy !== null}
              onClick={() =>
                void purchase('cart', () =>
                  checkoutCart(lines.map(({ product, quantity }) => ({ productId: product.id, quantity }))),
                )
              }
            >
              {busy === 'cart' ? 'Issuing the invoice…' : 'Check out'}
              <ArrowRightIcon className="shop-icon" aria-hidden />
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
