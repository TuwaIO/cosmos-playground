# Pulsar & Cosmos SDK: Vite + TUWA Example

A minimal example demonstrating how to integrate the **All TUWA ecosystem** into a React application using Vite.

This example is part of the [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground) monorepo.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install
# Start development server
pnpm dev
# Open http://localhost:5173 in your browser
```

## 📦 What's Included

- **React 19** with TypeScript
- **Vite** for a blazing-fast development experience
- **Satellite Connect** for wallet connection
- **Pulsar Engine** for core tracking logic
- **Nova UI Kit** for pre-built React components
- **TailwindCSS** for styling

## 🎯 Features Demonstrated

- ✅ Wallet connection with Satellite Connect
- ✅ Real-time, multi-chain transaction tracking
- ✅ Comprehensive transaction history modal
- ✅ Automatic toast notifications for transaction status
- ✅ Support for standard EVM, Gelato, and Safe transactions

## 🛠️ Available Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm type-check # Run TypeScript checks
```

## 📁 Project Structure

```
src/
├── abis/          # Smart contract ABIs
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
VITE_WALLET_PROJECT_ID=your_project_id

# Optional: Gelato API key for sponsoring transactions
VITE_GELATO_API_KEY=your_project_key

# Optional: Alchemy API key for solana mainnet RPC URL
VITE_ALCHEMY_KEY=your_alchemy_key
```

_Note: Vite requires environment variables to be prefixed with `VITE_`.\_

## 📖 Learn More

For detailed documentation and advanced usage:

- [Pulsar & Nova Documentation](https://docs.tuwa.io/)
- [Vite Documentation](https://vitejs.dev/)
- [Satellite Connect](https://satellite.docs.tuwa.io/)
- [Wagmi Documentation](https://wagmi.sh/)

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

## License

[Apache License 2.0](./LICENSE)
