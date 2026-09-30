# TUWA SDK: Next.js, EVM and SIWX

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

A Next.js app for EVM chains with wallet connection, SIWX sign-in (CAIP-122) and tracked transactions, built on the TUWA SDK (`@tuwaio/sdk` with `@tuwaio/evm-sdk`). It is a template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); the [Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react) builds the same setup step by step (EVM tab).

---

## 🚀 Quick Start

```bash
npx @tuwaio/create-cosmos-playground   # choose nextjs-evm
cd my-app
cp .env.example .env
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Node.js 20.9 or newer is required. For local development every variable in `.env` is optional; `pnpm build` and `pnpm start` need `SIWX_DEMO_SIGNING_SECRET`.

---

## 🎯 What It Shows

- **Wallet connection** with the Nova Connect modals on Satellite Connect, through wagmi connectors: injected wallets, WalletConnect and Safe{Wallet}.
- **SIWX sign-in:** Nova Connect asks every connected wallet to sign a CAIP-122 message with a nonce from the server; the server verifies it and keeps the session in an `HttpOnly` cookie. A wallet that refuses to sign is disconnected.
- **Tracked transactions** with Pulsar and the Nova Transactions modals and toasts: a counter contract on Sepolia, called directly and as an ERC-4337 UserOperation through Pimlico.
- **Transaction history** saved to `localStorage`, with tracking that resumes after a reload.

---

## 📦 TUWA Packages

| Import                                                                            | Used for                                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@tuwaio/sdk/nova-connect`, `/nova-connect/components`, `/nova-connect/satellite` | `NovaConnectProvider` with the `siwx` option, `ConnectButton`             |
| `@tuwaio/sdk/nova-transactions`, `/nova-transactions/providers`                   | `NovaTransactionsProvider`, `TxActionButton`                              |
| `@tuwaio/sdk/pulsar`, `@tuwaio/sdk/orbit`                                         | The Pulsar store and the network helpers                                  |
| `@tuwaio/sdk/siwx/server-next`                                                    | `createStatelessDemoSiwxHandler`: the `/api/siwx/*` routes                |
| `@tuwaio/evm-sdk/*`                                                               | The EVM adapters of Satellite and Pulsar, `EVMConnectorsWatcher`, Pimlico |

---

## 🔧 Environment Variables

| Variable                        | Description                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `SIWX_DEMO_SIGNING_SECRET`      | Signs the session cookies, at least 32 characters (`openssl rand -base64 32`). Required in production        |
| `NEXT_PUBLIC_APP_URL`           | Origin of the app: the only domain the SIWX server accepts. Default: `http://localhost:3000`                 |
| `NEXT_PUBLIC_WALLET_PROJECT_ID` | WalletConnect project ID from [dashboard.reown.com](https://dashboard.reown.com); use your own in production |
| `NEXT_PUBLIC_ALCHEMY_KEY`       | Alchemy key for the Ethereum Mainnet and Sepolia RPC URLs. Default: public RPC URLs                          |
| `NEXT_PUBLIC_PIMLICO_API_KEY`   | Pimlico key for the ERC-4337 transaction                                                                     |

---

## 🛡️ SIWX Sessions

The template uses the **stateless demo profile** of `@tuwaio/siwx-server`, so it runs without a database: the session is a signed token in an `HttpOnly` cookie and expires after 30 minutes. Its limits:

- a session cannot be revoked before it expires;
- used nonces are remembered in the memory of each server instance, so with several instances a signed message can be replayed on another one within 5 minutes.

For production, switch `src/app/api/siwx/[...siwx]/route.ts` to `createSiwxApiHandler` with a shared session and nonce store (Redis or a database), as described on the [`@tuwaio/siwx-server`](https://siwx.docs.tuwa.io/packages/siwx-server) page. Server code reads the session from the cookie with `getSiwxServerSession`; never trust a session object sent by the browser.

---

## 📁 Project Structure

```
src/
├── abis/          # ABI of the counter contract
├── app/           # Next.js App Router: layout, page and the /api/siwx route
├── components/    # Header, home page, the transaction block
├── configs/       # wagmi config and EVM chains
├── constants.ts   # Address of the counter contract
├── hooks/         # Pulsar store
├── lib/           # Signing secret of the SIWX sessions
├── providers/     # Satellite Connect, Nova Connect (with SIWX) and Nova Transactions providers
├── styles/        # Tailwind CSS v4 and the Nova stylesheets
└── transactions/  # The transaction actions and their types
```

---

## 🛠️ Scripts

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `pnpm dev`      | Start the development server            |
| `pnpm build`    | Build for production                    |
| `pnpm start`    | Serve the production build              |
| `pnpm lint`     | Check the code with ESLint and Prettier |
| `pnpm lint:fix` | Fix what ESLint and Prettier can fix    |

---

## 📖 Learn More

- [Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react) and [Multi-Chain Authentication guide](https://docs.tuwa.io/guides/multi-chain-auth-siwx-caip122)
- [TUWA SDK](https://sdk.docs.tuwa.io/) and [SIWX](https://siwx.docs.tuwa.io/) documentation
- [Nova UI Kit Storybook](https://stories.tuwa.io/): the components, their props and theming
- [All starter templates](https://docs.tuwa.io/guides/starter-templates)

---

## 🤝 Contributing & Support

Contributions are welcome! Please read the **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)
