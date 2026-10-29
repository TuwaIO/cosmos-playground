'use client';

import { PaymentCheckout } from '@tuwaio/nova-payments';
import { MotionConfig } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { readOrderBook } from '@/app/actions';
import { demoCheckoutApi } from '@/lib/demo/checkoutApi';
import type { ShopMode } from '@/lib/mode';
import type { OrderBook, WebhookLogEntry } from '@/lib/orderTypes';

/** How the page follows the order book: the event stream, or reads every 3 s after the stream failed. */
export type LiveState = 'connecting' | 'live' | 'polling';

type OpenCheckout = { token: string; payUrl: string | null };

type ShopContextValue = {
  mode: ShopMode;
  /** CAIP-2 chains of the accepted methods, for the test-mode banner. */
  chains: string[];
  book: OrderBook;
  live: LiveState;
  refresh: () => Promise<void>;
  cartOpen: boolean;
  /** Opens or closes the cart on this page, or opens it on another (`on`), which the page then navigates to. */
  setCartOpen: (open: boolean, on?: string) => void;
  eventsOpen: boolean;
  setEventsOpen: (open: boolean) => void;
  /** Opens the modal checkout of an invoice (a sheet from the bottom under 640 px). */
  openCheckout: (checkout: OpenCheckout) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop(): ShopContextValue {
  const value = useContext(ShopContext);
  if (!value) throw new Error('useShop needs ShopProvider');
  return value;
}

/** What screen readers hear about a new event: fulfilment and refunds only, not every event. */
function announcementOf(entry: WebhookLogEntry): string | null {
  if (!entry.firstDelivery || !entry.orderTitle) return null;
  if (entry.type === 'invoice.paid') return `Order ${entry.orderTitle} paid`;
  if (entry.type === 'refund.confirmed') return `Refund of ${entry.orderTitle} confirmed`;
  return null;
}

/**
 * The state the pages share: the live order book (Server-Sent Events from `/api/events`, else a read every 3 s), the
 * cart and events drawers, and the modal checkout of `@tuwaio/nova-payments`.
 */
export function ShopProvider({
  mode,
  chains,
  initialBook,
  children,
}: {
  mode: ShopMode;
  chains: string[];
  initialBook: OrderBook;
  children: ReactNode;
}) {
  const [book, setBook] = useState(initialBook);
  const [live, setLive] = useState<LiveState>('connecting');
  const [announcement, setAnnouncement] = useState('');
  // The drawers are open on the page they were opened on: another page closes them
  const pathname = usePathname();
  const [cartOpenOn, setCartOpenOn] = useState<string | null>(null);
  const [eventsOpenOn, setEventsOpenOn] = useState<string | null>(null);
  const cartOpen = cartOpenOn === pathname;
  const eventsOpen = eventsOpenOn === pathname;
  const setCartOpen = useCallback(
    (open: boolean, on?: string) => setCartOpenOn(open ? (on ?? pathname) : null),
    [pathname],
  );
  const setEventsOpen = useCallback((open: boolean) => setEventsOpenOn(open ? pathname : null), [pathname]);
  const [checkout, setCheckout] = useState<OpenCheckout | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const seen = useRef(new Set(initialBook.webhooks.map((entry) => `${entry.id}:${entry.receivedAt}`)));

  const applyBook = useCallback((next: OrderBook) => {
    const fresh = next.webhooks.filter((entry) => !seen.current.has(`${entry.id}:${entry.receivedAt}`));
    fresh.forEach((entry) => seen.current.add(`${entry.id}:${entry.receivedAt}`));
    const message = fresh.map(announcementOf).find(Boolean);
    if (message) setAnnouncement(message);
    setBook(next);
  }, []);

  const refresh = useCallback(async () => {
    try {
      applyBook(await readOrderBook());
    } catch (error) {
      console.warn('[Shop] Could not read the orders', error);
    }
  }, [applyBook]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    const poll = () => {
      setLive('polling');
      void refresh();
      timer ??= setInterval(() => void refresh(), 3000);
    };
    const source = new EventSource('/api/events');
    source.addEventListener('book', (event) => {
      try {
        applyBook(JSON.parse(event.data) as OrderBook);
        setLive('live');
      } catch {
        // A broken message: the next one brings the whole book again
      }
    });
    source.onerror = () => {
      source.close();
      poll();
    };
    return () => {
      source.close();
      if (timer) clearInterval(timer);
    };
  }, [applyBook, refresh]);

  const openCheckout = useCallback((next: OpenCheckout) => {
    setCheckout(next);
    setCheckoutOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      chains,
      book,
      live,
      refresh,
      cartOpen,
      setCartOpen,
      eventsOpen,
      setEventsOpen,
      openCheckout,
    }),
    [mode, chains, book, live, refresh, cartOpen, setCartOpen, eventsOpen, setEventsOpen, openCheckout],
  );

  return (
    <ShopContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        {children}
        {checkout && (
          <CheckoutModal
            // A new invoice is a new checkout
            key={checkout.token}
            checkout={checkout}
            demo={mode.demo}
            open={checkoutOpen}
            onOpenChange={setCheckoutOpen}
            onPaid={() => void refresh()}
          />
        )}
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </MotionConfig>
    </ShopContext.Provider>
  );
}

/** The checkout props of demo mode: the simulation's API, read every 2 s. */
export function useDemoCheckout(token: string, demo: boolean) {
  return useMemo(() => (demo ? { api: demoCheckoutApi(token), EventSource: null, pollMs: 2000 } : {}), [token, demo]);
}

function CheckoutModal({
  checkout,
  demo,
  open,
  onOpenChange,
  onPaid,
}: {
  checkout: OpenCheckout;
  demo: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid: () => void;
}) {
  const demoProps = useDemoCheckout(checkout.token, demo);
  return (
    <PaymentCheckout
      token={checkout.token}
      payUrl={checkout.payUrl}
      open={open}
      onOpenChange={onOpenChange}
      onPaid={onPaid}
      {...demoProps}
    />
  );
}
