'use client';

import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { PaymentCheckout } from '@tuwaio/nova-payments';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { OrderProgress } from '@/components/checkout/OrderProgress';
import { useDemoCheckout, useShop } from '@/components/shell/ShopProvider';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { cartStore } from '@/lib/cartStore';
import { shortOrderId } from '@/lib/status';

/**
 * The checkout page of a cart: the inline Nova Payments checkout, and beside it (under it below 1280 px) the order
 * status the server learns from the webhooks, so paying and fulfilment fit in one frame.
 */
export function CheckoutPage({
  orderId,
  checkout,
}: {
  orderId: string | null;
  checkout: { token: string; payUrl: string | null } | null;
}) {
  const router = useRouter();
  const { book, mode, refresh, setCartOpen } = useShop();
  const order = book.orders.find((item) => item.id === orderId);
  const demoProps = useDemoCheckout(checkout?.token ?? '', mode.demo);

  // The cart empties once this order is paid
  useEffect(() => {
    if (orderId) cartStore.checkedOut(orderId);
  }, [orderId]);

  if (!orderId || !checkout) {
    return (
      <EmptyState
        icon={<ShoppingBagIcon />}
        title="Nothing to pay"
        description="This order is paid, closed or unknown. Fill the cart and check out again."
        action={<ButtonLink href="/">Browse the store</ButtonLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Checkout"
        title={`Pay for order ${shortOrderId(orderId)}`}
        description="Choose a network and token, then pay from a connected wallet or with a QR code."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,800px)_360px]">
        <PaymentCheckout
          token={checkout.token}
          payUrl={checkout.payUrl}
          display="inline"
          onClose={() => {
            setCartOpen(true, '/');
            router.push('/');
          }}
          onPaid={() => void refresh()}
          {...demoProps}
        />
        {order ? (
          <OrderProgress order={order} className="xl:sticky xl:top-[80px]" />
        ) : (
          <Skeleton className="h-[320px] w-full" />
        )}
      </div>
    </div>
  );
}
