'use client';

import { useState } from 'react';

import { BuyButtons } from '@/components/shop/BuyButtons';
import { Quantity } from '@/components/ui/Quantity';

/** The purchase of the product page: how many, then the cart or "Buy now". */
export function ProductPurchase({ productId, name }: { productId: string; name: string }) {
  const [quantity, setQuantity] = useState(1);
  return (
    <>
      <div className="shop-row" style={{ gap: 16 }}>
        <span className="shop-label">Quantity</span>
        <Quantity label={`Quantity of ${name}`} value={quantity} onChange={setQuantity} />
      </div>
      <BuyButtons productId={productId} quantity={quantity} />
    </>
  );
}
