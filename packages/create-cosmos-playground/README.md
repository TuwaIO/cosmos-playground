# @tuwaio/create-cosmos-playground

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/create-cosmos-playground.svg)](https://www.npmjs.com/package/@tuwaio/create-cosmos-playground)
[![License](https://img.shields.io/npm/l/@tuwaio/create-cosmos-playground.svg)](https://github.com/TuwaIO/cosmos-playground/blob/main/packages/create-cosmos-playground/LICENSE)

The CLI that creates a TUWA app from a [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground) template.

---

## 🚀 Usage

```bash
npx @tuwaio/create-cosmos-playground
```

The CLI:

1. asks for a template and a project name;
2. downloads the template from the `main` branch of [`cosmos-playground/examples`](https://github.com/TuwaIO/cosmos-playground/tree/main/examples) with `degit` (no Git history);
3. installs the dependencies with pnpm, or with bun, yarn or npm when pnpm is not installed. With pnpm, it allows the build scripts of the wallet SDKs (`pnpm-workspace.yaml`) so the install does not stop on them.

```
✨ Creating a new Cosmos Playground project...
✔ Which template would you like to use? › nextjs-tuwa
✔ What is the name of your new project? (e.g., my-new-app) … my-app

⬇️ Downloading template "nextjs-tuwa" from GitHub...
🎉 Your new project "my-app" has been created!

📦 Installing dependencies with pnpm...

✅ Done! Next steps:
cd ./my-app
cp .env.example .env   # then fill in the values you need (see README.md)
pnpm dev
```

The templates and what they show are listed in the [Starter Templates](https://docs.tuwa.io/guides/starter-templates) guide and the [repository README](https://github.com/TuwaIO/cosmos-playground#readme).

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

---

## 📄 License

[Apache License 2.0](https://github.com/TuwaIO/cosmos-playground/blob/main/packages/create-cosmos-playground/LICENSE)
