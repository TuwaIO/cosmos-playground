'use client';

import { PaymentCheckout } from '@tuwaio/nova-payments';
import { useRouter } from 'next/navigation';
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import type { CheckoutStart } from '@/app/actions';
import { cartStore } from '@/lib/cartStore';

/** The invoice whose checkout is open, with the order it pays. */
type OpenCheckout = { orderId: string; token: string; payUrl: string | null };

type ShopContextValue = {
  /** Whether the Quasar app of the shop has payment methods: the buy buttons are off without them. */
  sellable: boolean;
  /** The key of the purchase whose invoice is being issued (a product ID, `cart` or `club`), else `null`. */
  busy: string | null;
  /** Why the last purchase was not issued. */
  error: string | null;
  dismissError: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  /**
   * Issues an invoice with a Server Action (the secret key never reaches the browser), then opens its checkout.
   *
   * @param key - What is bought: a product ID, `cart` or `club`. The button of that purchase shows it is busy.
   * @param issue - The Server Action that issues the invoice.
   */
  purchase: (key: string, issue: () => Promise<CheckoutStart>) => Promise<void>;
  /** Opens the checkout of an invoice that is issued already (an unpaid order). */
  openCheckout: (checkout: OpenCheckout) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop(): ShopContextValue {
  const value = useContext(ShopContext);
  if (!value) throw new Error('useShop needs ShopProvider');
  return value;
}

/**
 * What the pages of the shop share: whether it can sell, the cart drawer, and the one checkout of
 * `@tuwaio/nova-payments` (a modal; a sheet from the bottom on a phone) that every purchase opens.
 */
export function ShopProvider({ sellable, children }: { sellable: boolean; children: ReactNode }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState<OpenCheckout | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const openCheckout = useCallback((next: OpenCheckout) => {
    setCheckout(next);
    setCheckoutOpen(true);
  }, []);

  const purchase = useCallback(
    async (key: string, issue: () => Promise<CheckoutStart>) => {
      setBusy(key);
      setError(null);
      try {
        const result = await issue();
        if (!result.ok) {
          setError(result.error);
          return;
        }
        // The cart empties when the order it was checked out as is paid, not when its invoice is issued
        if (key === 'cart') cartStore.checkedOut(result.orderId);
        setCartOpen(false);
        openCheckout({ orderId: result.orderId, token: result.checkoutToken, payUrl: result.payUrl });
      } catch {
        setError('The shop did not answer. Try again in a moment.');
      } finally {
        setBusy(null);
      }
    },
    [openCheckout],
  );

  const dismissError = useCallback(() => setError(null), []);

  const value = useMemo(
    () => ({ sellable, busy, error, dismissError, cartOpen, setCartOpen, purchase, openCheckout }),
    [sellable, busy, error, dismissError, cartOpen, purchase, openCheckout],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      {checkout && (
        <PaymentCheckout
          // A new invoice is a new checkout
          key={checkout.token}
          token={checkout.token}
          payUrl={checkout.payUrl}
          open={checkoutOpen}
          onOpenChange={(open) => {
            setCheckoutOpen(open);
            // The pages read the orders from Quasar: read them again when the checkout closes
            if (!open) router.refresh();
          }}
          onPaid={() => {
            cartStore.paid(checkout.orderId);
            router.refresh();
          }}
        />
      )}
    </ShopContext.Provider>
  );
}
