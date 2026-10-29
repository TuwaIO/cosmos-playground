'use server';

import type { InvoiceLocale } from '@tuwaio/quasar-sdk';
import type { CheckoutQuote, CheckoutView } from '@tuwaio/quasar-sdk/checkout';

import { demoCheckoutLocale, demoCheckoutQuote, demoCheckoutView, DemoRefusal } from '@/lib/demo/engine';
import { isDemoMode } from '@/lib/mode';
import { type ActionResult, ok, refused } from '@/lib/result';

// The checkout API of demo mode, for the `api` of `PaymentCheckout` (see `src/lib/demo/checkoutApi.ts`). Outside demo
// mode the checkout talks to Quasar directly and these refuse.

function run<T>(call: () => T): ActionResult<T> {
  if (!isDemoMode()) return refused('demo_mode_off', 'Demo mode is off');
  try {
    return ok(call());
  } catch (error) {
    if (error instanceof DemoRefusal) return refused(error.code, error.message);
    return refused('request_failed', error instanceof Error ? error.message : String(error));
  }
}

export async function demoView(token: string): Promise<ActionResult<CheckoutView>> {
  return run(() => demoCheckoutView(token));
}

export async function demoQuote(
  token: string,
  body: { methodId: string; payer?: string },
): Promise<ActionResult<CheckoutQuote>> {
  return run(() => demoCheckoutQuote(token, body));
}

export async function demoLocale(token: string, locale: InvoiceLocale): Promise<ActionResult<null>> {
  return run(() => {
    demoCheckoutLocale(token, locale);
    return null;
  });
}
