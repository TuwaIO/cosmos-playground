# TUWA Web3 Transaction Tracking Suite + Vite + RainbowKit Example

A minimal example demonstrating how to integrate the **TUWA Web3 Transaction Tracking Suite** into a React application using Vite and RainbowKit.

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
- **Vite** for fast development and building
- **RainbowKit** for wallet connection
- **TUWA Transaction Tracking** components and providers
- **TailwindCSS** for styling
- **Wagmi** for Web3 interactions

## 🎯 Features Demonstrated
- ✅ Wallet connection with RainbowKit
- ✅ Real-time transaction tracking
- ✅ Transaction history modal
- ✅ Toast notifications for tx status
- ✅ Support for multiple EVM chains
- ✅ Gelato meta-transactions tracking
- ✅ Safe multi-sig transactions tracking

## 🛠 Available Scripts
``` bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm type-check # Run TypeScript checks
```
## 📁 Project Structure
``` 
src/
├── abis/          # Contracts abis
├── components/    # React components
├── hooks/         # Custom React hooks
├── providers/     # Context providers
├── styles/        # CSS and Tailwind styles
├── utils/         # Utility functions
├── configs/       # Wagmi config and other
├── transactions/  # Transactions actions, types and callbacks
└── App.tsx        # Main application component
```
## 🔧 Key Configuration Files
- - Vite configuration `vite.config.ts`
- - TypeScript configuration `tsconfig.json`

## 🌐 Supported Networks
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Base
- And other EVM-compatible chains

## 📚 TUWA Packages Used
- - Core tracking logic `@tuwaio/web3-transactions-tracking-core`
- - EVM chain support `@tuwaio/evm-transactions-tracking`
- - Pre-built UI components `@tuwaio/transactions-tracking-ui`

## ⚡ Prerequisites
Make sure you have the following installed:
- >= 20.0.0 **Node.js**
- **pnpm** >= 9.0.0
``` bash
# Install pnpm globally if you haven't already
npm install -g pnpm

# Or use corepack (recommended)
corepack enable
corepack prepare pnpm@latest --activate
```
## 🎨 Customization
This example shows basic integration. You can customize:
- **UI Components**: Replace default components with your own
- **Styling**: Modify TailwindCSS classes or add custom CSS
- **Chains**: Add/remove supported blockchain networks
- **Wallet Connectors**: Configure different wallet options

## 🔄 Development Workflow
``` bash
# Install dependencies
pnpm install

# Start development with hot reload
pnpm dev

# Type checking in watch mode
pnpm type-check --watch

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```
## 📖 Documentation
For detailed documentation and advanced usage:
- [TUWA Documentation](https://docs.tuwa.io/)
- [RainbowKit Docs](https://rainbowkit.com/)
- [Wagmi Docs](https://wagmi.sh/)
- [Vite Docs](https://vitejs.dev/)

## 🤝 Contributing
Found an issue or want to improve this example?
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `pnpm install`
4. Make your changes
5. Run tests: `pnpm type-check`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 🙋‍♂️ Need Help?
- [GitHub Issues](https://github.com/TuwaIO/web3-transactions-tracking/issues)
- [Discussions](https://github.com/TuwaIO/web3-transactions-tracking/discussions)

## 🚀 Next Steps
After running this example, you might want to:
1. **Customize the UI** - Modify components to match your brand
2. **Add more chains** - Configure additional blockchain networks
3. **Integrate with your dApp** - Copy patterns into your existing application
4. **Explore advanced features** - Check out the full documentation for more options
5. **Happy coding** - Added any actions from contracts and don't think about tracking, TUWA make this for you

Built with ❤️ using [TUWA Web3 Transaction Tracking Suite](https://github.com/TuwaIO/web3-transactions-tracking)

## Copyright

2025 TUWA

## License

[Apache License 2.0](./LICENSE)
