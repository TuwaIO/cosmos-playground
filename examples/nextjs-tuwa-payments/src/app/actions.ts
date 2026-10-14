'use server';

import { QuasarSDKError } from '@tuwaio/quasar-sdk';

import { appConfig } from '@/configs/appConfig';
import { CURRENCY, findProduct, PLAN } from '@/lib/catalog';
import { attachInvoice, attachSubscription, createOrder, getOrderBook, removeOrder } from '@/lib/orders';
import type { OrderBook } from '@/lib/orderTypes';
import { getQuasar } from '@/lib/quasar';

export type CheckoutStart =
  { ok: true; orderId: string; checkoutToken: string; payUrl: string | null } | { ok: false; error: string };

/** The message to show for a refusal of Quasar, with its stable code. */
function describe(error: unknown): string {
  if (error instanceof QuasarSDKError) {
    const reason = typeof error.details?.reason === 'string' ? ` (${error.details.reason})` : '';
    return `${error.code ?? `HTTP ${error.status ?? '?'}`}${reason}: ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
}

/** Where the checkout sends the buyer: back to the shop, with the order highlighted. */
function returnLinks(orderId: string) {
  return {
    successUrl: `${appConfig.appUrl}/?order=${encodeURIComponent(orderId)}`,
    cancelUrl: appConfig.appUrl,
  };
}

/**
 * Issues the invoice of a product. The order ID goes to the metadata: the webhooks bring it back, and the idempotency
 * key makes a retry return the same invoice instead of a second one.
 */
export async function buyProduct(productId: string): Promise<CheckoutStart> {
  const product = findProduct(productId);
  if (!product) return { ok: false, error: `Unknown product ${productId}` };
  const order = createOrder({
    id: crypto.randomUUID(),
    kind: 'product',
    title: product.name,
    price: product.price,
    currency: CURRENCY,
  });
  try {
    const { invoice, checkoutToken, payUrl } = await getQuasar().payments.createInvoice(
      {
        currency: CURRENCY,
        lineItems: [{ name: product.name, description: product.description, quantity: '1', unitPrice: product.price }],
        metadata: { orderId: order.id },
        expiresInMinutes: 60,
        ...returnLinks(order.id),
      },
      { idempotencyKey: `order_${order.id}` },
    );
    attachInvoice(order.id, invoice, { checkoutToken, payUrl });
    if (!checkoutToken) return { ok: false, error: `Invoice ${invoice.number ?? invoice.id} cannot be paid` };
    return { ok: true, orderId: order.id, checkoutToken, payUrl };
  } catch (error) {
    removeOrder(order.id);
    return { ok: false, error: describe(error) };
  }
}

/**
 * Starts the plan. `send_invoice`: the buyer pays every period's invoice. `auto_charge`: after the first payment the
 * checkout offers automatic charges (an ERC-7715 permission of the buyer's wallet), which needs an EVM stablecoin
 * method, "Automatic charges" on in Checkout and the app's Pimlico key in Compliance & gas.
 */
export async function subscribe(collection: 'send_invoice' | 'auto_charge'): Promise<CheckoutStart> {
  const order = createOrder({
    id: crypto.randomUUID(),
    kind: 'subscription',
    title: `${PLAN.name}${collection === 'auto_charge' ? ', automatic payments' : ''}`,
    price: PLAN.price,
    currency: CURRENCY,
  });
  try {
    const quasar = getQuasar();
    // Automatic charges are offered for one method: the first EVM token here; Quasar checks it is a stablecoin
    const preferredMethodId =
      collection === 'auto_charge'
        ? (await quasar.payments.listMethods()).data.find(
            (method) => method.chainId.startsWith('eip155:') && method.assetId?.includes('/erc20:'),
          )?.id
        : undefined;
    const { subscription, invoice, checkoutToken, payUrl } = await quasar.payments.createSubscription(
      {
        currency: CURRENCY,
        lineItems: [{ name: PLAN.name, description: PLAN.description, unitPrice: PLAN.price }],
        interval: PLAN.interval,
        cycles: PLAN.cycles,
        collection,
        preferredMethodId,
        metadata: { orderId: order.id },
        ...returnLinks(order.id),
      },
      { idempotencyKey: `order_${order.id}` },
    );
    attachSubscription(order.id, subscription);
    if (invoice) attachInvoice(order.id, invoice, { checkoutToken, payUrl });
    if (!checkoutToken) return { ok: false, error: `Subscription ${subscription.id} has no invoice to pay yet` };
    return { ok: true, orderId: order.id, checkoutToken, payUrl };
  } catch (error) {
    removeOrder(order.id);
    return { ok: false, error: describe(error) };
  }
}

/** The orders and the webhooks the shop received, for the page. */
export async function readOrderBook(): Promise<OrderBook> {
  return getOrderBook();
}
