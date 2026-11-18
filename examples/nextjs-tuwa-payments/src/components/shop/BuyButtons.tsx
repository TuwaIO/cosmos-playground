'use client';

import { buyProduct } from '@/app/actions';
import { useShop } from '@/components/shell/ShopProvider';
import { cartStore } from '@/lib/cartStore';

/**
 * The two ways to buy a product: put it in the cart, or buy it at once. "Buy now" issues the invoice of the product on
 * the server and opens its checkout. Both are off while the shop has no payment methods.
 */
export function BuyButtons({ productId, quantity = 1 }: { productId: string; quantity?: number }) {
  const { sellable, busy, purchase, setCartOpen } = useShop();

  return (
    <div className="shop-prod-acts">
      <button
        type="button"
        className="shop-btn is-2"
        disabled={!sellable}
        onClick={() => {
          cartStore.add(productId, quantity);
          setCartOpen(true);
        }}
      >
        Add to cart
      </button>
      <button
        type="button"
        className="shop-btn"
        disabled={!sellable || busy !== null}
        onClick={() => void purchase(productId, () => buyProduct(productId, quantity))}
      >
        {busy === productId ? 'Issuing…' : 'Buy now'}
      </button>
    </div>
  );
}
