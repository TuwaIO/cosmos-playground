'use client';

import { useShop } from '@/components/shell/ShopProvider';

/** Opens the checkout of an order whose invoice is still unpaid. */
export function PayButton({
  orderId,
  token,
  payUrl,
  className = 'shop-btn is-sm is-wide',
}: {
  orderId: string;
  /** The checkout token of the order's invoice. */
  token: string;
  payUrl: string | null;
  className?: string;
}) {
  const { openCheckout } = useShop();
  return (
    <button type="button" className={className} onClick={() => openCheckout({ orderId, token, payUrl })}>
      Pay
    </button>
  );
}
