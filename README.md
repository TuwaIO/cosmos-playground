# Welcome to the TUWA Cosmos Playground

<div align="center">
  <img src="https://raw.githubusercontent.com/TuwaIO/workflows/main/preview/tuwa_preview.gif" alt="TUWA Ecosystem Preview" width="100%" max-width="800px" />
</div>

<p align="center">
  <strong>Live demos, code examples, and practical recipes for the entire TUWA ecosystem.</strong>
</p>

---

This repository is the central hub for developers looking to integrate TUWA technologies into their applications. Here you'll find ready-to-use examples demonstrating how our core libraries, **`pulsar-core`** and **`nova-uikit`**, work together to create powerful Web3 user experiences.

Think of this as your interactive launchpad: clone any example, see it run, and borrow patterns for your own projects.

## 🚀 Demos & Examples

This table showcases various integrations, highlighting how TUWA's tools fit into modern frontend stacks.

| Demo | Key Technologies Demonstrated | Status |
|---|---|---|
| **[Next.js App](./examples/nextjs-rainbowkit/)** | **`nova-uikit`**, **`pulsar-core`**, RainbowKit, Next.js | ✅ Ready |
| **[Vite App](./examples/vite-rainbowkit/)** | **`nova-uikit`**, **`pulsar-core`**, RainbowKit, Vite | ✅ Ready |
| **[ConnectKit Demo](./examples/nextjs-connectkit/)** | Using **`nova-uikit`** components with ConnectKit | ✅ Ready |
| **[Dynamic.xyz Demo](./examples/nextjs-dynamic/)** | Integrating the TUWA stack with Dynamic.xyz wallets | ✅ Ready |
| **[Reown AppKit Demo](./examples/nextjs-reown/)** | Integrating the TUWA stack with Reown AppKit | ✅ Ready |
| **[Web3Auth Demo](./examples/nextjs-web3auth/)** | An example showing social logins via Web3Auth | 🚧 In Progress |

## ✨ Core Concepts Demonstrated

These examples are designed to teach you the key features of our core libraries:

### 🚀 Core Engine: `pulsar-core`
* **State Management:** Centralized, reactive state for user transactions data.
* **Transaction Tracking:** Real-time monitoring of transaction lifecycles (pending, success, error).
* **Multi-chain Logic:** Handling provider and network switching behind the scenes.
* **Extensible Trackers:** Custom logic that can be attached to wallet or transaction events.

### 🎨 UI Layer: `nova-uikit`
* **Component Suite:** A rich set of unstyled, accessible React components (`<TxActionButton>`, `<TxModal>`, etc.).
* **Wallet Integration:** Pre-built adapters for popular wallet connectors.
* **Easy Theming:** Full compatibility with TailwindCSS for rapid and deep customization.

## 🏃‍♂️ Getting Started

Running any example on your local machine is simple:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/TuwaIO/cosmos-playground.git](https://github.com/TuwaIO/cosmos-playground.git)
    cd cosmos-playground
    ```
2.  **Navigate to an example folder:**
    ```bash
    cd examples/nextjs-rainbowkit
    ```
3.  **Install dependencies:**
    ```bash
    pnpm install
    ```
4.  **Start the development server:**
    ```bash
    pnpm dev
    ```
The application should now be running on `localhost:3000`.

## 🛠 Prerequisites
* Node.js >= 20.0.0
* pnpm >= 9.0.0

## 🤝 Contributing

We welcome contributions! If you've built something cool with TUWA or want to add a new example (e.g., using a different framework or wallet connector), we'd love to see it.

Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)** before starting, which covers our standards for commit messages and pull requests.

## 🌐 Ecosystem Links

* **[TUWA GitHub Organization](https://github.com/TuwaIO)** - See all our projects.
* **[pulsar-core](https://github.com/TuwaIO/pulsar-core)** - The core logic engine.
* **[nova-uikit](https://github.com/TuwaIO/nova-uikit)** - The UI component library.
* **[workflows](https://github.com/TuwaIO/workflows)** - Our contribution standards and reusable actions.