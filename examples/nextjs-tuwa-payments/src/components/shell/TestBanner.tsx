'use client';

import { ArrowPathIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { networkName } from '@tuwaio/nova-payments';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { resetDemoStore } from '@/app/demoActions';
import { useShop } from '@/components/shell/ShopProvider';
import { Button, Spinner } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cartStore } from '@/lib/cartStore';
import { isTestChain } from '@/lib/methods';

/** "A, B and C". */
function list(items: string[]): string {
  return items.length <= 1 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

/** "on-chain" that never breaks at its hyphen. */
const ON_CHAIN = 'on‑chain';

/** Demo mode: forgets the orders and events of the takes so far and seeds the sample orders again. */
function ResetDemo() {
  const { refresh } = useShop();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const reset = () =>
    startTransition(async () => {
      await resetDemoStore();
      cartStore.clear();
      // An order of an earlier take is gone: start again from the store
      if (pathname.startsWith('/orders/') || pathname.startsWith('/checkout')) router.push('/');
      await refresh();
    });
  return (
    <Button variant="ghost" size="sm" onClick={reset} disabled={pending} className="-my-1 ml-auto shrink-0 sm:ml-0">
      {pending ? <Spinner /> : <ArrowPathIcon className="h-4 w-4" aria-hidden />}
      Reset demo
    </Button>
  );
}

/**
 * The thin strip under the header: that the payments are test payments (testnet methods or demo mode), that merchant
 * mode is on, and in demo mode the reset of the demo data.
 */
export function TestBanner() {
  const { chains, mode } = useShop();
  const testChains = chains.filter(isTestChain);
  const testMode = testChains.length > 0 && testChains.length === chains.length;
  if (!mode.demo && !testMode && !mode.merchant) return null;
  const networks = list([...new Set(testChains.map(networkName))]);
  return (
    <div className="border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] text-[13px] text-[var(--shop-text-label)]">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2 sm:flex-nowrap sm:px-6 xl:px-8">
        <p className="m-0 flex min-w-0 flex-[1_1_100%] items-start gap-2 sm:flex-1">
          <BeakerIcon className="mt-px h-4 w-4 shrink-0" aria-hidden />
          {mode.demo || testMode ? (
            <span className="min-w-0">
              <strong className="font-semibold text-[var(--tuwa-text-primary)]">
                {mode.demo ? 'Demo mode' : 'Test mode'}
              </strong>
              {mode.demo ? (
                <>
                  {' · simulated payments'}
                  <span className="hidden md:inline"> on {networks}</span>, nothing is sent {ON_CHAIN}
                </>
              ) : (
                ` · payments on ${networks}`
              )}
            </span>
          ) : (
            <span className="min-w-0">Live payments</span>
          )}
        </p>
        {mode.merchant && <StatusBadge label="Merchant mode" tone="pending" className="ml-6 shrink-0 sm:ml-0" />}
        {mode.demo && <ResetDemo />}
      </div>
    </div>
  );
}
