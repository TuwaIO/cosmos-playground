# TUWA SDK: Custom Style

[![License: MIT-0](https://img.shields.io/badge/license-MIT--0-blue.svg)](./LICENSE)

A Vite React app for EVM chains that restyles Nova Connect and Nova Transactions with its own theme: the `--tuwa-*` CSS variables for the colors, and the `customization` props for classes and extra content. Built on the TUWA SDK (`@tuwaio/sdk` with `@tuwaio/evm-sdk`); the build contains no Solana code of TUWA. It is a template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground).

---

## 🚀 Quick Start

```bash
npx @tuwaio/create-cosmos-playground   # choose custom-style
cd my-app
cp .env.example .env
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173). Node.js 20.19 or newer is required; every variable in `.env` is optional for local development.

---

## 🎨 How the Theme Is Built

| File                                        | What it changes                                                                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/styles/app.css`                        | The `--tuwa-*` variables (text, background, border and status colors), scrollbars and a few Nova classes                                                           |
| `src/styles/customization/shared_styles.ts` | Class sets reused by the other customization files                                                                                                                 |
| `src/styles/customization/*.ts(x)`          | The `customization` objects of `ConnectButton`, the connect and connected modals, balances, the chain list, the transaction history and `NovaTransactionsProvider` |
| `src/components/connect-wallet/`            | Extra content of the connected modal: ERC-20 balances (`renderExtraBalances`) and a custom link (`renderCustomContent`)                                            |

The connect modal also shows the `legal` links of `NovaConnectProvider`; replace them with the documents of your app. The variables and every `customization` option are described on the [Theming page](https://stories.tuwa.io/?path=/docs/theming--docs) of the Nova UI Kit Storybook.

---

## 🎯 What It Shows

- **Wallet connection** with the restyled Nova Connect modals, through wagmi connectors: injected wallets, WalletConnect, Safe{Wallet} and a read-only impersonated wallet. Chains: Monad, Ethereum, Arbitrum, Sepolia and Monad Testnet.
- **ERC-20 balances** (USDC, USDT0) in the connected modal, read from the chain and cached in a Zustand store.
- **A tracked transaction** with Pulsar and the restyled Nova Transactions modals and toasts: a counter contract on Sepolia.

---

## 🔧 Environment Variables

Vite exposes only variables prefixed with `VITE_`, and inlines them into the bundle: put no secrets here.

| Variable                 | Description                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `VITE_WALLET_PROJECT_ID` | WalletConnect project ID from [dashboard.reown.com](https://dashboard.reown.com); use your own in production |
| `VITE_ALCHEMY_KEY`       | Alchemy key for the Ethereum Mainnet and Sepolia RPC URLs. Default: public RPC URLs                          |

---

## 📁 Project Structure

```
src/
├── abis/          # ABI of the counter contract
├── components/    # Header, home page, the transaction block, extra content of the connected modal
├── configs/       # wagmi config, EVM chains, the ERC-20 tokens of each chain
├── constants.ts   # Address of the counter contract
├── hooks/         # Pulsar store, ERC-20 balance hook
├── providers/     # Satellite Connect, Nova Connect and Nova Transactions providers with the customization
├── styles/        # The theme: CSS variables and the customization objects
├── transactions/  # The transaction action and its type
├── App.tsx
└── main.tsx
```

---

## 🛠️ Scripts

| Script            | Description                             |
| ----------------- | --------------------------------------- |
| `pnpm dev`        | Start the development server            |
| `pnpm build`      | Build the static site into `dist/`      |
| `pnpm preview`    | Serve the build                         |
| `pnpm type-check` | Check the types with TypeScript         |
| `pnpm lint`       | Check the code with ESLint and Prettier |
| `pnpm lint:fix`   | Fix what ESLint and Prettier can fix    |

---

## 📖 Learn More

- [Nova UI Kit Storybook](https://stories.tuwa.io/): the [Theming](https://stories.tuwa.io/?path=/docs/theming--docs) page and the `customization` props of every component
- [TUWA SDK](https://sdk.docs.tuwa.io/): the subpaths of `@tuwaio/sdk` and `@tuwaio/evm-sdk`
- [All starter templates](https://docs.tuwa.io/guides/starter-templates)

---

## 🤝 Contributing & Support

Contributions are welcome! Please read the **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)
