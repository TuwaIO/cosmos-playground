'use client';

import { TokenIcon } from '@tuwaio/nova-core';

/** The icon of a method's token, as the checkout of Nova Payments shows it. */
export function MethodIcon({ symbol }: { symbol: string }) {
  return (
    <span className="shop-method-icon" aria-hidden>
      <TokenIcon symbol={symbol} />
    </span>
  );
}
