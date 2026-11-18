import { ShoppingBagIcon } from '@tuwaio/nova-icons/24/outline';
import type { Metadata } from 'next';
import Link from 'next/link';

import { LiveOrder } from '@/components/orders/LiveOrder';
import { PayButton } from '@/components/orders/PayButton';
import { StatusChip } from '@/components/orders/StatusChip';
import { SectionBar } from '@/components/ui/SectionBar';
import { Time } from '@/components/ui/Time';
import { listOrders, type Order } from '@/lib/orders';
import { describeError } from '@/lib/shop';
import { IN_FLIGHT, PAYABLE } from '@/lib/status';
import { readVisitor } from '@/lib/visitor';

export const metadata: Metadata = { title: 'Your orders' };

const KEPT = [
  {
    where: 'Cookie',
    title: 'A random ID, no account',
    text: 'The first order sets an HttpOnly cookie with a random ID. It holds nothing about you.',
  },
  {
    where: 'Quasar',
    title: 'The invoices carry that ID',
    text: "Each invoice is issued with the ID as the buyer's external ID, and this page lists the invoices that have it.",
  },
  {
    where: 'Clear',
    title: 'Clearing cookies hides them',
    text: "The orders stay in the shop's Quasar app. This browser no longer shows them.",
  },
] as const;

/** The orders of this browser, or why Quasar did not list them. */
async function readOrders(): Promise<{ orders: Order[]; error: string | null }> {
  const visitorId = await readVisitor();
  if (!visitorId) return { orders: [], error: null };
  try {
    return { orders: await listOrders(visitorId), error: null };
  } catch (error) {
    return { orders: [], error: describeError(error) };
  }
}

// The orders of this browser: the invoices of the shop's Quasar app whose buyer has the visitor ID of the cookie.
// Nobody else's orders are listed, and the shop has no page that lists them all
export default async function OrdersPage() {
  const { orders, error } = await readOrders();

  return (
    <>
      <LiveOrder active={orders.some((order) => IN_FLIGHT.includes(order.status))} everyMs={8000} />
      <section className="shop-in shop-stack" style={{ gap: 16 }}>
        <p className="shop-label shop-eyebrow">This browser only</p>
        <h1 className="shop-h1 is-page">Your orders</h1>
        <p className="shop-text" style={{ maxWidth: 560 }}>
          The shop keeps no accounts. A cookie ties these orders to this browser, and other visitors do not see them.
        </p>
      </section>

      <section>
        <SectionBar
          index="01"
          title="Orders"
          meta={
            orders.length > 0
              ? `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} · newest first`
              : 'None yet'
          }
        />
        {error && (
          <div role="alert" className="shop-notice">
            <span className="shop-chip is-bad is-dot">Error</span>
            <h2 className="shop-h3">Quasar did not list the orders</h2>
            <p className="shop-small" style={{ overflowWrap: 'anywhere' }}>
              {error}
            </p>
          </div>
        )}
        {orders.length === 0 && !error ? (
          <div
            className="shop-in shop-stack"
            style={{ alignItems: 'center', gap: 16, padding: '64px 16px', textAlign: 'center' }}
          >
            <ShoppingBagIcon
              motion="assemble"
              style={{ width: 48, height: 48, color: 'var(--shop-label)' }}
              aria-hidden
            />
            <h2 className="shop-h2">No orders yet</h2>
            <p className="shop-text" style={{ maxWidth: 420 }}>
              Orders you place in this browser show up here.
            </p>
            <Link className="shop-btn" href="/">
              Browse products
            </Link>
          </div>
        ) : (
          orders.length > 0 && (
            <>
              <div className="shop-order is-head shop-hide-phone" aria-hidden>
                <span className="shop-label">Order</span>
                <span className="shop-label">Status</span>
                <span className="shop-label">Total</span>
                <span className="shop-label is-date">Placed</span>
                <span />
              </div>
              <ul>
                {orders.map((order) => (
                  <li key={order.id} className="shop-order">
                    <div style={{ minWidth: 0 }}>
                      <h2 className="shop-h3">
                        <Link href={`/orders/${order.id}`}>{order.title}</Link>
                      </h2>
                      <span className="shop-label">{order.number ?? 'No number yet'}</span>
                    </div>
                    <div>
                      <StatusChip status={order.status} />
                    </div>
                    <span className="shop-price" style={{ fontSize: 15 }}>
                      {order.total}
                      <small>{order.currency}</small>
                    </span>
                    <Time iso={order.issuedAt} style="short" className="shop-small is-date" />
                    <div className="is-act">
                      {order.checkoutToken && PAYABLE.includes(order.status) ? (
                        <PayButton orderId={order.id} token={order.checkoutToken} payUrl={order.payUrl} />
                      ) : (
                        <Link className="shop-btn is-2 is-sm is-wide" href={`/orders/${order.id}`}>
                          View
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )
        )}
      </section>

      <section>
        <SectionBar index="02" title="How orders are kept" meta="No database in the template" />
        <ol className="shop-grid is-3 is-steps">
          {KEPT.map(({ where, title, text }, index) => (
            <li key={where} className="shop-pad shop-stack" style={{ gap: 10 }}>
              <div className="shop-row">
                <span className="shop-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="shop-label">{where}</span>
              </div>
              <h3 className="shop-h3">{title}</h3>
              <p className="shop-small">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
