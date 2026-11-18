import { clsx as cn } from 'clsx';

import { MethodIcon } from '@/components/shop/MethodIcon';
import { type AcceptedMethods, networkName, NO_METHODS, popularFirst } from '@/lib/methods';

/**
 * What the buyer can pay with: the payment methods of the shop's Quasar app, the ones marked "Popular" there first.
 * When the app has none, or Quasar did not list them, it says why nothing can be bought yet.
 *
 * - `board`: two columns under an ink head, for the first screen of the shop.
 * - `row`: three columns across the page column.
 */
export function Methods({ methods, variant }: { methods: AcceptedMethods; variant: 'board' | 'row' }) {
  if (!methods.ok || methods.methods.length === 0) {
    return (
      <div
        className="shop-notice"
        style={variant === 'board' ? { border: '1px solid var(--tuwa-border-primary)' } : {}}
      >
        <span className={cn('shop-chip is-dot', methods.ok ? 'is-warn' : 'is-bad')}>
          {methods.ok ? 'Setup' : 'Error'}
        </span>
        <h3 className="shop-h3">{methods.ok ? 'No payment methods yet' : 'Quasar did not list the payment methods'}</h3>
        <p className="shop-small" style={{ overflowWrap: 'anywhere' }}>
          {methods.ok ? (
            NO_METHODS
          ) : (
            <>
              {methods.error}. Check <code className="shop-code">QUASAR_SECRET_KEY</code> and{' '}
              <code className="shop-code">NEXT_PUBLIC_QUASAR_BASE_URL</code> in the environment, then reload this page.
            </>
          )}
        </p>
      </div>
    );
  }

  const list = popularFirst(methods.methods);
  const items = (
    <ul
      className={cn('shop-grid', variant === 'board' ? 'is-2 is-boxed' : 'is-3')}
      aria-label="Accepted payment methods"
    >
      {list.map((method) => (
        <li key={method.id} className={cn('shop-method', variant === 'row' && 'is-wide')}>
          <MethodIcon symbol={method.symbol} />
          <span className="shop-method-name">
            <b>{method.symbol}</b>
            <span className="shop-small">{networkName(method.chainId)}</span>
          </span>
          {method.featured && <span className="shop-chip is-ink">Popular</span>}
        </li>
      ))}
    </ul>
  );

  if (variant === 'row') return items;
  return (
    <div>
      <div className="shop-board-head">
        <span>
          <strong>{list.length}</strong>
          {list.length === 1 ? 'way to pay' : 'ways to pay'}
        </span>
        <span>The shop&apos;s Quasar app</span>
      </div>
      {items}
    </div>
  );
}
