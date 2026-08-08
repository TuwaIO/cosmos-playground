# @tuwaio/create-cosmos-playground

[![License](https://img.shields.io/npm/l/@tuwaio/create-cosmos-playground.svg)](./LICENSE)

Layer 8 (L8) CLI tool to scaffold production-ready TUWA Ecosystem dApp starter templates.

---

## 🏛️ Ecosystem Layer Architecture

- **Role in Ecosystem**: Layer 8 (L8) App Generator CLI.
- **Responsibility**: Scaffolding dApp starter templates from `TuwaIO/cosmos-playground` with automated `pnpm` dependency resolution.

---

## 💾 Installation & Usage

```bash
npx @tuwaio/create-cosmos-playground
```

### The CLI will then guide you through the process:

- You'll be prompted to select a project template from a list of available options.
- You will be asked to enter a name for your new project.
- The tool will download the selected template, install dependencies with pnpm, and provide you with final instructions to start your application.

### Example
Here is a typical workflow:

```bash
# Run the CLI tool
npx @tuwaio/create-cosmos-playground

# Example prompts and output:
# ✨ Creating a new Cosmos Playground project...
# ✔ Which template would you like to use? › nextjs-connectkit
# ✔ What is the name of your new project? (e.g., my-new-app) … my-new-app

# ⬇️ Downloading template "nextjs-connectkit" from GitHub...
# 🎉 Your new project "my-new-app" has been created!
# 📦 Installing dependencies with pnpm...
# ... (pnpm install output) ...

# Done! Now run:
# cd ./my-new-app
# pnpm dev
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

## License

[Apache License 2.0](./LICENSE)
