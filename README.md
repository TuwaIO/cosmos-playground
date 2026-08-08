# 🪐 Cosmos Playground

[![License](https://img.shields.io/npm/l/@tuwaio/sdk.svg)](./LICENSE)

Official collection of application templates, integration examples, and CLI scaffolding for the **TUWA Ecosystem** (`Orbit`, `Satellite`, `Pulsar`, `Nova UI`, `SIWX`, `Quasar`, `SDK`).

---

## 🏛️ Ecosystem Architecture & Templates

The **Cosmos Playground** monorepo contains production-ready dApp starter kits:

| Template | Framework | Features |
| :--- | :--- | :--- |
| [**`nextjs-tuwa-quasar`**](./examples/nextjs-tuwa-quasar) | Next.js 16 (App Router) | Multi-chain (EVM + Solana), Pulsar Tracking, Quasar Cloud Sync, SIWX (CAIP-122) Auth **(Benchmark Template)** |
| [**`nextjs-evm`**](./examples/nextjs-evm) | Next.js 16 (App Router) | EVM Network Adapter, Pulsar Tracking Engine, SIWX (CAIP-122) Auth |
| [**`nextjs-tuwa`**](./examples/nextjs-tuwa) | Next.js 16 (App Router) | Multi-chain (EVM + Solana), Pulsar Tracking Engine |
| [**`nextjs-tuwa-not-sdk`**](./examples/nextjs-tuwa-not-sdk) | Next.js 16 (App Router) | Granular non-umbrella package integration (`@tuwaio/satellite-*`, `@tuwaio/pulsar-*`, `@tuwaio/nova-*`) |
| [**`nextjs-solana`**](./examples/nextjs-solana) | Next.js 16 (App Router) | Solana Network Adapter, Gill/Wallet-Standard, Pulsar Tracking Engine |
| [**`custom-style`**](./examples/custom-style) | Vite + React 19 | Custom Tailwind CSS styling overrides for Nova UI Kit |
| [**`vite-tuwa`**](./examples/vite-tuwa) | Vite + React 19 | Fast client-side multi-chain dApp template |

---

## 🚀 Scaffolding via CLI

Scaffold a new dApp in seconds using the official CLI:

```bash
npx @tuwaio/create-cosmos-playground
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

## 📄 License

[Apache License 2.0](./LICENSE)
