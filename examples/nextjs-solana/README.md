# Pulsar & Cosmos SDK: Next.js Solana Only Example

[![License](https://img.shields.io/npm/l/@tuwaio/sdk.svg)](./LICENSE)

A minimal example demonstrating how to integrate **Pulsar Transaction Tracking Engine** and **Nova UI Kit** into a Next.js Solana application using `@tuwaio/solana-sdk`.

This example is part of the [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground) monorepo.

---

## 🏛️ Overview

This template demonstrates clean Solana integration using the TUWA Ecosystem SDKs:
- **Client**: Solana wallet connection via `@tuwaio/solana-sdk/satellite`, Nova UI via `@tuwaio/sdk/nova-connect`, and Pulsar tracking via `@tuwaio/solana-sdk/pulsar`.

---

## 💾 Installation & Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
# Open http://localhost:3000 in your browser
```

## 📦 What's Included

- **React 19** with TypeScript
- **Next.js 16** with App Directory
- **Nova Connect** for wallet connection
- **Pulsar Engine** for core tracking logic
- **Nova UI Kit** for pre-built React components
- **TailwindCSS** for styling
- **Wagmi** for Web3 interactions

## 🎯 Features Demonstrated

- ✅ Wallet connection with Nova Connect
- ✅ Real-time, multi-chain transaction tracking
- ✅ Comprehensive transaction history modal
- ✅ Automatic toast notifications for transaction status
- ✅ Support for standard EVM, Gelato, and Safe transactions
- ✅ Server-side rendering compatibility

## 🛠️ Available Scripts

```bash
pnpm dev # Start development server
pnpm build # Build for production
pnpm start # Start production server
```

## 📁 Project Structure

```
src/
├── abis/          # Smart contract ABIs
├── app/           # Next.js App Directory (pages and layouts)
├── components/    # Application-specific React components
├── configs/       # Wagmi and chain configurations
├── constants.ts   # Shared constants
├── hooks/         # Custom React hooks
├── providers/     # React Context providers, including NovaProvider setup
├── styles/        # Global CSS and Tailwind styles
└── transactions/  # Logic for defining transaction actions and callbacks
```

## 📚 Core Packages Used

- `@tuwaio/orbit-core`: The core, network adapters utils.
- `@tuwaio/orbit-solana`: Solana, network adapter utils.
- `@tuwaio/pulsar-core`: The core, chain-agnostic tracking engine.
- `@tuwaio/pulsar-solana`: Adapter for Solana-compatible chains, including trackers for Gelato and Safe.
- `@tuwaio/pulsar-react`: React hooks for integrating your app with the Pulsar engine.
- `@tuwaio/nova-transactions`: Pre-built UI components (Modals, Toasts, Buttons, etc.).

## ⚡ Prerequisites

Make sure you have the following installed:

- **Node.js** \>= 20.0.0
- **pnpm** \>= 9.0.0

<!-- end list -->

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm
```

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# Optional: Alchemy API key for solana mainnet RPC URL
NEXT_PUBLIC_ALCHEMY_KEY=your_alchemy_key
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
- [Next.js Documentation](https://nextjs.org/docs)
- [Gill Documentation](https://www.gillsdk.com/)

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)
