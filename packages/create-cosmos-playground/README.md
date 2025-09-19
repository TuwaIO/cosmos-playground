# @tuwaio/create-cosmos-playground

A CLI tool to scaffold new Cosmos Playground examples quickly and easily. This tool helps you start new projects based on predefined templates hosted on GitHub.

---

## ✨ Features

- **Intuitive prompts:** Easily select from available project templates and name your new project.
- **Automated setup:** The tool automatically downloads your chosen project template from the GitHub repository.
- **Seamless dependencies:** Dependencies are automatically installed using `pnpm` after scaffolding.
- **Multiple templates:** Supports a variety of templates for different web3 frameworks and chains.

---

## 🛠 Prerequisites

- Node.js >= 20.0.0
- An internet connection is required to download templates and dependencies.

---

## 🚀 Usage

To use this tool, simply run the `npx` command in your terminal:

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

Built with ❤️ from **TUWA**.

## License

[Apache License 2.0](./LICENSE)
