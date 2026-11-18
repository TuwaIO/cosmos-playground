import { ArrowRightIcon } from '@tuwaio/nova-icons/24/outline';
import type { Metadata } from 'next';
import Link from 'next/link';

import { JoinButton } from '@/components/club/JoinButton';
import { LiveOrder } from '@/components/orders/LiveOrder';
import { StoreMark } from '@/components/shop/art';
import { SectionBar } from '@/components/ui/SectionBar';
import { Time } from '@/components/ui/Time';
import { CLUB, CURRENCY } from '@/lib/catalog';
import { networkName } from '@/lib/methods';
import { listOrders, type Order } from '@/lib/orders';
import { readMethods } from '@/lib/shop';
import { IN_FLIGHT, SETTLED } from '@/lib/status';
import { readVisitor } from '@/lib/visitor';

export const metadata: Metadata = {
  title: 'Cosmos Club',
  description: 'The membership of Cosmos Club: one payment, no renewals.',
};

const JOINING = [
  {
    where: 'Invoice',
    title: 'Joining issues one invoice',
    text: `${CLUB.price} ${CURRENCY}, like any order of the shop. It has no period and no next invoice.`,
  },
  {
    where: 'Payment',
    title: 'You pay it in the checkout',
    text: 'Nova Payments opens with the same tokens and networks as for a product.',
  },
  {
    where: 'Card',
    title: 'The card appears when it is paid',
    text: 'Once Quasar confirms the payment, this browser is a member. The order is listed with your orders.',
  },
] as const;

/** The orders of the membership of this browser: the paid one makes it a member, an unpaid one is on its way. */
async function readMembership(): Promise<{ member: Order | null; pending: boolean }> {
  const visitorId = await readVisitor();
  if (!visitorId) return { member: null, pending: false };
  try {
    const methods = await readMethods();
    const orders = (await listOrders(visitorId, methods.ok ? methods.methods : [])).filter(
      (order) => order.kind === 'club',
    );
    return {
      member: orders.find((order) => SETTLED.includes(order.status)) ?? null,
      pending: orders.some((order) => IN_FLIGHT.includes(order.status)),
    };
  } catch {
    // Quasar did not answer: the page shows the offer, and joining says why it cannot be done
    return { member: null, pending: false };
  }
}

// Cosmos Club: a membership sold as one payment, with nothing to renew. The page reads whether this browser has a
// paid order of the membership, and shows the offer or the member's card
export default async function ClubPage() {
  const { member, pending } = await readMembership();
  const payment = member?.payment;

  return (
    <>
      <LiveOrder active={!member && pending} />
      <section className="shop-in" style={{ paddingTop: 64, paddingBottom: 64 }}>
        <div className="shop-split" style={{ alignItems: 'center' }}>
          {member ? (
            <div className="shop-stack" style={{ gap: 22 }}>
              <p className="shop-label shop-eyebrow">Cosmos Club</p>
              <div className="shop-row">
                <span className="shop-chip is-ok is-dot">Member</span>
              </div>
              <h1 className="shop-h1">You are a member.</h1>
              <p className="shop-text" style={{ maxWidth: 480, fontSize: 17 }}>
                Paid once
                {payment?.paidAt ? (
                  <>
                    {' '}
                    on <Time iso={payment.paidAt} />
                  </>
                ) : null}
                . Nothing renews, and nothing is charged again.
              </p>
              <div className="shop-row">
                <Link className="shop-btn is-2" href={`/orders/${member.id}`}>
                  View the order
                  <ArrowRightIcon className="shop-icon" aria-hidden />
                </Link>
              </div>
              <p className="shop-small" style={{ maxWidth: 440 }}>
                The membership lives in the cookie of this browser, like your orders.
              </p>
            </div>
          ) : (
            <div className="shop-stack" style={{ gap: 22 }}>
              <p className="shop-label shop-eyebrow">Cosmos Club</p>
              <h1 className="shop-h1">One payment. No renewals.</h1>
              <p className="shop-text" style={{ maxWidth: 480, fontSize: 17 }}>
                Membership is a single invoice. There are no periods, and nothing is charged again.
              </p>
              <div className="shop-row" style={{ gap: 16 }}>
                <span className="shop-price" style={{ fontSize: 34 }}>
                  {CLUB.price}
                  <small style={{ fontSize: 13 }}>{CURRENCY}</small>
                </span>
                <span className="shop-chip">One-time</span>
              </div>
              <div className="shop-row">
                <JoinButton />
              </div>
              <p className="shop-small" style={{ maxWidth: 440 }}>
                A demo membership, paid in test tokens. Nothing real is sold.
              </p>
            </div>
          )}

          <div className={`shop-frame shop-card${member ? ' is-member' : ''}`}>
            <div className="shop-row" style={{ justifyContent: 'space-between' }}>
              <span className="shop-row" style={{ gap: 10 }}>
                <StoreMark style={{ width: 28, height: 28 }} aria-hidden />
                <span className="shop-brand-name" style={{ display: 'inline' }}>
                  Cosmos Club
                </span>
              </span>
              <span className={`shop-chip${member ? ' is-ink' : ''}`}>{member ? 'Member' : 'Not a member yet'}</span>
            </div>
            <p className="shop-card-number" style={member ? undefined : { color: 'var(--shop-label)' }}>
              № {member ? (member.number ?? member.id).slice(-4) : '————'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
              <span>
                <span className="shop-label" style={{ display: 'block' }}>
                  Member since
                </span>
                <span className="shop-mono">{payment?.paidAt ? <Time iso={payment.paidAt} style="short" /> : '—'}</span>
              </span>
              <span style={{ textAlign: 'right' }}>
                <span className="shop-label" style={{ display: 'block' }}>
                  Paid with
                </span>
                <span className="shop-mono">
                  {payment?.symbol && payment.chainId ? `${payment.symbol} · ${networkName(payment.chainId)}` : '—'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionBar index="01" title="What members get" meta={`${CLUB.perks.length} perks · demo`} />
        <ul className="shop-grid is-3 is-steps">
          {CLUB.perks.map(({ title, text }, index) => (
            <li key={title} className="shop-pad shop-stack" style={{ gap: 12 }}>
              <div className="shop-cellhead shop-label">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className={`shop-chip${member ? ' is-ok' : ''}`}>{member ? 'Unlocked' : 'Members only'}</span>
              </div>
              <h3 className="shop-h3">{title}</h3>
              <p className="shop-small">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionBar index="02" title="How joining works" meta="One invoice · the same checkout" />
        <ol className="shop-grid is-3 is-steps">
          {JOINING.map(({ where, title, text }, index) => (
            <li key={where} className="shop-pad shop-stack" style={{ gap: 12, alignItems: 'flex-start' }}>
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

      <section>
        <SectionBar index="03" title="Good to know" meta="Paid once" />
        <div className="shop-split is-flush">
          <dl className="shop-pane shop-pad">
            <div className="shop-kv">
              <dt>Renewals</dt>
              <dd>None</dd>
            </div>
            <div className="shop-kv">
              <dt>Charged again</dt>
              <dd>Never</dd>
            </div>
          </dl>
          <dl className="shop-pad">
            <div className="shop-kv">
              <dt>Where the membership lives</dt>
              <dd>The cookie of this browser</dd>
            </div>
            <div className="shop-kv">
              <dt>The order</dt>
              <dd>
                <Link href="/orders" className="shop-link">
                  Your orders
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
