# @tuwaio/create-cosmos-playground

A CLI tool to scaffold new Cosmos Playground examples quickly and easily. This tool helps you start new projects based on predefined templates hosted on GitHub.

---

## Features

- **Intuitive prompts:** Easily select from available project templates and name your new project.
- **Automated setup:** The tool automatically downloads the selected template from the GitHub repository.
- **Dependency installation:** Dependencies are automatically installed using `pnpm` after scaffolding.
- **Multiple templates:** Supports a variety of templates for different web3 frameworks and chains.

---

## Requirements

- **Node.js** v14+ installed on your machine.
- An internet connection for downloading templates and dependencies.

---

## Usage

To use the tool, simply run the `npx` command:

```bash
npx @tuwaio/create-cosmos-playground
```

The CLI will guide you through the process:

It will prompt you to select a project template.

You will be asked to enter a name for your new project.

It will automatically download the chosen template and install its dependencies.

Example
Here is a typical workflow:
```bash
# Execute the CLI tool
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
# cd my-new-app
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
