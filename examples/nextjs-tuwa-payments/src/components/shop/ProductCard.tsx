import Link from 'next/link';

import { PRODUCT_ART } from '@/components/shop/art';
import { BuyButtons } from '@/components/shop/BuyButtons';
import { CURRENCY, type Product } from '@/lib/catalog';

/** A product in the grid: its number and shelf, its drawing, its name and price, and the two ways to buy it. */
export function ProductCard({
  product,
  index,
  compact = false,
}: {
  product: Product;
  /** The place of the product in the catalog, from 1. */
  index: number;
  /** Without the description, for the "More from the shop" row. */
  compact?: boolean;
}) {
  const Art = PRODUCT_ART[product.id];
  const href = `/products/${product.id}`;
  return (
    <li className="shop-prod">
      <div className="shop-cellhead shop-label">
        <span>{String(index).padStart(2, '0')}</span>
        <span>{product.category}</span>
      </div>
      <Link href={href} className="shop-frame shop-prod-art" aria-label={product.name} tabIndex={-1}>
        {Art && <Art className="shop-art" aria-hidden />}
      </Link>
      <div className="shop-prod-head">
        <h3 className="shop-h3">
          <Link href={href}>{product.name}</Link>
        </h3>
        <span className="shop-price">
          {product.price}
          <small>{CURRENCY}</small>
        </span>
      </div>
      {!compact && (
        <p className="shop-small" style={{ flex: 1 }}>
          {product.description}
        </p>
      )}
      <BuyButtons productId={product.id} />
    </li>
  );
}
