import { ArrowDownTrayIcon, DocumentTextIcon } from '@tuwaio/nova-icons/24/outline';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LiveOrder } from '@/components/orders/LiveOrder';
import { PayButton } from '@/components/orders/PayButton';
import { RefundControls } from '@/components/orders/RefundControls';
import { StatusChip } from '@/components/orders/StatusChip';
import { PRODUCT_ART } from '@/components/shop/art';
import { SectionBar } from '@/components/ui/SectionBar';
import { Time } from '@/components/ui/Time';
import { PRODUCTS } from '@/lib/catalog';
import { shorten } from '@/lib/format';
import { explorerTxUrl, networkName } from '@/lib/methods';
import { isMerchantMode } from '@/lib/mode';
import { findOrder, orderTimeline, type TimelineEntry, type WaitingRefund, waitingRefunds } from '@/lib/orders';
import { readMethods } from '@/lib/shop';
import { IN_FLIGHT, PAYABLE, SETTLED } from '@/lib/status';
import { readVisitor } from '@/lib/visitor';

export const metadata: Metadata = { title: 'Order' };

/** The drawing of an order line: the product of the catalog with that name, when there is one. */
function artOf(name: string) {
  const product = PRODUCTS.find((item) => item.name === name);
  return product ? PRODUCT_ART[product.id] : undefined;
}

// The page of one order: its lines, its payment, the events of its invoice and its documents. The order is looked up
// among the invoices of this browser's visitor ID, so the address of another visitor's order shows "not found"
export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const visitorId = await readVisitor();
  if (!visitorId) notFound();
  const methods = await readMethods();
  const order = await findOrder(visitorId, orderId, methods.ok ? methods.methods : []);
  if (!order) notFound();

  let timeline: TimelineEntry[] = [];
  try {
    timeline = await orderTimeline(order.invoiceId);
  } catch {
    // The page works without the timeline: it says the events could not be read
  }
  const { payment } = order;
  const settled = SETTLED.includes(order.status);
  const payable = order.checkoutToken && PAYABLE.includes(order.status);
  const txUrl = payment ? explorerTxUrl(payment.chainId, payment.txHash) : null;
  const merchant = isMerchantMode() && settled;
  let waiting: WaitingRefund[] = [];
  if (merchant) {
    try {
      waiting = await waitingRefunds(order.invoiceId);
    } catch {
      // The controls work without the list: a new refund takes the place of one that waits anyway
    }
  }

  return (
    <>
      <LiveOrder active={IN_FLIGHT.includes(order.status)} />
      <section>
        <SectionBar
          first
          index={
            <Link href="/orders" className="shop-link">
              Orders
            </Link>
          }
          title={order.number ?? 'Order'}
          meta={
            <>
              Placed <Time iso={order.issuedAt} />
            </>
          }
        />
        <div
          className="shop-in shop-row"
          style={{ alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px 48px' }}
        >
          <div className="shop-stack" style={{ gap: 16, minWidth: 0 }}>
            <div className="shop-row">
              <StatusChip status={order.status} />
              {settled && <span className="shop-chip is-ink">Fulfilled</span>}
            </div>
            <h1 className="shop-h1 is-page">{order.title}</h1>
          </div>
          <div className="shop-row" style={{ gap: 24, alignItems: 'flex-end' }}>
            <div className="shop-stack" style={{ gap: 4 }}>
              <span className="shop-label">Total</span>
              <span className="shop-price" style={{ fontSize: 34 }}>
                {order.total}
                <small style={{ fontSize: 13 }}>{order.currency}</small>
              </span>
            </div>
            {payable && order.checkoutToken && (
              <PayButton orderId={order.id} token={order.checkoutToken} payUrl={order.payUrl} className="shop-btn" />
            )}
          </div>
        </div>
      </section>

      {merchant && (
        <section>
          <SectionBar index="//" title="Merchant controls" meta="Merchant mode: on your own machine only" />
          <div
            className="shop-in shop-row"
            style={{ justifyContent: 'space-between', gap: '16px 32px', paddingTop: 24, paddingBottom: 24 }}
          >
            <p className="shop-small" style={{ flex: '1 1 320px', maxWidth: 620 }}>
              A refund goes from the merchant&apos;s connected wallet back to the wallet that paid. Quasar follows the
              transaction and issues the credit note. A refund asked for and not sent keeps its amount: withdraw it, or
              start a new one, which takes its place.
            </p>
            <RefundControls
              invoiceId={order.invoiceId}
              number={order.number}
              currency={order.currency}
              waiting={waiting}
            />
          </div>
        </section>
      )}

      <section>
        <SectionBar
          index="01"
          title="Items"
          meta={`${order.lines.length} ${order.lines.length === 1 ? 'line' : 'lines'} · one invoice`}
        />
        <ul>
          {order.lines.map((line) => {
            const Art = artOf(line.name);
            return (
              <li key={line.name} className="shop-line is-wide">
                <div className="shop-frame">{Art && <Art className="shop-art" aria-hidden />}</div>
                <div style={{ minWidth: 0 }}>
                  <h3 className="shop-h3">{line.name}</h3>
                  <span className="shop-label">
                    {Number(line.quantity)} × {line.unitPrice} {order.currency}
                  </span>
                </div>
                <span className="shop-price" style={{ fontSize: 15 }}>
                  {line.net}
                  <small>{order.currency}</small>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <SectionBar index="02" title="Payment and timeline" meta="From the invoice in Quasar" />
        <div className="shop-split is-flush">
          <div className="shop-pane shop-pad">
            <p className="shop-label" style={{ marginBottom: 8 }}>
              Payment
            </p>
            {payment ? (
              <dl>
                <div className="shop-kv">
                  <dt>Method</dt>
                  <dd>
                    {payment.symbol ? (
                      <>
                        <b className="shop-mono">{payment.symbol}</b>
                        {payment.chainId ? ` on ${networkName(payment.chainId)}` : ''}
                      </>
                    ) : (
                      (payment.chainId && networkName(payment.chainId)) || '—'
                    )}
                  </dd>
                </div>
                {payment.amountPaid && (
                  <div className="shop-kv">
                    <dt>Amount paid</dt>
                    <dd className="shop-mono">
                      {payment.amountPaid} {payment.symbol}
                    </dd>
                  </div>
                )}
                <div className="shop-kv">
                  <dt>Transaction</dt>
                  <dd className="shop-mono">
                    {txUrl ? (
                      <a href={txUrl} target="_blank" rel="noreferrer" className="shop-link">
                        {shorten(payment.txHash)}
                      </a>
                    ) : (
                      shorten(payment.txHash)
                    )}
                  </dd>
                </div>
                {payment.payer && (
                  <div className="shop-kv">
                    <dt>Paid from</dt>
                    <dd className="shop-mono">{shorten(payment.payer)}</dd>
                  </div>
                )}
                {payment.paidAt && (
                  <div className="shop-kv">
                    <dt>Paid at</dt>
                    <dd>
                      <Time iso={payment.paidAt} />
                    </dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="shop-small">
                {payable ? 'Not paid yet. The invoice waits for its payment.' : 'This order has no payment.'}
              </p>
            )}
          </div>
          <div className="shop-pad">
            <p className="shop-label" style={{ marginBottom: 8 }}>
              Timeline
            </p>
            {timeline.length === 0 ? (
              <p className="shop-small">The events of the invoice could not be read.</p>
            ) : (
              <ol>
                {timeline.map((entry) => (
                  <li
                    key={entry.id}
                    className="shop-kv"
                    style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}
                  >
                    <Time iso={entry.at} style="clock" className="shop-mono shop-small shop-timeline-time" />
                    <span style={{ minWidth: 0 }}>
                      <b className="shop-mono" style={{ display: 'block', fontSize: 13 }}>
                        {entry.type}
                      </b>
                      {entry.text && <span className="shop-small">{entry.text}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>

      <section>
        <SectionBar index="03" title="Documents" meta="PDF, issued by Quasar" />
        <ul className="shop-grid is-2">
          <li className="shop-pad shop-row" style={{ gap: 14, flexWrap: 'nowrap' }}>
            <DocumentTextIcon style={{ width: 24, height: 24, flex: 'none' }} aria-hidden />
            <span style={{ flex: 1, minWidth: 0 }}>
              <b className="shop-mono" style={{ display: 'block', fontSize: 14 }}>
                Invoice
              </b>
              <span className="shop-label">{order.number ?? 'No number yet'}</span>
            </span>
            <a className="shop-btn is-2 is-sm" href={`/api/orders/${order.id}/documents/invoice`}>
              <ArrowDownTrayIcon className="shop-icon" aria-hidden />
              Download
            </a>
          </li>
          <li className="shop-pad shop-row" style={{ gap: 14, flexWrap: 'nowrap' }}>
            <DocumentTextIcon style={{ width: 24, height: 24, flex: 'none' }} aria-hidden />
            <span style={{ flex: 1, minWidth: 0 }}>
              <b className="shop-mono" style={{ display: 'block', fontSize: 14 }}>
                Receipt
              </b>
              <span className="shop-label">
                {order.hasReceipt ? 'Issued when it was paid' : 'Issued once it is paid'}
              </span>
            </span>
            {order.hasReceipt ? (
              <a className="shop-btn is-2 is-sm" href={`/api/orders/${order.id}/documents/receipt`}>
                <ArrowDownTrayIcon className="shop-icon" aria-hidden />
                Download
              </a>
            ) : (
              <span className="shop-chip">Not yet</span>
            )}
          </li>
        </ul>
      </section>
    </>
  );
}
