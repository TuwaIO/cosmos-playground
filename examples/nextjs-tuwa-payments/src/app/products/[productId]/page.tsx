import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PRODUCT_ART } from '@/components/shop/art';
import { Methods } from '@/components/shop/Methods';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductPurchase } from '@/components/shop/ProductPurchase';
import { SectionBar } from '@/components/ui/SectionBar';
import { CURRENCY, findProduct, PRODUCTS } from '@/lib/catalog';
import { readMethods } from '@/lib/shop';

type Props = { params: Promise<{ productId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = findProduct((await params).productId);
  return product ? { title: product.name, description: product.description } : {};
}

// The page of one product: its drawing, its facts, how many to buy, and what the shop takes as payment
export default async function ProductPage({ params }: Props) {
  const { productId } = await params;
  const product = findProduct(productId);
  if (!product) notFound();
  const methods = await readMethods();
  const index = PRODUCTS.indexOf(product);
  const Art = PRODUCT_ART[product.id];
  const others = PRODUCTS.filter((item) => item.id !== product.id).slice(0, 3);
  const count = methods.ok ? methods.methods.length : 0;

  return (
    <>
      <section>
        <SectionBar
          first
          index={
            <Link href="/" className="shop-link">
              Shop
            </Link>
          }
          title={product.name}
          meta={`Item ${String(index + 1).padStart(2, '0')} of ${String(PRODUCTS.length).padStart(2, '0')} · ${product.category}`}
        />
        <div className="shop-split is-art is-flush">
          <div className="shop-pane shop-pad">
            <div className="shop-frame shop-hero">
              {Art && <Art className="shop-art" role="img" title={`Pixel drawing of the ${product.name}`} />}
            </div>
          </div>
          <div className="shop-pad shop-stack" style={{ gap: 22 }}>
            <p className="shop-label shop-eyebrow">{product.category}</p>
            <h1 className="shop-h1 is-page">{product.name}</h1>
            <p className="shop-price" style={{ margin: 0, fontSize: 30 }}>
              {product.price}
              <small style={{ fontSize: 13 }}>{CURRENCY}</small>
            </p>
            <p className="shop-text">{product.description}</p>
            <dl
              style={{
                borderTop: '1px solid var(--tuwa-border-primary)',
                borderBottom: '1px solid var(--tuwa-border-primary)',
              }}
            >
              {product.facts.map(([name, value]) => (
                <div key={name} className="shop-kv">
                  <dt>{name}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <ProductPurchase productId={product.id} name={product.name} />
            <p className="shop-small">
              The price is in {CURRENCY}. You pay it in the token you choose, at the rate the checkout locks for 15
              minutes.
            </p>
          </div>
        </div>
      </section>

      <section>
        <SectionBar index="01" title="Pay with" meta={count > 0 ? `${count} methods` : undefined} />
        <Methods methods={methods} variant="row" />
      </section>

      <section>
        <SectionBar
          index="02"
          title="More from the shop"
          meta={
            <Link href="/" className="shop-link">
              All {PRODUCTS.length} items
            </Link>
          }
        />
        <ul className="shop-grid is-3">
          {others.map((item) => (
            <ProductCard key={item.id} product={item} index={PRODUCTS.indexOf(item) + 1} compact />
          ))}
        </ul>
      </section>
    </>
  );
}
