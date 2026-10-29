import { CheckoutPage } from '@/components/checkout/CheckoutPage';
import { prepareDemo } from '@/lib/mode';
import { findOrder } from '@/lib/orders';
import { PAYABLE } from '@/lib/status';

export const metadata = { title: 'Checkout · Cosmos Store' };

// The checkout of a cart: `checkoutCart` issued one invoice for it and sent the buyer here with the order ID. The page
// reads the order on the server and passes only the checkout token (and the payment page) to the browser.
export default async function Checkout({ searchParams }: { searchParams: Promise<{ order?: string | string[] }> }) {
  const { order: orderId } = await searchParams;
  prepareDemo();
  const order = typeof orderId === 'string' ? findOrder(orderId) : undefined;
  const invoice = order?.invoices.find(
    (item) => item.checkoutToken && [...PAYABLE, 'processing'].includes(item.status),
  );
  return (
    <CheckoutPage
      orderId={order?.id ?? null}
      checkout={invoice?.checkoutToken ? { token: invoice.checkoutToken, payUrl: invoice.payUrl } : null}
    />
  );
}
