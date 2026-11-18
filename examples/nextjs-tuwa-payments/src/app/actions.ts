'use server';

import { appConfig } from '@/configs/appConfig';
import { CLUB, CURRENCY, findProduct, MAX_QUANTITY } from '@/lib/catalog';
import { NO_METHODS } from '@/lib/methods';
import { listOrders, type OrderKind } from '@/lib/orders';
import { getQuasar } from '@/lib/quasar';
import { describeError, readMethods } from '@/lib/shop';
import { PAYABLE, SETTLED } from '@/lib/status';
import { ensureVisitor, readVisitor } from '@/lib/visitor';

/** What a purchase returns to the page: the order and the checkout token of its invoice, or why it was not issued. */
export type CheckoutStart =
  { ok: true; orderId: string; checkoutToken: string; payUrl: string | null } | { ok: false; error: string };

type Line = { name: string; description?: string; quantity: number; unitPrice: string };

/**
 * Issues one invoice for the lines. The buyer's external ID is the visitor ID of the browser, so the shop lists the
 * order for this browser only; the order ID goes to the metadata, and the webhooks bring it back. The idempotency key
 * makes a repeated request for the same order return the same invoice instead of a second one.
 */
async function issueOrder(kind: OrderKind, lines: Line[]): Promise<CheckoutStart> {
  const accepted = await readMethods();
  if (!accepted.ok) return accepted;
  // Quasar issues an invoice even when the app has no methods, but nobody could pay it
  if (accepted.methods.length === 0) return { ok: false, error: NO_METHODS };
  try {
    const visitorId = await ensureVisitor();
    const orderId = crypto.randomUUID();
    const { invoice, checkoutToken, payUrl } = await getQuasar().payments.createInvoice(
      {
        currency: CURRENCY,
        lineItems: lines.map(({ name, description, quantity, unitPrice }) => ({
          name,
          description,
          quantity: String(quantity),
          unitPrice,
        })),
        buyer: { externalId: visitorId },
        metadata: { orderId, kind },
        expiresInMinutes: 60,
        // Where the checkout sends the buyer: the page of the order, or back to the shop
        successUrl: `${appConfig.appUrl}/orders/${orderId}`,
        cancelUrl: appConfig.appUrl,
      },
      { idempotencyKey: `order_${orderId}` },
    );
    if (!checkoutToken) return { ok: false, error: `Invoice ${invoice.number ?? invoice.id} cannot be paid` };
    return { ok: true, orderId, checkoutToken, payUrl };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/** A line of the catalog for a product and a quantity, or what is wrong with them. The prices are the catalog's. */
function lineOf(productId: unknown, quantity: unknown): Line | string {
  const product = findProduct(String(productId));
  if (!product) return `Unknown product ${String(productId)}`;
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    return `Choose 1 to ${MAX_QUANTITY} of ${product.name}`;
  }
  return { name: product.name, description: product.description, quantity, unitPrice: product.price };
}

/** "Buy now": the invoice of one product, paid in the checkout at once. */
export async function buyProduct(productId: string, quantity = 1): Promise<CheckoutStart> {
  const line = lineOf(productId, quantity);
  return typeof line === 'string' ? { ok: false, error: line } : issueOrder('product', [line]);
}

/**
 * Checks out the cart: one invoice with a line per product. The cart comes from the browser, so the products and
 * quantities are checked against the catalog.
 */
export async function checkoutCart(cart: { productId: string; quantity: number }[]): Promise<CheckoutStart> {
  if (!Array.isArray(cart) || cart.length === 0 || cart.length > 20) return { ok: false, error: 'The cart is empty' };
  if (new Set(cart.map((item) => item?.productId)).size !== cart.length) {
    return { ok: false, error: 'A product is in the cart twice' };
  }
  const lines: Line[] = [];
  for (const item of cart) {
    const line = lineOf(item?.productId, item?.quantity);
    if (typeof line === 'string') return { ok: false, error: line };
    lines.push(line);
  }
  return issueOrder('cart', lines);
}

/**
 * Joins Cosmos Club: one invoice, paid once. A browser that is a member already is told so, and one with an unpaid
 * invoice of the membership gets that invoice again instead of a second one.
 */
export async function joinClub(): Promise<CheckoutStart> {
  try {
    const visitorId = await readVisitor();
    const memberships = visitorId ? (await listOrders(visitorId)).filter((order) => order.kind === 'club') : [];
    if (memberships.some((order) => SETTLED.includes(order.status))) {
      return { ok: false, error: 'This browser is a member of Cosmos Club already' };
    }
    const unpaid = memberships.find((order) => PAYABLE.includes(order.status) && order.checkoutToken);
    if (unpaid?.checkoutToken) {
      return { ok: true, orderId: unpaid.id, checkoutToken: unpaid.checkoutToken, payUrl: unpaid.payUrl };
    }
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
  return issueOrder('club', [{ name: CLUB.name, description: CLUB.description, quantity: 1, unitPrice: CLUB.price }]);
}
