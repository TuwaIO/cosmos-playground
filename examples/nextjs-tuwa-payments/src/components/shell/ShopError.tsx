'use client';

import { XMarkIcon } from '@tuwaio/nova-icons/24/outline';

import { useShop } from '@/components/shell/ShopProvider';

/** Why the last purchase was not issued, under the header, until the visitor closes it or buys again. */
export function ShopError() {
  const { error, dismissError } = useShop();
  if (!error) return null;
  return (
    <div className="shop-page">
      <div className="shop-col">
        <div
          role="alert"
          className="shop-notice"
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div className="shop-stack" style={{ gap: 8, alignItems: 'flex-start', minWidth: 0 }}>
            <span className="shop-chip is-bad is-dot">The invoice was not issued</span>
            <p className="shop-small" style={{ overflowWrap: 'anywhere' }}>
              {error}
            </p>
          </div>
          <button type="button" className="shop-btn is-2 is-icon is-sm" aria-label="Close" onClick={dismissError}>
            <XMarkIcon className="shop-icon" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
