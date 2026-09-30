# TUWA SDK: Next.js, EVM and Solana

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

A Next.js app with EVM and Solana wallets in one connect modal and tracked transactions on both networks, built on the TUWA SDK (`@tuwaio/sdk` with `@tuwaio/evm-sdk` and `@tuwaio/solana-sdk`). It is a template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); the [Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react#-evm-and-solana-together) builds the same setup step by step.

---

## 🚀 Quick Start

```bash
npx @tuwaio/create-cosmos-playground   # choose nextjs-tuwa
cd my-app
cp .env.example .env
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Node.js 20.9 or newer is required; every variable in `.env` is optional for local development.

---

## 🎯 What It Shows

- **Wallet connection** with the Nova Connect modals on Satellite Connect: EVM wallets through wagmi connectors (injected, WalletConnect, Safe{Wallet}, a read-only impersonated wallet) and Solana wallets through Wallet Standard. Satellite Connect reconnects the last browser wallet after a page reload.
- **Tracked transactions** with Pulsar and the Nova Transactions modals and toasts:
  - EVM: a counter contract on Sepolia, called directly and as an ERC-4337 UserOperation through Pimlico;
  - Solana: a counter program on devnet (create, increment, decrement and close counter accounts).
- **Transaction history** saved to `localStorage`, with tracking that resumes after a reload.

---

## 📦 TUWA Packages

| Import                                                                            | Used for                                                                  |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `@tuwaio/sdk/nova-connect`, `/nova-connect/components`, `/nova-connect/satellite` | `NovaConnectProvider`, `ConnectButton`, the Satellite Connect store       |
| `@tuwaio/sdk/nova-transactions`, `/nova-transactions/providers`                   | `NovaTransactionsProvider`, `TxActionButton`, `HashLink`                  |
| `@tuwaio/sdk/pulsar`, `@tuwaio/sdk/orbit`                                         | The Pulsar store and the network helpers                                  |
| `@tuwaio/evm-sdk/*`                                                               | The EVM adapters of Satellite and Pulsar, `EVMConnectorsWatcher`, Pimlico |
| `@tuwaio/solana-sdk/*`                                                            | The Solana adapters, `SolanaConnectorsWatcher`, `signAndSendSolanaTx`     |

---

## 🔧 Environment Variables

| Variable                        | Description                                                                                                  |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_APP_URL`           | Origin of the app, for the WalletConnect metadata. Default: `http://localhost:3000`                          |
| `NEXT_PUBLIC_WALLET_PROJECT_ID` | WalletConnect project ID from [dashboard.reown.com](https://dashboard.reown.com); use your own in production |
| `NEXT_PUBLIC_ALCHEMY_KEY`       | Alchemy key for the Ethereum Mainnet, Sepolia and Solana Mainnet RPC URLs. Default: public RPC URLs          |
| `NEXT_PUBLIC_PIMLICO_API_KEY`   | Pimlico key for the ERC-4337 transaction                                                                     |

---

## 📁 Project Structure

```
src/
├── abis/          # ABI of the EVM counter contract
├── app/           # Next.js App Router: layout and page
├── components/    # Header, home page, the EVM and Solana transaction blocks
├── configs/       # wagmi config, EVM chains and Solana RPC URLs
├── constants.ts   # Addresses of the counter contract and program
├── hooks/         # Pulsar store, store of the Solana counter accounts
├── programs/      # Codama client of the Solana program (generated/ is rebuilt by `pnpm generate:solana`)
├── providers/     # Satellite Connect, Nova Connect and Nova Transactions providers
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
| `pnpm lint`            | Check the code with ESLint and Prettier          |
| `pnpm lint:fix`        | Fix what ESLint and Prettier can fix             |
| `pnpm generate:solana` | Regenerate the Codama client from the Anchor IDL |

---

## 📖 Learn More

- [Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react) and [React transaction tracking guide](https://docs.tuwa.io/guides/react-transaction-tracking)
- [TUWA SDK](https://sdk.docs.tuwa.io/): the subpaths of `@tuwaio/sdk`, `@tuwaio/evm-sdk` and `@tuwaio/solana-sdk`
- [Nova UI Kit Storybook](https://stories.tuwa.io/): the components, their props and theming
- [All starter templates](https://docs.tuwa.io/guides/starter-templates)

---

## 🤝 Contributing & Support

Contributions are welcome! Please read the **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)
