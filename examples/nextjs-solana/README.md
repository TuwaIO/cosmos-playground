# Pulsar & Nova: Next.js + Solana Example

A minimal example demonstrating how to integrate the **Pulsar Transaction Tracking Engine** and **Nova UI Kit** into a Next.js application using the App Directory and Solana. Wallet connections are handled by **@wallet-ui/core**.

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
- **Solana** for wallet connection
- **Pulsar Engine** for core tracking logic
- **Nova UI Kit** for pre-built React components
- **TailwindCSS** for styling
- **@wallet-ui/core** for Web3 interactions

## 🎯 Features Demonstrated

- ✅ Wallet connection with Solana
- ✅ Real-time transaction tracking
- ✅ Comprehensive transaction history modal
- ✅ Automatic toast notifications for transaction status
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
├── app/           # Next.js App Directory (pages and layouts)
├── components/    # Application-specific React components
├── constants.ts   # Shared constants
├── hooks/         # Custom React hooks
├── providers/     # React Context providers, including NovaProvider setup
├── programs/      # Solana Program generated client
├── styles/        # Global CSS and Tailwind styles
├── targets/       # Solana Program IDL
└── transactions/  # Logic for defining transaction actions and callbacks
└── utils/         # Helpers functions
```

## 📚 Core Packages Used

- `@tuwaio/pulsar-core`: The core, chain-agnostic tracking engine.
- `@tuwaio/pulsar-solana`: Adapter for Solana-compatible chains.
- `@tuwaio/pulsar-react`: React hooks for integrating your app with the Pulsar engine.
- `@tuwaio/nova-transactions`: Pre-built UI components (Modals, Toasts, Buttons, etc.).
- `@wallet-ui/core`: Solana wallet connection management.

## ⚡ Prerequisites

Make sure you have the following installed:

- **Node.js** \>= 20.0.0
- **pnpm** \>= 9.0.0

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm
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
- [Gill Documentation](https://www.gillsdk.com/)
- [@wallet/ui Documentation](https://wallet-ui.dev/)

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

Built with ❤️ using the **Pulsar & Nova** ecosystem.

## License

[Apache License 2.0](./LICENSE)
