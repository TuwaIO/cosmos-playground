'use client';

import { ArrowRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { PaymentCheckout } from '@tuwaio/nova-payments';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  // Paid as the checkout saw it, or as the webhooks told the server
  const [paidHere, setPaidHere] = useState(false);
  const paid = paidHere || Boolean(order?.invoices.some((invoice) => invoice.status === 'paid'));

  // The cart empties once this order is paid
  useEffect(() => {
    if (orderId) cartStore.checkedOut(orderId);
  }, [orderId]);
  useEffect(() => {
    if (paid && orderId) cartStore.paid(orderId);
  }, [paid, orderId]);

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
        eyebrow={`Checkout · order ${shortOrderId(orderId)}`}
        title={paid ? 'Order paid' : `Pay for order ${shortOrderId(orderId)}`}
        description={
          paid
            ? 'The payment is confirmed and the webhook fulfilled the order. The receipt is on the order page.'
            : 'Choose a network and token, then pay from a connected wallet or with a QR code.'
        }
        actions={
          paid && (
            <ButtonLink href={`/orders/${encodeURIComponent(orderId)}`}>
              View order <ArrowRightIcon className="h-4 w-4" aria-hidden />
            </ButtonLink>
          )
        }
      />
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 xl:grid-cols-[minmax(0,800px)_360px]">
        <PaymentCheckout
          token={checkout.token}
          payUrl={checkout.payUrl}
          display="inline"
          // The buyer stays on the paid state: "View order" above opens the order when they choose
          autoReturnSeconds={0}
          // The full width of the column, up to the 760 px of the checkout
          className={FIT}
          onClose={() => {
            setCartOpen(true, '/');
            router.push('/');
          }}
          onPaid={() => {
            setPaidHere(true);
            cartStore.paid(orderId);
            void refresh();
          }}
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

/**
 * The inline checkout and its frame fill the column up to the checkout's own 760 px: Nova Payments fixes both at
 * 760 px from 640 px wide, wider than the column of a tablet. Once Nova sizes them `w-full max-w-[760px]` itself,
 * these classes change nothing.
 */
const FIT = 'w-full! max-w-[760px] [&>div]:w-full!';
