import type { CheckoutApi } from '@tuwaio/quasar-sdk/checkout';

import { demoLocale, demoQuote, demoView } from '@/app/demoActions';
import { unwrap } from '@/lib/unwrap';

const refusal = (): never =>
  unwrap<never>({ ok: false, code: 'demo_wallet_payment', message: 'Demo mode sends nothing from a wallet' });

/**
 * The `CheckoutApi` of an invoice in demo mode: `PaymentCheckout` reads and quotes it through Server Actions, against
 * the simulation of `src/lib/demo/engine.ts`, instead of the Quasar API. Pass `EventSource={null}`: the checkout then
 * reads the invoice every `pollMs`.
 */
export function demoCheckoutApi(token: string): CheckoutApi {
  return {
    view: async () => unwrap(await demoView(token)),
    quote: async (body) => unwrap(await demoQuote(token, body)),
    buyer: async () => unwrap(await demoView(token)),
    locale: async (locale) => {
      unwrap(await demoLocale(token, locale));
      return { locale };
    },
    submit: async () => refusal(),
    relay: async () => refusal(),
    permission: async () => refusal(),
    // The receipt of the simulation, and the store mark as the merchant's logo
    url: (route) =>
      route === 'receipt' ? `/api/demo/receipt/${encodeURIComponent(token)}` : route === 'logo' ? '/icon.svg' : '',
  };
}
