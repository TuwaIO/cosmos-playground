# TUWA Payments: Cosmos Store (Next.js)

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

**Cosmos Store** is a small shop that sells with **Quasar Payments**, laid out like the Quasar dashboard: the server issues invoices and subscriptions with `@tuwaio/quasar-sdk`, the page opens the checkout of `@tuwaio/nova-payments`, and the buyer pays in crypto from an EVM or Solana wallet or with a QR code. Quasar checks the payment on-chain, issues the receipt and sends the `payments.v1` webhooks that fulfil the order, and the shop shows them live. It is a template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground).

> [!NOTE]
> Quasar Payments is in development: this template uses the alpha releases of `@tuwaio/nova-payments`, `@tuwaio/quasar-sdk` and the Nova packages. The checkout has a language menu: English, Spanish, Italian, Ukrainian, Russian and Simplified Chinese; the shop around it is in English.

---

## 🚀 Quick Start

```bash
npx @tuwaio/create-cosmos-playground   # choose nextjs-tuwa-payments
cd my-shop
cp .env.example .env                   # then fill in the keys of your Quasar Payments app
pnpm dev
```

Open [http://localhost:3012](http://localhost:3012). The shop runs on port 3012 because a local Quasar node takes 3000 (dashboard) and 3001 (engine). Node.js 24 LTS, 24.22.1 or newer, is required (the `engines` field; 24.22.1 is the October 2026 security release).

### Try it without Quasar: demo mode

```bash
SHOP_DEMO_MODE=true pnpm dev
```

Demo mode needs no node and no keys. A simulation of the Payments API (`src/lib/demo/engine.ts`) lists testnet methods, issues invoices and subscriptions, and seeds sample orders (paid with different methods, refunded, expired, a running subscription, an open cart). In the checkout choose a Solana method and **QR code**: a few seconds later the simulation "receives" the payment and sends the webhooks Quasar would send, and the order status, the orders and the live events follow. Nothing is sent on-chain: the transaction hashes are made up, a wallet payment is refused with a note, and a strip under the header says so. **Reset demo** in that strip forgets every order and event and seeds the samples again, for a clean take. Add `SHOP_MERCHANT_MODE=true` for the refund and subscription controls: a refund opens the refund window of Nova Payments, with the merchant's wallet transfer simulated (the window says so on its last step).

---

## 🎯 What It Shows

| Screen                   | What is on it                                                                                                                                                                                                                                                                                                                                                                                                           |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Shop** `/`             | The methods of your Quasar app (`payments.listMethods()`, read on the server), six products and the Pro plan. **Buy now** issues an invoice and opens the modal checkout; the bag button adds to the cart. The plan has a billing period (daily on testnets, weekly, monthly) and **Pay each invoice** or **Automatic payments** (an ERC-7715 permission; off, with the reason, while the app has no EVM token method). |
| **Cart**                 | A drawer (full height on phones): quantities, the subtotal and **Checkout**, which issues **one invoice with a line per product**. The cart stays in this browser only (`localStorage`).                                                                                                                                                                                                                                |
| **Checkout** `/checkout` | `PaymentCheckout` inline, and beside it the **order status** the server learns from the webhooks: invoice issued, payment seen, confirmed, fulfilled by the webhook. Once paid, the page says so, the cart empties and **View order** opens the order (no automatic jump).                                                                                                                                              |
| **Orders** `/orders`     | Paid total, open orders and webhooks (three numbers), filters with counts, search, and a table (stacked rows on phones) whose rows open the order.                                                                                                                                                                                                                                                                      |
| **Order** `/orders/[id]` | Where the checkout returns the buyer (the invoice's success URL): the outcome, the payment (method, amount, transaction, payer), the webhook timeline, the documents (invoice and receipt PDF, e-invoice XML, credit notes, downloaded through the shop's server), the subscription with its period invoices, and in merchant mode the refund and subscription controls.                                                |
| **Events** `/events`     | The `payments.v1` webhooks the shop verified: a table with filters by family and search (a list on phones), each row with its details and a trimmed, highlighted copy of the event. From 1280 px the same log is a live rail beside every page; below, a drawer (a sheet on phones).                                                                                                                                    |

Behind the screens:

- **Invoices issued on the server.** Server Actions call Quasar with the secret key, put the order ID in the metadata, use an idempotency key and pass only the checkout token (and the payment page) to the browser.
- **Wallets** through Nova Connect on Satellite Connect: EVM wallets through wagmi connectors (injected, Safe{Wallet}) and Solana wallets through Wallet Standard. "Connect wallet" in the checkout opens the Nova Connect modal. The last wallet is reconnected after a reload until the tab closes, or until the user disconnects it if they tick "Remember this wallet" (`rememberWallet={false}` in `src/providers/SatelliteConnectProviders.tsx`). WalletConnect is not included: add `walletConnect` from `@wagmi/connectors` with your own Reown project ID. The connect modal links the Terms of Service and Privacy Policy of TUWA (`legal` of `NovaConnectProvider`); replace them with your shop's.
- **Payments after closing.** A payment the wallet sends after the buyer closed the checkout goes to the Pulsar store: Nova Transactions shows its toast and tracks it.
- **Webhooks that fulfil orders.** `src/app/api/webhooks/quasar/route.ts` verifies each delivery with `verifyWebhook` over the raw body, acts on each event ID once and fulfils the order on the first `invoice.paid`. `GET /api/events` streams the order book to the page (Server-Sent Events, a heartbeat every 15 s); the page reads it every 3 s when the stream fails. Screen readers hear fulfilments and refunds, not every event.
- **Merchant mode** (`SHOP_MERCHANT_MODE=true`): refunds from your connected wallet with `RefundDialog` and `createRefundStore` (Server Actions call `payments.refund`, `submitRefund`, `getRefund`), and Pause, Resume, Cancel at period end and Undo cancel of subscriptions. These act with the secret key for whoever opens the page, so the switch is checked in every action: turn it on only on your own machine, never on a public deployment. A real shop puts them behind its admin sign-in, or leaves them to the Quasar dashboard.
- **The look of the Quasar dashboard in the templates' colours:** Geist and Geist Mono (embedded in `@tuwaio/nova-core`, no font host), mono headings, one radius (`--tuwa-rounded-corners`, 4 px), the Nova status colours, a solid zinc accent and no gradients. Light and dark themes follow the system; the button in the header switches and saves the choice, and `themeScript` (`src/configs/theme.ts`) applies it before the first paint. Every screen is laid out for 1920, 768 and 390 px wide.

---

## ☁️ Run It Against Quasar Cloud

Payments on Quasar Cloud: see the Quasar dashboard. Without them, run a local node (below) or demo mode.

1. In the [Quasar dashboard](https://quasar.tuwa.io), **Apps → Create**: a **Payments** app in the **Test** environment, with `http://localhost:3012/api/webhooks/quasar` under **Where should payment events go?**. The last step shows `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` once: copy them into `.env`.
2. Add payment methods, turn on subscriptions and gasless payments as in steps 2–4 of the local node below.
3. Leave `NEXT_PUBLIC_QUASAR_BASE_URL` empty (the SDK and the checkout default to Quasar Cloud), then run `pnpm dev` and, in a second terminal, `pnpm webhooks`: `quasar-sdk listen` relays the deliveries of the `localhost` endpoint without a tunnel.

For a deployment, set `NEXT_PUBLIC_APP_URL` to its origin and give the app's webhook its public URL.

## 🛰️ Run It Against a Local Quasar Node

### 1. Start Quasar with Payments

Run your Quasar node as its `docs/QUICKSTART_LOCAL.md` describes (Postgres and Redis in Docker, the dashboard and the engine on the host), with these settings in the Quasar `.env`:

| Variable                  | Value                | Why                                                                                                                            |
| :------------------------ | :------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `PAYMENTS_MODE`           | `admin` or `on`      | Serves the payments API and the checkout: `admin` in the organizations a system administrator owns, `on` in every organization |
| `ALLOW_INTERNAL_WEBHOOKS` | `true`               | Lets Quasar deliver webhooks to `http://localhost:3012`                                                                        |
| `SANCTIONS_SYNC_ENABLED`  | `true` (the default) | Payers are screened against the OFAC list; without the list no quote is given                                                  |

### 2. Create the Payments app

**With the dev seed of Quasar.** After `pnpm seed`, `pnpm seed:dev` in the Quasar repository creates the app **Test Shop** in the admin's workspace: test environment, USDC and ETH on Base Sepolia, USDC on Sepolia, USDC and SOL on Solana devnet, subscriptions, and a webhook to this shop with every payment event. Set in the Quasar `.env` before running it:

| Variable                         | Value                                                                                                                    |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `SEED_DEV_SHOP_EVM_RECIPIENT`    | Your EVM wallet that receives the payments (not the one you pay from). Without it, no EVM methods                        |
| `SEED_DEV_SHOP_SOLANA_RECIPIENT` | Your Solana wallet that receives them. Without it, no Solana methods                                                     |
| `SEED_DEV_SHOP_PIMLICO_API_KEY`  | Optional: gasless payments and automatic charges                                                                         |
| `SEED_DEV_SHOP_ENV_FILE`         | Optional: the absolute path of this shop's `.env`. The seed writes `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` there |

**By hand,** in the Quasar dashboard ([http://localhost:3000](http://localhost:3000)):

1. **Apps → Create**: **Payments**, environment **Test**, and `http://localhost:3012/api/webhooks/quasar` under **Where should payment events go?**. The webhook is created with the app, with the money events and the notices a shop acts on. The last step shows `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` as one `.env` block, only once: copy it.
2. **Payments → Payment methods**: add the testnet presets you want to try, for example USDC and ETH on Base Sepolia, USDC on Sepolia, USDC and SOL on Solana devnet. The recipient is **your own wallet**, and a different one from the wallet you pay with (a transfer to yourself does not change your balance, so Quasar cannot see a payment). On Solana the recipient needs a USDC token account first: get devnet USDC from the faucet to that address once.
3. **Payments → Checkout**: turn on **Subscriptions**, and **Automatic charges (ERC-7715)** to try automatic payments.
4. **Payments → Compliance & gas**: your **Pimlico API key** and **Gasless payments** for gasless EVM payments and automatic charges. Without it buyers pay the gas themselves.

Test invoices are issued without the seller details; live invoices need the legal name, address and country under **Payments → Business & documents**. If the app lists domains, add `localhost:3012`, or the checkout refuses to open on the shop.

### 3. Get test funds

- USDC on Base Sepolia, Sepolia and Solana devnet: [faucet.circle.com](https://faucet.circle.com).
- ETH on Base Sepolia: the [Base network faucets](https://docs.base.org/base-chain/tools/network-faucets).
- SOL on devnet: [faucet.solana.com](https://faucet.solana.com). Switch your Solana wallet to devnet yourself: Solana wallets choose their network, and an app cannot switch it (in Phantom: Settings → Developer Settings → Testnet Mode; in Solflare: Settings → General → Network).

### 4. Configure and start the shop

```env
QUASAR_SECRET_KEY=sk_test_...
QUASAR_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_QUASAR_BASE_URL=http://localhost:3001
```

`pnpm dev`, open [http://localhost:3012](http://localhost:3012): the methods of your app are listed above the products, and a strip under the header says the payments are test payments while every method is on a testnet. Buy something.

### What to try

| Scenario                  | How                                                                                                                                                          |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EVM wallet                | Buy, choose USDC on Base Sepolia, connect MetaMask (or another EVM wallet), pay                                                                              |
| Gasless                   | The same with **Gasless payments** on: MetaMask signs a transfer authorization (EIP-3009) and Quasar relays it                                               |
| Solana wallet             | Choose USDC or SOL on Solana devnet, connect Phantom or Solflare, pay                                                                                        |
| Solana Pay QR             | Choose a Solana method and scan the QR code with a Solana Pay wallet on devnet                                                                               |
| Solana on another network | Pay a Solana devnet method from Phantom on mainnet: the checkout reminds you of the network and, after the refused transfer, tells you that nothing was paid |
| No methods yet            | Turn off the methods of your app in **Payments → Payment methods** and reload the shop: the buttons are off and say why                                      |
| Toast after closing       | Confirm in the wallet, then close the checkout before Quasar confirms: the payment continues in a Nova Transactions toast                                    |
| Cart                      | Add three products, **Checkout**: one invoice with three lines, paid on the checkout page beside the order status                                            |
| Subscription              | **Daily (testnet)**, **Pay each invoice**, **Subscribe**: the invoice of the next period joins the order when Quasar issues it                               |
| Automatic payments        | **Automatic payments**, **Subscribe**, pay the first invoice with USDC on Base Sepolia, then **Allow** in MetaMask 13.23+                                    |
| Refund                    | With `SHOP_MERCHANT_MODE=true`, open a paid order and **Refund** from your wallet: the credit note joins the documents                                       |
| Expired invoice           | Leave an invoice open for 60 minutes                                                                                                                         |
| Outcomes in the dashboard | Cancel or refund an invoice in **Payments → Invoices**: the order, its timeline and the live events follow                                                   |

---

## 📦 TUWA Packages

| Package                                                                                      | Used for                                                                                                     |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `@tuwaio/quasar-sdk`                                                                         | `Quasar` (`payments.createInvoice`, `createSubscription`, `listMethods`), `verifyWebhook`, the payment types |
| `@tuwaio/nova-payments` (with `/evm`, `/solana`)                                             | `NovaPaymentsProvider`, `PaymentCheckout`, `paymentsEVMAdapter`, `paymentsSolanaAdapter`                     |
| `@tuwaio/nova-connect` (with `/components`, `/satellite`, `/evm`, `/solana`)                 | `NovaConnectProvider`, `ConnectButton`, the Satellite Connect store, the network watchers                    |
| `@tuwaio/nova-transactions`, `@tuwaio/nova-core`                                             | `NovaTransactionsProvider` (the toast of a handed-over payment), the theme, `cn`                             |
| `@tuwaio/satellite-evm`, `@tuwaio/satellite-solana`                                          | The Satellite adapters, `createDefaultTransports`                                                            |
| `@tuwaio/pulsar-core`, `@tuwaio/pulsar-evm`, `@tuwaio/pulsar-solana`, `@tuwaio/pulsar-react` | The Pulsar store that tracks handed-over payments, its adapters and `useInitializeTransactionsPool`          |

`@tuwaio/orbit-*`, `@tuwaio/satellite-core`, `@tuwaio/satellite-react`, `@tuwaio/siwx-core` and `@tuwaio/siwx-react` are installed as peer dependencies.

---

## 🔧 Environment Variables

| Variable                      | Description                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `QUASAR_SECRET_KEY`           | Secret key of your Quasar Payments app (`sk_test_…` or `sk_live_…`). Server only           |
| `QUASAR_WEBHOOK_SECRET`       | Signing secret of the app's webhook endpoint (`whsec_…`). Server only                      |
| `NEXT_PUBLIC_QUASAR_BASE_URL` | The Quasar API of your node (`http://localhost:3001` locally). Empty: Quasar Cloud         |
| `NEXT_PUBLIC_APP_URL`         | Origin of the shop: the links the checkout returns to. Default: `http://localhost:3012`    |
| `NEXT_PUBLIC_ALCHEMY_KEY`     | Alchemy key for the RPC URLs of the checkout (balances and fees). Default: public RPC URLs |
| `SHOP_DEMO_MODE`              | `true`: a simulation of Quasar with sample orders, no keys needed. Server only             |
| `SHOP_MERCHANT_MODE`          | `true`: refunds and subscription controls on the order page. Your own machine only         |

With Quasar Cloud, a webhook endpoint with a `localhost` URL receives its deliveries through `pnpm webhooks` (`quasar-sdk listen`), without a tunnel.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions.ts                 # Server Actions: methods, Buy now, cart checkout, subscriptions, the order book
│   ├── merchantActions.ts         # Refunds and subscription controls (merchant mode only)
│   ├── demoActions.ts             # The checkout API and the reset of demo mode
│   ├── api/webhooks/quasar/       # Verifies payments.v1 webhooks and fulfils orders
│   ├── api/events/                # The live order book (Server-Sent Events)
│   ├── api/orders/[orderId]/documents/[kind]/  # Invoice, receipt, e-invoice and credit note downloads
│   ├── page.tsx                   # Shop
│   ├── checkout/  orders/  events/
│   └── layout.tsx                 # Providers, the shell, the theme script
├── components/
│   ├── shell/                     # Header, test-mode strip, live events rail and drawer, cart, shared state
│   ├── shop/  checkout/  orders/  events/
│   └── ui/                        # Card, Segmented, DataTable, MetricCard, StatusBadge, Notice, EmptyState, Drawer…
├── configs/                       # Chains, RPC URLs, the wagmi config; the saved theme
├── hooks/                         # The Pulsar store, a ticking clock
├── lib/
│   ├── catalog.ts                 # What the shop sells
│   ├── orders.ts                  # The in-memory order book (use your database)
│   ├── quasar.ts                  # The Quasar client (server only)
│   ├── mode.ts                    # Demo and merchant mode
│   └── demo/                      # The simulation of demo mode
├── providers/                     # Satellite Connect, Nova Connect, Nova Payments, Nova Transactions
└── styles/app.css                 # The Nova stylesheets, Tailwind CSS and the shop's tokens
public/products/                   # The line art of the products
```

The orders live in the memory of the server: a restart forgets them, and every visitor sees every order. A real shop keeps them in its database, fulfils them in a job queue and shows each buyer only their own.

---

## 🛠️ Scripts

| Script          | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| `pnpm dev`      | Start the development server on port 3012 (`SHOP_DEMO_MODE=true pnpm dev` without Quasar) |
| `pnpm build`    | Build for production                                                                      |
| `pnpm start`    | Serve the production build on port 3012                                                   |
| `pnpm webhooks` | Relay the webhooks of the `localhost` endpoint                                            |
| `pnpm lint`     | Check the code with ESLint and Prettier                                                   |
| `pnpm lint:fix` | Fix what ESLint and Prettier can fix                                                      |

---

## 📖 Learn More

- [Quasar documentation](https://docs.tuwa.io/quasar): apps and keys, webhooks, self-hosting and the API reference
- [`@tuwaio/quasar-sdk`](https://sdk.docs.tuwa.io/packages/quasar-sdk) and the [Nova UI Kit](https://stories.tuwa.io/) components
- [All starter templates](https://docs.tuwa.io/guides/starter-templates)

---

## 🤝 Contributing & Support

Contributions are welcome! Please read the **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

## 📄 License

[MIT No Attribution](./LICENSE): copy this template without keeping the notice.
