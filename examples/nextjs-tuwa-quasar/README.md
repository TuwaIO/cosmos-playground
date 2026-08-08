# Pulsar & Quasar Cloud Sync: Next.js Example

[![License](https://img.shields.io/npm/l/@tuwaio/sdk.svg)](./LICENSE)

A minimal example demonstrating how to integrate the **Pulsar Transaction Tracking Engine**, **Nova UI Kit**, **SIWX (CAIP-122 Auth)**, and **Quasar Cloud Sync** (via Quasar SDK) into a Next.js application, supporting both **Solana** and **EVM** transactions with automated cloud synchronization.

This example is part of the [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground) monorepo.

---

## 🏛️ Overview

This reference template demonstrates full-stack Web3 application integration using the TUWA Ecosystem SDKs:
- **Client**: Multi-chain connection via `@tuwaio/sdk/satellite`, Nova UI components via `@tuwaio/sdk/nova-connect`, and CAIP-122 Sign-In With X via `@tuwaio/sdk/siwx`.
- **Server**: Server-side payload verification via `@tuwaio/sdk/siwx/server-next` and Cloud Transaction Sync via `@tuwaio/quasar-sdk`.

---

## 💾 Installation & Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# Open http://localhost:3000 in your browser
```

---

## 📦 What's Included

- **React 19** with TypeScript
- **Next.js 16** (App Router)
- **Solana** & **EVM** multi-chain wallet connections
- **Pulsar Engine** for transaction tracking
- **Quasar SDK** for cloud synchronization and transaction persistence
- **SIWX (CAIP-122)** for off-chain authentication
- **Nova UI Kit** for pre-built React components

---

## 🔧 Environment Variables

Create a `.env` file in the project root (`examples/nextjs-tuwa-quasar`):

```env
# Required: WalletConnect Project ID from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLET_PROJECT_ID=your_project_id

# Required: Quasar SDK Secret Key for authenticating backend requests to Quasar API
QUASAR_SDK_SK=sk_live_...

# Optional: Quasar API Base URL. Defaults to https://api.tuwa.io.
NEXT_PUBLIC_QUASAR_BASE_URL=https://api.tuwa.io

# Optional: Gelato API key for sponsoring transactions
NEXT_PUBLIC_GELATO_API_KEY=your_project_key
```

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy this Next.js example is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

### Other Platforms

```bash
# Build the application
pnpm build
# The output will be in the .next directory.
# Deploy the contents of this directory to your hosting provider.
```

## 📖 Learn More

For detailed documentation and advanced usage:

- [Orbit Documentation](https://orbit.docs.tuwa.io/)
- [Satellite Documentation](https://satellite.docs.tuwa.io/)
- [Pulsar Documentation](https://pulsar.docs.tuwa.io/)
- [Nova Documentation](https://stories.tuwa.io/?path=/docs/introduction--docs)
- [SDK Documentation](https://sdk.docs.tuwa.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Gill Documentation](https://www.gillsdk.com/)

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)
