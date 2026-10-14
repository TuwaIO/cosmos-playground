# AGENTS.md: nextjs-tuwa-payments

This app is a Next.js App Router shop that sells with Quasar Payments: the server issues invoices and subscriptions with `@tuwaio/quasar-sdk`, the browser renders the checkout of `@tuwaio/nova-payments` for EVM and Solana wallets, and a route handler verifies the `payments.v1` webhooks that fulfil the orders. It comes from the `nextjs-tuwa-payments` template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); `README.md` describes its features, environment variables and files.

Before changing TUWA code, read the TUWA integration guide for agents: https://raw.githubusercontent.com/TuwaIO/workflows/main/TUWA_AGENTS.md. It lists the packages and their import paths, working code for every part of this app, and the full list of rules.

## Commands

`pnpm dev` (port 3012), `pnpm build`, `pnpm lint:fix`, `pnpm webhooks` (relays webhooks of a `localhost` endpoint from Quasar Cloud).

## Rules

- Keep `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` on the server: `src/lib/quasar.ts` and the files that import it (`src/app/actions.ts`, route handlers) never run in the browser.
- Issue invoices on the server and pass only the checkout token (and the payment page) to the browser.
- Fulfil orders from verified webhooks (`verifyWebhook` over the raw body), once per event ID, never from `onPaid` of the checkout.
- Create the wagmi config, the Satellite and Nova Payments adapters and the Pulsar store once, at module level, never inside components.
- Keep `NovaPaymentsProvider` inside `NovaConnectProvider`, so the checkout opens the Nova Connect modal to connect a wallet.
- Import from the TUWA packages (`@tuwaio/nova-payments`, `@tuwaio/nova-connect/evm`, …); add each new package with its peer dependencies.
- Keep strict TypeScript without `any`; run `pnpm lint:fix` after changes.
