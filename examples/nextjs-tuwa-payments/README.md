# TUWA Payments: Next.js Shop

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

A small shop that sells with **Quasar Payments**: the server issues invoices and subscriptions with `@tuwaio/quasar-sdk`, the page opens the checkout of `@tuwaio/nova-payments`, and the buyer pays in crypto from an EVM or Solana wallet or with a QR code. Quasar checks the payment on-chain, issues the receipt and sends the `payments.v1` webhooks that fulfil the order. It is a template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground).

> [!NOTE]
> Quasar Payments is in development: this template uses the alpha releases of `@tuwaio/nova-payments`, `@tuwaio/quasar-sdk` and the Nova packages, and runs against a self-hosted Quasar node with Payments turned on. The checkout speaks English for now.

---

## 🚀 Quick Start

```bash
npx @tuwaio/create-cosmos-playground   # choose nextjs-tuwa-payments
cd my-shop
cp .env.example .env                   # then fill in the keys of your Quasar Payments app
pnpm dev
```

Open [http://localhost:3012](http://localhost:3012). The shop runs on port 3012 because a local Quasar node takes 3000 (dashboard) and 3001 (engine). Node.js 20.19+, 22.13+ or 24+ is required.

---

## 🎯 What It Shows

- **Invoices issued on the server.** "Buy with crypto" calls a Server Action that issues a Quasar invoice (line items in USD, the order ID in the metadata, an idempotency key, a return link) and passes only its checkout token to the page. The secret key never reaches the browser.
- **The Nova Payments checkout** in a modal: the order with its lines, the methods of your Quasar app (network and token), the rate locked for a quote, then the payment from the connected wallet, gasless when the token and the wallet allow it, or with a QR code (Solana Pay, or the payment page on a phone). It follows the invoice until Quasar confirms it and shows the outcome: paid with the receipt, underpaid, held for review, expired.
- **Wallets** through Nova Connect on Satellite Connect: EVM wallets through wagmi (injected, WalletConnect) and Solana wallets through Wallet Standard. "Connect wallet" in the checkout opens the Nova Connect modal for the family of the chosen method.
- **Payments after closing.** A payment the wallet sends after the buyer closed the checkout goes to the Pulsar store: Nova Transactions shows its toast and tracks it.
- **Subscriptions.** The plan bills every day (the shortest period, so you can watch a renewal on a testnet): either the buyer pays each invoice, or after the first payment the checkout offers automatic payments, an ERC-7715 permission of the buyer's EVM wallet, payable only to you.
- **Webhooks that fulfil orders.** `src/app/api/webhooks/quasar/route.ts` verifies each delivery with `verifyWebhook`, acts on each event once and marks the order fulfilled on `invoice.paid`. The page shows the orders and the webhooks it received.

---

## 🛰️ Run It Against a Local Quasar Node

### 1. Start Quasar with Payments

Run your Quasar node as its `docs/QUICKSTART_LOCAL.md` describes (Postgres and Redis in Docker, the dashboard and the engine on the host), with these settings in the Quasar `.env`:

| Variable                  | Value  | Why                                                                           |
| :------------------------ | :----- | :---------------------------------------------------------------------------- |
| `PAYMENTS_ENABLED`        | `true` | Lets you create Payments apps and serves the payments API and the checkout    |
| `ALLOW_INTERNAL_WEBHOOKS` | `true` | Lets Quasar deliver webhooks to `http://localhost:3012`                       |
| `SANCTIONS_SYNC_ENABLED`  | `true` | Payers are screened against the OFAC list; without the list no quote is given |

### 2. Create the Payments app

In the Quasar dashboard ([http://localhost:3000](http://localhost:3000)):

1. **Apps → Create**: environment **Test**, kind **Payments**.
2. **Payments → Payment methods**: add the testnet presets you want to try, for example USDC and ETH on Base Sepolia, USDC on Sepolia, USDC and SOL on Solana devnet. The recipient is **your own wallet**, and a different one from the wallet you pay with (a transfer to yourself does not change your balance, so Quasar cannot see a payment). On Solana the recipient needs a USDC token account first: get devnet USDC from the faucet to that address once.
3. **Payments → Checkout**: turn on **Subscriptions**, and **Automatic charges (ERC-7715)** to try automatic payments.
4. **Payments → Compliance & gas**: your **Pimlico API key** and **Gasless payments** for gasless EVM payments and automatic charges. Without it buyers pay the gas themselves.
5. **Webhooks → Add**: URL `http://localhost:3012/api/webhooks/quasar`, events **Invoices: All**, **Refunds: All**, **Subscriptions: All**. Copy its signing secret.
6. **Reveal secret** on the app page: the `sk_test_…` key.

Test invoices are issued without the seller details; live invoices need the legal name, address and country under **Payments → Business & documents**. If the app lists domains, add `localhost:3012`, or the checkout refuses to open on the shop.

### 3. Get test funds

- USDC on Base Sepolia, Sepolia and Solana devnet: [faucet.circle.com](https://faucet.circle.com).
- ETH on Base Sepolia: the [Base network faucets](https://docs.base.org/base-chain/tools/network-faucets).
- SOL on devnet: [faucet.solana.com](https://faucet.solana.com). Switch your Solana wallet to devnet (in Phantom: Settings → Developer Settings → Testnet Mode).

### 4. Configure and start the shop

```env
QUASAR_SECRET_KEY=sk_test_...
QUASAR_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_QUASAR_BASE_URL=http://localhost:3001
```

`pnpm dev`, open [http://localhost:3012](http://localhost:3012) and buy something.

### What to try

| Scenario                  | How                                                                                                                       |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------ |
| EVM wallet                | Buy, choose USDC on Base Sepolia, connect MetaMask (or another EVM wallet), pay                                           |
| Gasless                   | The same with **Gasless payments** on: MetaMask signs a transfer authorization (EIP-3009) and Quasar relays it            |
| Solana wallet             | Choose USDC or SOL on Solana devnet, connect Phantom or Solflare, pay                                                     |
| Solana Pay QR             | Choose a Solana method and scan the QR code with a Solana Pay wallet on devnet                                            |
| Toast after closing       | Confirm in the wallet, then close the checkout before Quasar confirms: the payment continues in a Nova Transactions toast |
| Subscription              | **Subscribe, pay each invoice**: the invoice of the next period joins the order when Quasar issues it (daily plan)        |
| Automatic payments        | **Subscribe with automatic payments**, pay the first invoice with USDC on Base Sepolia, then **Allow** in MetaMask 13.23+ |
| Expired invoice           | Leave an invoice open for 60 minutes                                                                                      |
| Outcomes in the dashboard | Cancel or refund an invoice in **Payments → Invoices**: the order and the webhooks follow                                 |

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

| Variable                        | Description                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `QUASAR_SECRET_KEY`             | Secret key of your Quasar Payments app (`sk_test_…` or `sk_live_…`). Server only                                       |
| `QUASAR_WEBHOOK_SECRET`         | Signing secret of the app's webhook endpoint (`whsec_…`). Server only                                                  |
| `NEXT_PUBLIC_QUASAR_BASE_URL`   | The Quasar API of your node (`http://localhost:3001` locally). Empty: Quasar Cloud                                     |
| `NEXT_PUBLIC_APP_URL`           | Origin of the shop: the WalletConnect metadata and the links the checkout returns to. Default: `http://localhost:3012` |
| `NEXT_PUBLIC_WALLET_PROJECT_ID` | WalletConnect project ID from [dashboard.reown.com](https://dashboard.reown.com); use your own in production           |
| `NEXT_PUBLIC_ALCHEMY_KEY`       | Alchemy key for the RPC URLs of the checkout (balances and fees). Default: public RPC URLs                             |

With Quasar Cloud, a webhook endpoint with a `localhost` URL receives its deliveries through `pnpm webhooks` (`quasar-sdk listen`), without a tunnel.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions.ts                 # Server Actions: issue invoices and subscriptions, read the orders
│   ├── api/webhooks/quasar/       # Verifies payments.v1 webhooks and fulfils orders
│   ├── layout.tsx
│   └── page.tsx                   # Highlights the order the checkout returned to (?order=)
├── components/
│   ├── HomePage.tsx               # The shop, the orders, the webhooks and the PaymentCheckout modal
│   ├── Shop.tsx                   # Products and the plan
│   ├── Orders.tsx                 # Orders with their invoices
│   └── WebhookLog.tsx             # Verified webhook deliveries
├── configs/appConfig.ts           # Chains, RPC URLs, the wagmi config, the Quasar API
├── hooks/                         # The Pulsar store, polling of the orders
├── lib/
│   ├── catalog.ts                 # What the shop sells
│   ├── orders.ts                  # The in-memory order book (use your database)
│   └── quasar.ts                  # The Quasar client (server only)
├── providers/                     # Satellite Connect, Nova Connect, Nova Payments, Nova Transactions
└── styles/app.css                 # The Nova stylesheets and Tailwind CSS
```

---

## 📄 License

[MIT No Attribution](./LICENSE): copy this template without keeping the notice.
