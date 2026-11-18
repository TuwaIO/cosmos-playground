import { ArrowDownIcon, ArrowRightIcon } from '@tuwaio/nova-icons/24/outline';
import Link from 'next/link';

import { Methods } from '@/components/shop/Methods';
import { ProductCard } from '@/components/shop/ProductCard';
import { SectionBar } from '@/components/ui/SectionBar';
import { CLUB, CURRENCY, PRODUCTS } from '@/lib/catalog';
import { readMethods } from '@/lib/shop';

const STEPS = [
  {
    where: 'Server',
    title: 'The server issues the invoice',
    text: 'A Server Action calls Quasar with the secret key. Only the checkout token reaches the browser.',
    code: 'quasar.payments.createInvoice()',
  },
  {
    where: 'Browser',
    title: 'Nova Payments takes the payment',
    text: 'The checkout locks the price for 15 minutes and pays from a connected wallet, or with a QR code.',
    code: '<PaymentCheckout token />',
  },
  {
    where: 'Webhook',
    title: 'A webhook fulfils the order',
    text: 'Quasar checks the payment on-chain and sends invoice.paid. The shop verifies the signature and fulfils the order once.',
    code: 'verifyWebhook()',
  },
] as const;

// The shop: what it is and how to pay, the products, the Club, and how a purchase works. The methods are read on every
// visit, so a method added in the Quasar dashboard shows after a reload
export default async function ShopPage() {
  const methods = await readMethods();

  return (
    <>
      <section className="shop-in" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="shop-split" style={{ alignItems: 'center' }}>
          <div className="shop-stack" style={{ gap: 22 }}>
            <p className="shop-label shop-eyebrow">Demo shop on Quasar Payments</p>
            <h1 className="shop-h1">Cosmos Store</h1>
            <p className="shop-text" style={{ maxWidth: 500, fontSize: 17 }}>
              A demo shop that sells with Quasar Payments. Each order is one invoice, paid in test tokens from an EVM or
              Solana wallet, or with a QR code.
            </p>
            <div className="shop-row" style={{ marginTop: 6 }}>
              <a className="shop-btn" href="#products">
                Browse products
                <ArrowDownIcon className="shop-icon" aria-hidden />
              </a>
              <Link className="shop-btn is-2" href="/club">
                Cosmos Club
                <ArrowRightIcon className="shop-icon" aria-hidden />
              </Link>
            </div>
          </div>
          <Methods methods={methods} variant="board" />
        </div>
      </section>

      <section id="products" style={{ scrollMarginTop: 72 }}>
        <SectionBar index="01" title="Products" meta={`${PRODUCTS.length} items · prices in ${CURRENCY}`} />
        <ul className="shop-grid is-3">
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index + 1} />
          ))}
        </ul>
      </section>

      <section>
        <SectionBar index="02" title="Cosmos Club" meta="One payment · no renewals" />
        <div className="shop-in shop-row" style={{ justifyContent: 'space-between', gap: '24px 48px' }}>
          <div className="shop-stack" style={{ flex: '1 1 360px', gap: 12 }}>
            <h2 className="shop-h2">One payment. No renewals.</h2>
            <p className="shop-text" style={{ maxWidth: 520 }}>
              Membership is a single invoice of {CLUB.price} {CURRENCY}. Nothing is charged again.
            </p>
          </div>
          <Link className="shop-btn is-2" href="/club">
            See the Club
            <ArrowRightIcon className="shop-icon" aria-hidden />
          </Link>
        </div>
      </section>

      <section>
        <SectionBar index="03" title="How a purchase works" meta="The template in three steps" />
        <ol className="shop-grid is-3 is-steps">
          {STEPS.map(({ where, title, text, code }, index) => (
            <li key={where} className="shop-pad shop-stack" style={{ gap: 12, alignItems: 'flex-start' }}>
              <div className="shop-row">
                <span className="shop-num">{String(index + 1).padStart(2, '0')}</span>
                <span className="shop-label">{where}</span>
              </div>
              <h3 className="shop-h3">{title}</h3>
              <p className="shop-small" style={{ flex: 1 }}>
                {text}
              </p>
              <code className="shop-code">{code}</code>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
