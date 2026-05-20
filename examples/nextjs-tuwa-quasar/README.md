# Pulsar & Quasar Cloud Sync: Next.js Example

A minimal example demonstrating how to integrate the **Pulsar Transaction Tracking Engine**, **Nova UI Kit**, and **Quasar Cloud Sync** (via Quasar SDK) into a Next.js application, supporting both **Solana** and **EVM** transactions with automated cloud synchronization. Wallet connections and Mini-Sessions are handled by **Nova Connect** and the **Quasar SDK**.

This example is part of the [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground) monorepo.

## 🚀 Quick Start

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
- **Solana** and **EVM** for wallet connections
- **Pulsar Engine** for core tracking logic
- **Quasar SDK** for cloud synchronization and transaction persistence
- **Nova UI Kit** for pre-built React components
- **TailwindCSS** for styling
- **Nova Connect** for Web3 interactions on EVM and Solana

## 🎯 Features Demonstrated

- ✅ Wallet connection for both **Solana** and **EVM**
- ✅ Real-time, multi-chain transaction tracking
- ✅ Automated cloud synchronization using **Quasar SDK**
- ✅ Mini-Session signature verification for secure API writes
- ✅ Remote transaction history retrieval directly from Quasar
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
├── programs/      # Solana Program generated client
├── styles/        # Global CSS and Tailwind styles
├── targets/       # Solana Program IDL
└── transactions/  # Logic for defining transaction actions and callbacks
```

## ⚡ Prerequisites

Make sure you have the following installed:

- **Node.js** \>= 20.0.0
- **pnpm** \>= 9.0.0

<!-- end list -->

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm
```

## 🔧 Environment Variables & Quasar Integration

To use this example, you need to configure your environment variables. 

### 1. Register on Quasar
Go to the **[Quasar Console](https://quasar.tuwa.io/)**, sign up or log in, and create a new **Application**.

### 2. Obtain your Secret Key
Inside your Quasar application dashboard, copy your **Secret Key** (which starts with `sk_live_...`).

### 3. Configure the `.env` File
Create a `.env` file in the project root of this example (`nextjs-tuwa-quasar`):

```env
# Required: Get a Project ID from https://cloud.walletconnect.com
NEXT_PUBLIC_WALLET_PROJECT_ID=your_project_id

# Required: Quasar SDK Secret Key for authenticating backend requests to Quasar API
# Register and create an application at https://quasar.tuwa.io/ to get this key
QUASAR_SDK_SK=sk_live_...

# Required: Secret for signing SIWE session cookies (must be at least 32 characters)
SIWE_SESSION_SECRET=your_32_character_long_session_secret

# Required: The origin URL of your application
SIWE_SESSION_URL=http://localhost:3000

# Optional: Gelato API key for sponsoring transactions
NEXT_PUBLIC_GELATO_API_KEY=your_project_key

# Optional: Alchemy API key for Solana mainnet RPC URL
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
- [Wagmi Documentation](https://wagmi.sh/)
- [Gill Documentation](https://www.gillsdk.com/)

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)
