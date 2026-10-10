# TUWA SDK: Next.js and Quasar

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

The full-stack template: EVM and Solana wallets, SIWX sign-in (CAIP-122) with server sessions, tracked transactions synced to [Quasar](https://docs.tuwa.io/quasar), the history of the wallet loaded back from Quasar on any device, and a webhook receiver. Built on the TUWA SDK (`@tuwaio/sdk`, `@tuwaio/evm-sdk`, `@tuwaio/solana-sdk`) and `@tuwaio/quasar-sdk`. It is a template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); the [Full-Stack React](https://docs.tuwa.io/guides/full-stack-react) and [Quasar transaction sync](https://docs.tuwa.io/guides/quasar-transaction-sync) guides build the same setup step by step.

---

## 🚀 Quick Start

1. Create the project:

   ```bash
   npx @tuwaio/create-cosmos-playground   # choose nextjs-tuwa-quasar
   cd my-app
   cp .env.example .env
   ```

2. In the [Quasar dashboard](https://quasar.tuwa.io), create an app and put its secret key in `QUASAR_SECRET_KEY` ([Apps & Keys](https://docs.tuwa.io/quasar/apps-and-keys)). Leave the domain allowlist of the app empty: the requests come from your server, without an `Origin` header.
3. Start the app and open [http://localhost:3000](http://localhost:3000):

   ```bash
   pnpm dev
   ```

Node.js 20.9 or newer is required. To receive webhooks on `localhost`, see [Webhooks](#-webhooks).

---

## 🎯 What It Shows

- **Wallet connection** with the Nova Connect modals on Satellite Connect: EVM wallets through wagmi connectors (injected, WalletConnect, Safe{Wallet}) and Solana wallets through Wallet Standard.
- **SIWX sign-in:** Nova Connect asks every connected wallet to sign a CAIP-122 message with a nonce from the server; the server verifies it and keeps the session in an `HttpOnly` cookie. A wallet that refuses to sign is disconnected.
- **Transactions synced to Quasar:**
  - before the wallet prompt, `preFlightTxCheck` stops the transaction when the user is not signed in or Quasar does not respond;
  - each new transaction goes to the `syncTransaction` Server Action, which checks that the signed-in wallet sent it and calls Quasar with the secret key. A failed sync is retried later.
- **History from Quasar:** after the sign-in, the Nova modals show the transactions of the wallet from every device, page by page (`getHistory` Server Action, only for the signed-in wallet).
- **Webhooks:** `POST /api/webhooks/quasar` verifies the `x-quasar-signature` HMAC and keeps the last deliveries in memory; the panel under the transaction block shows the delivery of the latest transaction.
- **Transactions:** a counter contract on Sepolia (directly and as an ERC-4337 UserOperation through Pimlico) and a counter program on Solana devnet.

---

## 📦 TUWA Packages

| Import                                                                            | Used for                                                                                          |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `@tuwaio/quasar-sdk`                                                              | `Quasar`: `syncCreate` and `getHistory` in the Server Actions                                     |
| `@tuwaio/quasar-sdk/react`                                                        | `preFlightTxCheck` in `beforeTxProcess` of the Pulsar store                                       |
| `@tuwaio/sdk/siwx`, `/siwx/server`, `/siwx/server-next`                           | The SIWX session in the browser, `getSiwxServerSession`, the `/api/siwx/*` routes                 |
| `@tuwaio/sdk/pulsar`                                                              | The Pulsar store and the history store (`createTxInMemoryStore`)                                  |
| `@tuwaio/sdk/nova-connect`, `/nova-connect/components`, `/nova-connect/satellite` | `NovaConnectProvider` with the `siwx` option, `ConnectButton`                                     |
| `@tuwaio/sdk/nova-transactions`, `/nova-transactions/providers`                   | `NovaTransactionsProvider` with pagination, `TxActionButton`                                      |
| `@tuwaio/evm-sdk/*`, `@tuwaio/solana-sdk/*`                                       | The adapters of Satellite and Pulsar, the watchers of each network, the Solana transaction signer |

---

## 🔧 Environment Variables

| Variable                        | Description                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `QUASAR_SECRET_KEY`             | Secret key of your Quasar app (`sk_live_…` or `sk_test_…`). Server only                                      |
| `QUASAR_WEBHOOK_SECRET`         | Signing secret of the webhook endpoint (`whsec_…`). Server only                                              |
| `SIWX_DEMO_SIGNING_SECRET`      | Signs the session cookies, at least 32 characters (`openssl rand -base64 32`). Required in production        |
| `NEXT_PUBLIC_QUASAR_BASE_URL`   | URL of a [self-hosted](https://docs.tuwa.io/quasar/self-hosting) Quasar API. Default: Quasar Cloud           |
| `NEXT_PUBLIC_APP_URL`           | Origin of the app: the only domain the SIWX server accepts. Default: `http://localhost:3000`                 |
| `NEXT_PUBLIC_WALLET_PROJECT_ID` | WalletConnect project ID from [dashboard.reown.com](https://dashboard.reown.com); use your own in production |
| `NEXT_PUBLIC_ALCHEMY_KEY`       | Alchemy key for the Ethereum Mainnet, Sepolia and Solana Mainnet RPC URLs. Default: public RPC URLs          |
| `NEXT_PUBLIC_PIMLICO_API_KEY`   | Pimlico key for the ERC-4337 transaction                                                                     |

---

## 🪝 Webhooks

Quasar cannot reach `localhost`, so the Quasar SDK CLI relays the deliveries:

1. In the dashboard, add a webhook endpoint with the URL `http://localhost:3000/api/webhooks/quasar` and put its signing secret in `QUASAR_WEBHOOK_SECRET`.
2. Next to `pnpm dev`, start the relay; it reads the secret from `.env`:

   ```bash
   pnpm webhooks
   ```

A deployed app registers its HTTPS URL (`https://<your-host>/api/webhooks/quasar`) instead. The route keeps the deliveries in the memory of the server process, only to show them in the panel: store them durably and do slow work outside the request in a real app. See [Webhooks](https://docs.tuwa.io/quasar/webhooks) for the payload, the retries and the signature check.

---

## 🛡️ SIWX Sessions

The template uses the **stateless demo profile** of `@tuwaio/siwx-server`, so it runs without a database: the session is a signed token in an `HttpOnly` cookie and expires after 30 minutes. Its limits:

- a session cannot be revoked before it expires;
- used nonces are remembered in the memory of each server instance, so with several instances a signed message can be replayed on another one within 5 minutes.

For production, switch `src/app/api/siwx/[...siwx]/route.ts` and `getSession` in `src/app/actions.ts` to a shared session and nonce store (Redis or a database) with `createSiwxApiHandler`, as described on the [`@tuwaio/siwx-server`](https://siwx.docs.tuwa.io/packages/siwx-server) page. The Server Actions read the session from the cookie; never trust a session object sent by the browser.

---

## 📁 Project Structure

```
src/
├── abis/          # ABI of the EVM counter contract
├── app/
│   ├── actions.ts # Server Actions: syncTransaction and getHistory
│   └── api/       # /api/siwx/* (sign-in) and /api/webhooks/quasar
├── components/    # Header, home page, the EVM and Solana transaction blocks, the webhook panel
├── configs/       # wagmi config, EVM chains and Solana RPC URLs
├── constants.ts   # Addresses of the counter contract and program
├── hooks/         # Pulsar store and history store, store of the Solana counter accounts
├── lib/           # Signing secret of the SIWX sessions, in-memory webhook store
├── programs/      # Codama client of the Solana program (generated/ is rebuilt by `pnpm generate:solana`)
├── providers/     # Satellite Connect, Nova Connect (with SIWX) and Nova Transactions providers
├── styles/        # Tailwind CSS v4 and the Nova stylesheets
├── targets/       # Anchor IDL of the Solana program
└── transactions/  # The transaction actions and their types
```

---

## 🛠️ Scripts

| Script                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| `pnpm dev`             | Start the development server                     |
| `pnpm build`           | Build for production                             |
| `pnpm start`           | Serve the production build                       |
| `pnpm webhooks`        | Relay the webhooks of the `localhost` endpoint   |
| `pnpm lint`            | Check the code with ESLint and Prettier          |
| `pnpm lint:fix`        | Fix what ESLint and Prettier can fix             |
| `pnpm generate:solana` | Regenerate the Codama client from the Anchor IDL |

---

## 📖 Learn More

- [Quasar transaction sync guide](https://docs.tuwa.io/guides/quasar-transaction-sync) and [Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react)
- [Quasar documentation](https://docs.tuwa.io/quasar): apps and keys, quotas, webhooks, self-hosting and the API reference
- [`@tuwaio/quasar-sdk`](https://sdk.docs.tuwa.io/packages/quasar-sdk) and the other [TUWA SDK](https://sdk.docs.tuwa.io/) packages
- [All starter templates](https://docs.tuwa.io/guides/starter-templates)

---

## 🤝 Contributing & Support

Contributions are welcome! Please read the **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)
