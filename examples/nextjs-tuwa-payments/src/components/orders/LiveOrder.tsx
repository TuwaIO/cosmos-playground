'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Keeps a page that shows an unsettled order up to date: it asks the server for the page again every few seconds while
 * the order may still change (unpaid, or its payment is being confirmed), and stops once it is settled.
 */
export function LiveOrder({ active, everyMs = 4000 }: { active: boolean; everyMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      // A hidden tab reads nothing: it catches up when the visitor comes back
      if (document.visibilityState === 'visible') router.refresh();
    }, everyMs);
    return () => clearInterval(timer);
  }, [active, everyMs, router]);
  return null;
}
