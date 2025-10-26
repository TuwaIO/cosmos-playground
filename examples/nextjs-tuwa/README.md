# Pulsar & Nova: Next.js + Solana/EVM Example

A minimal example demonstrating how to integrate the **Pulsar Transaction Tracking Engine** and **Nova UI Kit** into a Next.js application, supporting both **Solana** and **EVM** transactions. Wallet connections are handled by **Nova Connect**.

This example is part of the [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground) monorepo.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install
# Start development server
pnpm dev
# Open http://localhost:3000 in your browser
````

## 📦 What's Included

- **React 19** with TypeScript
- **Next.js 15** with App Directory
- **Solana** and **EVM** for wallet connections
- **Pulsar Engine** for core tracking logic
- **Nova UI Kit** for pre-built React components
- **TailwindCSS** for styling
- **Nova Connect** for Web3 interactions on EVM and Solana

## 🎯 Features Demonstrated

- ✅ Wallet connection for both **Solana** and **EVM**
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

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# Required: Get a Project ID from [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLET_PROJECT_ID=your_project_id

# Optional: Gelato API key for sponsoring transactions
NEXT_PUBLIC_GELATO_API_KEY=your_project_key

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

- [Pulsar & Nova Documentation](https://docs.tuwa.io/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [Gill Documentation](https://www.gillsdk.com/)
- [Satellite Connect](https://satellite.docs.tuwa.io/)

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

Built with ❤️ using the **Pulsar & Nova** ecosystem.

## License

[Apache License 2.0](./LICENSE)