# TUWA Payments: Next.js Shop

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

A small shop that sells with **Quasar Payments**: the server issues invoices and subscriptions with `@tuwaio/quasar-sdk`, the page opens the checkout of `@tuwaio/nova-payments`, and the buyer pays in crypto from an EVM or Solana wallet or with a QR code. Quasar checks the payment on-chain, issues the receipt and sends the `payments.v1` webhooks that fulfil the order. It is a template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground).

> [!NOTE]
> Quasar Payments is in development: this template uses the alpha releases of `@tuwaio/nova-payments`, `@tuwaio/quasar-sdk` and the Nova packages, and runs against a self-hosted Quasar node with Payments turned on. The checkout has a language menu: English, Spanish, Italian, Ukrainian, Russian and Simplified Chinese.

---

## 🚀 Quick Start

```bash
npx @tuwaio/create-cosmos-playground   # choose nextjs-tuwa-payments
cd my-shop
cp .env.example .env                   # then fill in the keys of your Quasar Payments app
pnpm dev
```

Open [http://localhost:3012](http://localhost:3012). The shop runs on port 3012 because a local Quasar node takes 3000 (dashboard) and 3001 (engine). Node.js 24 LTS, 24.22.1 or newer, is required (the `engines` field; 24.22.1 is the October 2026 security release).

---

## 🎯 What It Shows

- **The methods of your Quasar app.** The page reads them on the server with `payments.listMethods()` and shows the tokens and networks the buyer can pay with. While the app has none, the buttons are off and say why: Quasar would issue an invoice that nobody can pay, so the Server Actions refuse too. Automatic payments also need a token method on an EVM network.
- **Invoices issued on the server.** "Buy with crypto" calls a Server Action that issues a Quasar invoice (line items in USD, the order ID in the metadata, an idempotency key, a return link) and passes only its checkout token to the page. The secret key never reaches the browser.
- **The Nova Payments checkout** in a modal: the order with its lines, the methods of your Quasar app (network and token), the rate locked for a quote, then the payment from the connected wallet, gasless when the token and the wallet allow it, or with a QR code (Solana Pay, or the payment page on a phone). It follows the invoice until Quasar confirms it and shows the outcome: paid with the receipt, underpaid, held for review, expired.
- **Wallets** through Nova Connect on Satellite Connect: EVM wallets through wagmi connectors (injected, Safe{Wallet}) and Solana wallets through Wallet Standard. "Connect wallet" in the checkout opens the Nova Connect modal for the family of the chosen method. The last wallet is reconnected after a page reload until the tab closes, or until the user disconnects it if they tick "Remember this wallet" in the connect modal (`rememberWallet={false}` in `src/providers/SatelliteConnectProviders.tsx`). WalletConnect is not included: to offer it, add `walletConnect` from `@wagmi/connectors` with your own Reown project ID. The connect modal links the Terms of Service and Privacy Policy of TUWA (`legal` of `NovaConnectProvider`); replace them with the documents of your shop.
- **Payments after closing.** A payment the wallet sends after the buyer closed the checkout goes to the Pulsar store: Nova Transactions shows its toast and tracks it.
- **Subscriptions.** The plan bills every day (the shortest period, so you can watch a renewal on a testnet): either the buyer pays each invoice, or after the first payment the checkout offers automatic payments, an ERC-7715 permission of the buyer's EVM wallet, payable only to you.
- **Light and dark themes:** the page follows the system theme; the button in the header switches it and saves the choice. `themeScript` (`src/configs/theme.ts`) sets the `dark` class of the Nova themes in the root layout before the first paint, so a reload never flashes the other theme.
- **Webhooks that fulfil orders.** `src/app/api/webhooks/quasar/route.ts` verifies each delivery with `verifyWebhook`, acts on each event once and marks the order fulfilled on `invoice.paid`. The page shows the orders and the webhooks it received.

---

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

`pnpm dev`, open [http://localhost:3012](http://localhost:3012): the methods of your app are listed above the products. Buy something.

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
| Subscription              | **Subscribe, pay each invoice**: the invoice of the next period joins the order when Quasar issues it (daily plan)                                           |
| Automatic payments        | **Subscribe with automatic payments**, pay the first invoice with USDC on Base Sepolia, then **Allow** in MetaMask 13.23+                                    |
| Expired invoice           | Leave an invoice open for 60 minutes                                                                                                                         |
| Outcomes in the dashboard | Cancel or refund an invoice in **Payments → Invoices**: the order and the webhooks follow                                                                    |

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

With Quasar Cloud, a webhook endpoint with a `localhost` URL receives its deliveries through `pnpm webhooks` (`quasar-sdk listen`), without a tunnel.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions.ts                 # Server Actions: list the methods, issue invoices and subscriptions, read the orders
│   ├── api/webhooks/quasar/       # Verifies payments.v1 webhooks and fulfils orders
│   ├── layout.tsx
│   └── page.tsx                   # Reads the methods; highlights the order the checkout returned to (?order=)
├── components/
│   ├── HomePage.tsx               # The shop, the orders, the webhooks and the PaymentCheckout modal
│   ├── Shop.tsx                   # The accepted methods, the products and the plan
│   ├── Orders.tsx                 # Orders with their invoices
│   ├── ThemeToggle.tsx            # Switches the light and dark themes
│   └── WebhookLog.tsx             # Verified webhook deliveries
├── configs/
│   ├── appConfig.ts               # Chains, RPC URLs, the wagmi config, the Quasar API
│   └── theme.ts                   # The saved theme, applied before the first paint
├── hooks/                         # The Pulsar store, polling of the orders
├── lib/
│   ├── catalog.ts                 # What the shop sells
│   ├── methods.ts                 # The payment methods the page shows, and which ones automatic payments charge
│   ├── orders.ts                  # The in-memory order book (use your database)
│   └── quasar.ts                  # The Quasar client (server only)
├── providers/                     # Satellite Connect, Nova Connect, Nova Payments, Nova Transactions
└── styles/app.css                 # The Nova stylesheets and Tailwind CSS
```

---

## 🛠️ Scripts

| Script          | Description                                    |
| --------------- | ---------------------------------------------- |
| `pnpm dev`      | Start the development server on port 3012      |
| `pnpm build`    | Build for production                           |
| `pnpm start`    | Serve the production build on port 3012        |
| `pnpm webhooks` | Relay the webhooks of the `localhost` endpoint |
| `pnpm lint`     | Check the code with ESLint and Prettier        |
| `pnpm lint:fix` | Fix what ESLint and Prettier can fix           |

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
