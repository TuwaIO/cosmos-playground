'use client';

import { cn } from '@tuwaio/nova-core';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import { CartDrawer } from '@/components/shell/CartDrawer';
import { EventsDrawer, EventsRail } from '@/components/shell/EventsRail';
import { Header } from '@/components/shell/Header';
import { TestBanner } from '@/components/shell/TestBanner';

/**
 * The frame of every page: the header, the test-mode strip, and the content with the live events rail on its right
 * from 1280 px (the checkout page shows its order timeline there, the Events page is the log itself).
 */
export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const withRail = !pathname.startsWith('/checkout') && !pathname.startsWith('/events');
  return (
    <>
      <Header />
      <TestBanner />
      <div
        className={cn(
          'mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 xl:px-8',
          withRail && 'xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-6',
        )}
      >
        <main id="main" className="min-w-0">
          {children}
        </main>
        {withRail && <EventsRail />}
      </div>
      <CartDrawer />
      <EventsDrawer />
    </>
  );
}
