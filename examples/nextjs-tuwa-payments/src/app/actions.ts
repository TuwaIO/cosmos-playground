'use server';

import { QuasarSDKError } from '@tuwaio/quasar-sdk';

import { appConfig } from '@/configs/appConfig';
import { CURRENCY, findPeriod, findProduct, MAX_QUANTITY, PLAN, sumPrices } from '@/lib/catalog';
import { DEMO_METHODS, demoIssueInvoice, demoStartSubscription } from '@/lib/demo/engine';
import { type AcceptedMethods, canChargeAutomatically, NO_AUTO_CHARGE_METHOD, NO_METHODS } from '@/lib/methods';
import { isDemoMode, prepareDemo } from '@/lib/mode';
import { attachInvoice, attachSubscription, createOrder, getOrderBook, removeOrder } from '@/lib/orders';
import type { OrderBook, OrderLine } from '@/lib/orderTypes';
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

/** Where the checkout sends the buyer: the order's confirmation page, or back to the shop. */
function returnLinks(orderId: string) {
  return {
    successUrl: `${appConfig.appUrl}/orders/${encodeURIComponent(orderId)}`,
    cancelUrl: appConfig.appUrl,
  };
}

/**
 * The active payment methods of your Quasar app, in their order: the page shows what the buyer can pay with, or why
 * nothing can be bought yet. Only what the page shows leaves the server.
 */
export async function readAcceptedMethods(): Promise<AcceptedMethods> {
  const pick = ({ id, name, symbol, chainId, assetId, decimals }: (typeof DEMO_METHODS)[number]) => ({
    id,
    name,
    symbol,
    chainId,
    assetId,
    decimals,
  });
  if (isDemoMode()) return { ok: true, methods: DEMO_METHODS.map(pick) };
  try {
    const { data } = await getQuasar().payments.listMethods();
    return { ok: true, methods: data.map(pick) };
  } catch (error) {
    return { ok: false, error: describe(error) };
  }
}

/** The methods to sell with. Quasar issues an invoice even when the app has none, but nobody could pay it. */
async function sellableMethods(): Promise<AcceptedMethods> {
  const accepted = await readAcceptedMethods();
  return accepted.ok && accepted.methods.length === 0 ? { ok: false, error: NO_METHODS } : accepted;
}

/** What the order is called in the lists: the first product, and how many others. */
function titleOf(lines: OrderLine[]): string {
  return lines.length === 1 ? lines[0].name : `${lines[0].name} + ${lines.length - 1} more`;
}

/**
 * Issues one invoice for the lines. The order ID goes to the metadata: the webhooks bring it back, and the idempotency
 * key makes a retry return the same invoice instead of a second one.
 */
async function issueOrder(lines: OrderLine[]): Promise<CheckoutStart> {
  const accepted = await sellableMethods();
  if (!accepted.ok) return accepted;
  const price = sumPrices(lines.map((line) => ({ price: line.unitPrice, quantity: line.quantity })));
  const order = createOrder({
    id: crypto.randomUUID(),
    kind: 'product',
    title: titleOf(lines),
    lines,
    price,
    currency: CURRENCY,
  });
  const lineItems = lines.map((line) => ({
    name: line.name,
    description: findProduct(line.productId)?.description,
    quantity: String(line.quantity),
    unitPrice: line.unitPrice,
  }));
  try {
    if (isDemoMode()) {
      const invoice = demoIssueInvoice({ lines: lineItems, metadata: { orderId: order.id }, ...returnLinks(order.id) });
      attachInvoice(order.id, invoice, { checkoutToken: invoice.checkoutToken, payUrl: null });
      return { ok: true, orderId: order.id, checkoutToken: invoice.checkoutToken ?? '', payUrl: null };
    }
    const { invoice, checkoutToken, payUrl } = await getQuasar().payments.createInvoice(
      {
        currency: CURRENCY,
        lineItems,
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

/** "Buy now": the invoice of one product, paid in the modal checkout. */
export async function buyProduct(productId: string): Promise<CheckoutStart> {
  const product = findProduct(productId);
  if (!product) return { ok: false, error: `Unknown product ${productId}` };
  return issueOrder([{ productId: product.id, name: product.name, quantity: 1, unitPrice: product.price }]);
}

/**
 * Checks out the cart: one invoice with a line per product (the Nova order panel lists them). The page then opens
 * `/checkout?order=…`. The cart comes from the browser, so the products and quantities are checked against the
 * catalog, and the prices are the catalog's.
 */
export async function checkoutCart(
  cart: { productId: string; quantity: number }[],
): Promise<{ ok: true; orderId: string } | { ok: false; error: string }> {
  if (!Array.isArray(cart) || cart.length === 0 || cart.length > 20) return { ok: false, error: 'The cart is empty' };
  const lines: OrderLine[] = [];
  for (const { productId, quantity } of cart) {
    const product = findProduct(String(productId));
    if (!product) return { ok: false, error: `Unknown product ${productId}` };
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return { ok: false, error: `Choose 1 to ${MAX_QUANTITY} of ${product.name}` };
    }
    if (lines.some((line) => line.productId === product.id)) {
      return { ok: false, error: `${product.name} is in the cart twice` };
    }
    lines.push({ productId: product.id, name: product.name, quantity, unitPrice: product.price });
  }
  const result = await issueOrder(lines);
  return result.ok ? { ok: true, orderId: result.orderId } : result;
}

/**
 * Starts the plan for the chosen period. `send_invoice`: the buyer pays every period's invoice. `auto_charge`: after the
 * first payment the checkout offers automatic charges (an ERC-7715 permission of the buyer's wallet), which needs an
 * EVM stablecoin method, "Automatic charges" on in Checkout and the app's Pimlico key in Compliance & gas.
 */
export async function subscribe(collection: 'send_invoice' | 'auto_charge', interval: string): Promise<CheckoutStart> {
  const period = findPeriod(interval);
  if (!period) return { ok: false, error: `Unknown billing period ${interval}` };
  const accepted = await sellableMethods();
  if (!accepted.ok) return accepted;
  // Automatic charges are offered for one method: the first EVM token here; Quasar checks it is a stablecoin
  const preferredMethodId =
    collection === 'auto_charge' ? accepted.methods.find(canChargeAutomatically)?.id : undefined;
  if (collection === 'auto_charge' && !preferredMethodId) return { ok: false, error: NO_AUTO_CHARGE_METHOD };
  const name = `${PLAN.name}, ${period.label.replace(' (testnet)', '').toLowerCase()}`;
  const order = createOrder({
    id: crypto.randomUUID(),
    kind: 'subscription',
    title: `${name}${collection === 'auto_charge' ? ', automatic payments' : ''}`,
    lines: [{ productId: PLAN.id, name: PLAN.name, quantity: 1, unitPrice: period.price }],
    price: period.price,
    currency: CURRENCY,
  });
  const lineItems = [{ name: PLAN.name, description: PLAN.description, unitPrice: period.price }];
  try {
    if (isDemoMode()) {
      const { subscription, invoice } = demoStartSubscription({
        lines: lineItems,
        interval: period.interval,
        cycles: period.cycles,
        collection,
        metadata: { orderId: order.id },
        ...returnLinks(order.id),
      });
      attachSubscription(order.id, subscription);
      attachInvoice(order.id, invoice, { checkoutToken: invoice.checkoutToken, payUrl: null });
      return { ok: true, orderId: order.id, checkoutToken: invoice.checkoutToken ?? '', payUrl: null };
    }
    const { subscription, invoice, checkoutToken, payUrl } = await getQuasar().payments.createSubscription(
      {
        currency: CURRENCY,
        lineItems,
        interval: period.interval,
        cycles: period.cycles,
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

/** The orders and the webhooks the shop received, for the page (the fallback of `GET /api/events`). */
export async function readOrderBook(): Promise<OrderBook> {
  prepareDemo();
  return getOrderBook();
}
