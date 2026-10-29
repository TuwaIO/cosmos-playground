'use client';

import { TokenIcon } from '@tuwaio/nova-core';
import { networkName } from '@tuwaio/nova-payments';

import type { ShopMethod } from '@/lib/methods';

/** A payment method as a token icon, its symbol and its network. */
export function MethodLabel({ method, compact = false }: { method: ShopMethod; compact?: boolean }) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      <span className="h-5 w-5 shrink-0" aria-hidden>
        <TokenIcon symbol={method.symbol} />
      </span>
      <span className="font-semibold">{method.symbol}</span>
      {!compact && <span className="truncate text-[var(--tuwa-text-secondary)]">{networkName(method.chainId)}</span>}
    </span>
  );
}
