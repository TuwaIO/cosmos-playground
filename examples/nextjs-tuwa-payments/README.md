# TUWA Payments: Cosmos Store (Next.js)

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

**Cosmos Store** is a small shop that sells with **Quasar Payments**. The server issues an invoice for every order with `@tuwaio/quasar-sdk`, the page opens the checkout of `@tuwaio/nova-payments`, and the buyer pays in crypto from an EVM or Solana wallet, or with a QR code, straight to the shop's wallet. Quasar checks the payment on-chain and sends the webhooks a shop fulfils its orders from. The live demo is at [cosmos-shop.tuwa.io](https://cosmos-shop.tuwa.io/): it takes test payments only.

> [!IMPORTANT]
> Quasar Payments is still being built: what this template uses is not live in production yet and may change.

---

## 🚀 Quick Start

```bash
npx @tuwaio/create-cosmos-playground   # choose nextjs-tuwa-payments
cd my-shop
cp .env.example .env                   # then fill in the keys of your Quasar Payments app
pnpm dev
```

Open [http://localhost:3012](http://localhost:3012). The shop runs on port 3012 because a local Quasar node takes 3000 (dashboard) and 3001 (engine). Node.js 24.22.1 or newer is required (the `engines` field). Without the keys the pages open, the buy buttons are off and the shop says what is missing.

---

## 🎯 What It Shows

- **Invoices issued on the server:** `buyProduct`, `checkoutCart` and `joinClub` in `src/app/actions.ts` call `quasar.payments.createInvoice` with the secret key. Only the checkout token reaches the browser.
- **One checkout for every purchase:** `PaymentCheckout` of `@tuwaio/nova-payments` in a modal (a sheet from the bottom on a phone): the buyer chooses a token and a network, then pays from a wallet connected with Nova Connect, or with a QR code.
- **The methods of your Quasar app:** the shop lists what the app takes, the methods marked "Popular" in the dashboard first, and says why nothing can be bought while the app has none.
- **A cart:** several products, one invoice with a line for each. The cart lives in the browser and is checked against the catalog on the server.
- **Your orders, and nobody else's:** a visitor sees the orders of their own browser only (see below). The order page shows the lines, the payment, the events of the invoice and its documents (the invoice and the receipt as PDF).
- **Cosmos Club:** a membership sold as one payment. It has no period and no next invoice; the browser whose order of it is paid is a member.
- **Webhooks:** `src/app/api/webhooks/quasar/route.ts` verifies the signature with `verifyWebhook` and acts on each event once. This is where a shop fulfils an order.
- **Refunds in merchant mode:** with `SHOP_MERCHANT_MODE=true` a paid order gets the `RefundButton` of Nova Payments, which refunds from the merchant's connected wallet.
- **The look of Nova UI Kit:** paper and ink in neutral colours, the pixel icons of `@tuwaio/nova-icons`, and the shop's own pixel drawings made with `createPixelIcon` (`src/components/shop/art.tsx`).

---

## 🧾 How Orders Are Kept

The shop has no database and no accounts.

- The first purchase sets a cookie, `cosmos-store-visitor`, with a random ID. It is `HttpOnly`, lasts 30 days from the latest order and holds nothing about the person.
- Every invoice is issued with that ID as the buyer's external ID (`buyer.externalId`) and with the shop's order ID in its metadata.
- "Your orders" lists the invoices of the Quasar app that carry the ID of the cookie (`listInvoices({ externalId })`). An order page is looked up among them, so the address of another visitor's order shows "not found". The documents are served the same way.
- The shop has no page that lists the orders of all visitors.

Clearing the cookies of the site hides the orders from that browser; the invoices stay in the Quasar app. A real shop keeps its orders in its own database, ties them to its accounts and fulfils them from the webhooks, in a job queue rather than in the request.

---

## ☁️ Run It Against Quasar Cloud

1. In the [Quasar dashboard](https://quasar.tuwa.io), **Apps → Create**: a **Payments** app in the **Test** environment, with `http://localhost:3012/api/webhooks/quasar` under **Where should payment events go?**. The last step shows `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` once: copy them into `.env`.
2. Add payment methods as in step 2 of the local node below.
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

**With the dev seed of Quasar.** After `pnpm seed`, `pnpm seed:dev` in the Quasar repository creates the app **Cosmos Store** in the TUWA organization: test environment, USDC and the native coin on Base Sepolia, on Sepolia and on Solana Devnet, and a webhook to this shop with every payment event. Set in the Quasar `.env` before running it:

| Variable                         | Value                                                                                                                    |
| :------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| `SEED_DEV_SHOP_EVM_RECIPIENT`    | Your EVM wallet that receives the payments (not the one you pay from). Without it, no EVM methods                        |
| `SEED_DEV_SHOP_SOLANA_RECIPIENT` | Your Solana wallet that receives them. Without it, no Solana methods                                                     |
| `SEED_DEV_SHOP_PIMLICO_API_KEY`  | Optional: gasless payments                                                                                               |
| `SEED_DEV_SHOP_ENV_FILE`         | Optional: the absolute path of this shop's `.env`. The seed writes `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` there |

**By hand,** in the Quasar dashboard ([http://localhost:3000](http://localhost:3000)):

1. **Apps → Create**: **Payments**, environment **Test**, and `http://localhost:3012/api/webhooks/quasar` under **Where should payment events go?**. The last step shows `QUASAR_SECRET_KEY` and `QUASAR_WEBHOOK_SECRET` as one `.env` block, only once: copy it.
2. **Payments → Payment methods**: add the testnet presets you want to try, for example USDC on Sepolia, on Base Sepolia and on Solana Devnet. The recipient is **your own wallet**, and a different one from the wallet you pay with (a transfer to yourself does not change your balance, so Quasar cannot see a payment). On Solana the recipient needs a USDC token account first: get devnet USDC from the faucet to that address once. Mark a method **Popular** to list it first in the shop and in the checkout.
3. **Payments → Compliance & gas**: your **Pimlico API key** and **Gasless payments** for gasless EVM payments. Without it buyers pay the gas themselves.

Test invoices are issued without the seller details; live invoices need the legal name, address and country under **Payments → Business & documents**. If the app lists domains, add `localhost:3012`, or the checkout refuses to open on the shop.

### 3. Get test funds

- USDC on Base Sepolia, Sepolia and Solana Devnet: [faucet.circle.com](https://faucet.circle.com).
- ETH on Base Sepolia: the [Base network faucets](https://docs.base.org/base-chain/tools/network-faucets).
- SOL on devnet: [faucet.solana.com](https://faucet.solana.com). Switch your Solana wallet to devnet yourself: Solana wallets choose their network, and an app cannot switch it (in Phantom: Settings → Developer Settings → Testnet Mode; in Solflare: Settings → General → Network).

### 4. Configure and start the shop

```env
QUASAR_SECRET_KEY=sk_test_...
QUASAR_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_QUASAR_BASE_URL=http://localhost:3001
```

`pnpm dev`, open [http://localhost:3012](http://localhost:3012): the methods of your app are listed beside the name of the shop, and a strip under the header says the payments are test payments. Buy something.

### What to try

| Scenario                  | How                                                                                                                       |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------ |
| EVM wallet                | **Buy now**, choose USDC on Sepolia, connect MetaMask (or another EVM wallet), pay                                        |
| Gasless                   | The same with **Gasless payments** on: the wallet signs a transfer authorization (EIP-3009) and pays no gas               |
| Solana wallet             | Choose USDC or SOL on Solana Devnet, connect Phantom or Solflare, pay                                                     |
| Solana Pay QR             | Choose a Solana method and scan the QR code with a Solana Pay wallet on devnet                                            |
| Cart                      | Add three products, **Check out**: one invoice with three lines                                                           |
| Cosmos Club               | **Join the Club**, pay the invoice: the page shows the member's card, and the order is listed with your orders            |
| Another browser           | Open **Orders** in a private window: it lists nothing, and the address of your order shows "not found"                    |
| No methods yet            | Turn off the methods of your app in **Payments → Payment methods** and reload the shop: the buttons are off and say why   |
| Toast after closing       | Confirm in the wallet, then close the checkout before Quasar confirms: the payment continues in a Nova Transactions toast |
| Refund                    | With `SHOP_MERCHANT_MODE=true`, open a paid order and **Refund** from your wallet                                         |
| Expired invoice           | Leave an invoice open for 60 minutes                                                                                      |
| Outcomes in the dashboard | Cancel or refund an invoice in **Payments → Invoices**: the order and its timeline follow                                 |

---

## 💸 Selling for Real

The template takes test payments unless told otherwise.

1. Set `SHOP_LIVE_PAYMENTS=true`. Without it the shop refuses a live secret key (`sk_live_…`), so a deployment meant as a demo cannot issue real invoices by mistake.
2. Add the networks of your payment methods to `appEVMChains` and `solanaRPCUrls` in `src/configs/appConfig.ts`, and to `NETWORKS` in `src/lib/methods.ts`. Give Solana mainnet an RPC URL of your own: its public RPC refuses requests from browsers.
3. Pin your receiving addresses: pass `payoutAddresses` to `new Quasar(…)` in `src/lib/quasar.ts` and to `PaymentCheckout` in `src/components/shell/ShopProvider.tsx`, so the checkout refuses a payment to any other address.
4. Keep your orders in your own database, put the refunds behind your own sign-in, and replace the legal links in `src/providers/SatelliteConnectProviders.tsx` and `src/components/shell/Footer.tsx` with your documents.

---

## 📦 TUWA Packages

| Package                                                                                      | Used for                                                                                                                        |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `@tuwaio/quasar-sdk` (with `/checkout`)                                                      | `Quasar` (`payments.createInvoice`, `listInvoices`, `getEvents`, `getDocument`, `refund`), `verifyWebhook`, `createRefundStore` |
| `@tuwaio/nova-payments` (with `/evm`, `/solana`)                                             | `NovaPaymentsProvider`, `PaymentCheckout`, `RefundButton`, `paymentsEVMAdapter`, `paymentsSolanaAdapter`                        |
| `@tuwaio/nova-connect` (with `/components`, `/satellite`, `/evm`, `/solana`)                 | `NovaConnectProvider`, `ConnectButton`, the Satellite Connect store, the network watchers                                       |
| `@tuwaio/nova-transactions`, `@tuwaio/nova-core`                                             | `NovaTransactionsProvider` (the toast of a handed-over payment), the theme, `TokenIcon`                                         |
| `@tuwaio/nova-icons`                                                                         | The pixel icons, and `createPixelIcon` for the shop's own drawings                                                              |
| `@tuwaio/satellite-evm`, `@tuwaio/satellite-solana`                                          | The Satellite adapters, `createDefaultTransports`                                                                               |
| `@tuwaio/pulsar-core`, `@tuwaio/pulsar-evm`, `@tuwaio/pulsar-solana`, `@tuwaio/pulsar-react` | The Pulsar store that tracks handed-over payments, its adapters and `useInitializeTransactionsPool`                             |
| `@tuwaio/orbit-core`                                                                         | `formatBaseUnits` for the amount of a payment                                                                                   |

`@tuwaio/orbit-evm`, `@tuwaio/orbit-solana`, `@tuwaio/satellite-core`, `@tuwaio/satellite-react`, `@tuwaio/siwx-core` and `@tuwaio/siwx-react` are installed as peer dependencies.

---

## 🔧 Environment Variables

| Variable                      | Description                                                                                           |
| :---------------------------- | :---------------------------------------------------------------------------------------------------- |
| `QUASAR_SECRET_KEY`           | Secret key of your Quasar Payments app (`sk_test_…`). Server only                                     |
| `QUASAR_WEBHOOK_SECRET`       | Signing secret of the app's webhook endpoint (`whsec_…`). Server only                                 |
| `NEXT_PUBLIC_QUASAR_BASE_URL` | The Quasar API of your own node, for example `http://localhost:3001`. Empty: Quasar Cloud             |
| `NEXT_PUBLIC_APP_URL`         | Origin of the shop: the links the checkout returns to. Default: `http://localhost:3012`               |
| `NEXT_PUBLIC_ALCHEMY_KEY`     | Optional Alchemy key for the RPC URLs of the checkout. It is public: restrict it to your domain       |
| `SHOP_LIVE_PAYMENTS`          | `true` lets the shop work with a live secret key. Default: test keys only                             |
| `SHOP_MERCHANT_MODE`          | `true` shows the refund button on paid orders. Only on your own machine, never on a public deployment |

---

## 🗄️ Browser Storage and Cookies

| Key                                                                                      | Where                                                                  | What                                                                                      |
| :--------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| `cosmos-store-visitor`                                                                   | Cookie, `HttpOnly`, 30 days from the latest order                      | A random ID: the shop lists the orders issued with it. Set by the first purchase          |
| `cosmos-store:cart`                                                                      | `localStorage`                                                         | The cart: product IDs and quantities                                                      |
| `cosmos-store:checked-out`                                                               | `sessionStorage`                                                       | The order the cart was checked out as, so the cart empties once it is paid                |
| `theme`                                                                                  | `localStorage`                                                         | `light` or `dark`, after the theme button is pressed                                      |
| `orbit-core:lastConnectedConnector`, `orbit-core:recentlyConnectedConnectorsListHelpers` | `sessionStorage`; `localStorage` when "Remember this wallet" is ticked | The last wallet connection and the recent wallets (Satellite Connect)                     |
| `payments-shop-transactions`                                                             | `localStorage`                                                         | The payments the checkout handed over: hash, wallet, network, status (Pulsar)             |
| `nova-transactions:closedToasts`                                                         | `localStorage`                                                         | Which transaction toasts were closed (Nova Transactions)                                  |
| `quasar-sdk:checkoutHandOvers:<token>`, `nova-payments:sponsoredBatches`                 | `sessionStorage`                                                       | A payment the wallet sent, until Quasar takes it, so a reload does not offer to pay again |
| `quasar-sdk:refundHandOvers`                                                             | `sessionStorage`                                                       | A refund the merchant's wallet sent, in merchant mode only                                |

wagmi keeps nothing in the browser here (`noopStorage`).

## 🌐 External Services

- **Quasar** (`NEXT_PUBLIC_QUASAR_BASE_URL`, Quasar Cloud by default): the server calls the Payments API with the secret key; the browser calls the checkout routes of an invoice with its checkout token. Quasar stores the invoices with the visitor ID and, once paid, the paying wallet.
- **RPC nodes** of Sepolia, Base Sepolia and Solana Devnet: the public ones, or Alchemy with `NEXT_PUBLIC_ALCHEMY_KEY`. The browser reads balances and fees there.
- **Block explorers** open only when a visitor follows the link of a transaction.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── actions.ts                    # Server Actions: buyProduct, checkoutCart, joinClub
│   ├── merchantActions.ts            # Refund calls, in merchant mode only
│   ├── page.tsx                      # The shop
│   ├── products/[productId]/         # A product
│   ├── club/                         # Cosmos Club
│   ├── orders/, orders/[orderId]/    # Your orders, and one order
│   └── api/
│       ├── webhooks/quasar/          # verifyWebhook: where a shop fulfils orders
│       └── orders/…/documents/       # The invoice and receipt PDF of your own order
├── components/
│   ├── shell/                        # Header, test strip, footer, cart, ShopProvider (the checkout)
│   ├── shop/                         # Product cards, payment methods, the pixel drawings (art.tsx)
│   ├── orders/, club/, ui/           # Status chip, pay and refund buttons, join button, small parts
├── configs/appConfig.ts              # Networks, RPC URLs, the wagmi config
├── lib/
│   ├── quasar.ts                     # The Quasar client (server only)
│   ├── visitor.ts                    # The visitor cookie
│   ├── orders.ts                     # Orders read from the invoices of the visitor
│   ├── catalog.ts, cartStore.ts      # What the shop sells, the cart
│   └── methods.ts, status.ts, …      # Networks, statuses, formats
├── providers/                        # Satellite Connect, Nova Connect, Nova Transactions, Nova Payments
└── styles/app.css                    # The look: Nova's theme variables and the shop's classes
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
- [`@tuwaio/quasar-sdk`](https://payments.docs.tuwa.io/?path=/docs/packages-quasar-sdk-overview--docs), [`@tuwaio/nova-payments`](https://payments.docs.tuwa.io/?path=/docs/packages-nova-payments-overview--docs) and the [Nova UI Kit](https://stories.tuwa.io/) components
- [All starter templates](https://docs.tuwa.io/guides/starter-templates)

---

## 🤝 Contributing & Support

Contributions are welcome! Please read the **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

## 📄 License

[MIT No Attribution](./LICENSE): copy this template without keeping the notice.
