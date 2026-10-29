'use client';

import { BeakerIcon } from '@heroicons/react/24/outline';
import { networkName } from '@tuwaio/nova-payments';

import { useShop } from '@/components/shell/ShopProvider';
import { isTestChain } from '@/lib/methods';

/** "A, B and C". */
function list(items: string[]): string {
  return items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

/** The thin strip under the header that says the payments are test payments (testnet methods or demo mode). */
export function TestBanner() {
  const { chains, mode } = useShop();
  const testChains = chains.filter(isTestChain);
  if (!mode.demo && (testChains.length === 0 || testChains.length !== chains.length)) return null;
  const networks = list([...new Set(testChains.map(networkName))]);
  return (
    <div className="border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] text-[13px] text-[var(--shop-text-label)]">
      <p className="mx-auto m-0 flex max-w-[1440px] items-start gap-2 px-4 py-2 sm:px-6 xl:px-8">
        <BeakerIcon className="mt-px h-4 w-4 shrink-0" aria-hidden />
        <span>
          <strong className="font-semibold text-[var(--tuwa-text-primary)]">
            {mode.demo ? 'Demo mode' : 'Test mode'}
          </strong>
          {mode.demo ? ` · simulated payments on ${networks}, nothing is sent on-chain` : ` · payments on ${networks}`}
        </span>
      </p>
    </div>
  );
}
