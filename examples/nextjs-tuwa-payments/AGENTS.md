# AGENTS.md: nextjs-tuwa-payments

This app is a Next.js App Router shop that sells with Quasar Payments: the server issues an invoice for every order with `@tuwaio/quasar-sdk`, the browser renders the checkout of `@tuwaio/nova-payments` for EVM and Solana wallets, and a route handler verifies the `payments.v1` webhooks that fulfil the orders. It has no database: an order is a Quasar invoice, found by the visitor ID of a cookie. It comes from the `nextjs-tuwa-payments` template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); `README.md` describes its features, environment variables and files.

Before changing TUWA code, read the TUWA integration guide for agents: https://raw.githubusercontent.com/TuwaIO/workflows/main/TUWA_AGENTS.md. It lists the packages and their import paths, working code for every part of this app, and the full list of rules.

## Commands

`pnpm dev` (port 3012), `pnpm build`, `pnpm lint:fix`, `pnpm webhooks` (relays webhooks of a `localhost` endpoint from Quasar Cloud).

## Rules

- Keep `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` on the server: `src/lib/quasar.ts` and the files that import it (`src/lib/orders.ts`, `src/lib/shop.ts`, `src/app/actions.ts`, route handlers) never run in the browser.
- Issue invoices on the server and pass only the checkout token (and the payment page) to the browser.
- Show a visitor their own orders only: issue every invoice with `buyer.externalId` set to the visitor ID (`ensureVisitor`), and read an order through `listOrders` or `findOrder` with that ID, never by an invoice ID taken from the URL. Do not add a page that lists the orders of all visitors.
- Set the visitor cookie only in Server Actions and route handlers (`ensureVisitor`); pages read it with `readVisitor`.
- Fulfil orders from verified webhooks (`verifyWebhook` over the raw body), once per event ID, never from `onPaid` of the checkout.
- The shop takes test payments by default: keep the refusal of a live key in `src/lib/quasar.ts` (`SHOP_LIVE_PAYMENTS`), and add a network to `src/configs/appConfig.ts` and `src/lib/methods.ts` together.
- Create the wagmi config, the Satellite and Nova Payments adapters and the Pulsar store once, at module level, never inside components.
- Keep `NovaPaymentsProvider` inside `NovaConnectProvider`, so the checkout opens the Nova Connect modal to connect a wallet.
- Import from the TUWA packages (`@tuwaio/nova-payments`, `@tuwaio/nova-connect/evm`, …); add each new package with its peer dependencies. Do not import `@tuwaio/nova-core` in a Server Component: it creates React contexts when loaded.
- Keep the merchant's refund (`src/app/merchantActions.ts`) behind `SHOP_MERCHANT_MODE`, checked in every action; a real shop puts it behind its admin sign-in.
- Style with the `--tuwa-*` variables and the `shop-*` classes of `src/styles/app.css`: square forms, lines of 1 px, no gradients. Icons come from `@tuwaio/nova-icons`; the shop's drawings are pixel grids made with `createPixelIcon` (`src/components/shop/art.tsx`).
- Keep strict TypeScript without `any`; run `pnpm lint:fix` after changes.
