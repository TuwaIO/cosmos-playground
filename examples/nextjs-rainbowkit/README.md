# TUWA Web3 Transaction Tracking Suite + Next.js + RainbowKit Example

A minimal example demonstrating how to integrate the **TUWA Web3 Transaction Tracking Suite** into a Next.js application using App Directory and RainbowKit.

## 🚀 Quick Start
```bash
# Install dependencies
pnpm install
# Start development server
pnpm dev
# Open [http://localhost:3000](http://localhost:3000) in your browser
``` 

## 📦 What's Included
- **React 19** with TypeScript
- **Next.js 15** with App Directory
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
- ✅ Server-side rendering compatible

## 🛠 Available Scripts
```bash
 pnpm dev # Start development server 
 pnpm build # Build for production 
 pnpm start # Start production server 
```

## 📁 Project Structure
``` 
src/
├── abis/          # Contracts abis
├── app/           # Next js app directory
├── components/    # React components
├── hooks/         # Custom React hooks
├── providers/     # Context providers
├── styles/        # CSS and Tailwind styles
├── utils/         # Utility functions
├── configs/       # Wagmi config and other
├── transactions/  # Transactions actions, types and callbacks
```

## 🌐 Supported Networks
- Ethereum Mainnet
- Polygon
- Arbitrum
- Optimism
- Base
- Sepolia (Testnet)
- And other EVM-compatible chains

## 📚 TUWA Packages Used
- `@tuwaio/web3-transactions-tracking-core` - Core tracking logic
- `@tuwaio/evm-transactions-tracking` - EVM chain support
- `@tuwaio/transactions-tracking-ui` - Pre-built UI components

## ⚡ Prerequisites
Make sure you have the following installed:
- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
```bash
# Install pnpm globally if you haven't already
npm install -g pnpm
# Or use corepack (recommended)
corepack enable corepack prepare pnpm@latest --activate
```

## 🔄 Development Workflow
```bash
# Install dependencies
pnpm install
# Start development with hot reload
pnpm dev
# Build for production
pnpm build
# Start production server
pnpm start
``` 

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
pnpm dlx vercel
# Or connect your GitHub repository to Vercel
``` 

### Other Platforms
```bash
# Build the application
pnpm build
# The output will be in the .next directory
# Upload .next, public, and package.json to your hosting provider
``` 

## 🔧 Environment Variables
Create a `.env.local` file in your project root:
```env
# REQUERED: Wallet Connect Project ID
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
# Optional: Gelato project API key
NEXT_PUBLIC_GELATO_API_KEY=your_project_key
``` 

## 🎨 Customization
This example shows basic integration. You can customize:
- **UI Components**: Replace default components with your own
- **Styling**: Modify TailwindCSS classes or add CSS modules
- **Chains**: Add/remove supported blockchain networks
- **Wallet Connectors**: Configure different wallet options
- **Metadata**: Update SEO and social media tags

## ⚠️ Important Notes for Next.js
- **Client Components**: Web3 components must use `'use client'` directive
- **Hydration**: Wallet state may cause hydration mismatches - handle gracefully
- **SSR**: Some Web3 functionalities are client-side only
- **Build Optimization**: Next.js automatically optimizes your bundle

## 📖 Documentation
For detailed documentation and advanced usage:
- [TUWA Documentation](https://docs.tuwa.io/)
- [Next.js App Directory](https://nextjs.org/docs/app)
- [RainbowKit Docs](https://rainbowkit.com/)
- [Wagmi Docs](https://wagmi.sh/)

## 🤝 Contributing
Found an issue or want to improve this example?
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `pnpm install`
4. Make your changes
5. Test the build: `pnpm build`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 🙋‍♂️ Need Help?
- [GitHub Issues](https://github.com/TuwaIO/web3-transactions-tracking/issues)
- [Discussions](https://github.com/TuwaIO/web3-transactions-tracking/discussions)
- [Next.js Discord](https://discord.gg/nextjs)

## 🚀 Next Steps
After running this example, you might want to:
1. **Customize the UI** - Modify components to match your brand
2. **Add more chains** - Configure additional blockchain networks
3. **Integrate with your dApp** - Copy patterns into your existing application
4. **Add Server Actions** - Leverage Next.js server-side capabilities
5. **Optimize Performance** - Use Next.js built-in optimization features
6. **Deploy to production** - Host on Vercel, Netlify, or your preferred platform
7. **Happy coding** - Add any actions from contracts and don't think about tracking, TUWA makes this for you

Built with ❤️ using [TUWA Web3 Transaction Tracking Suite](https://github.com/TuwaIO/web3-transactions-tracking) and [Next.js](https://nextjs.org/)

## Copyright

© 2025 TUWA

## License

[Apache License 2.0](./LICENSE)