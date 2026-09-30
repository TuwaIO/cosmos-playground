# AGENTS.md: custom-style

This app is a client-side Vite React app on the TUWA SDK for EVM chains that restyles every Nova component. It comes from the `custom-style` template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); `README.md` describes its features, environment variables and files.

Before changing TUWA code, read the TUWA integration guide for agents: https://raw.githubusercontent.com/TuwaIO/workflows/main/TUWA_AGENTS.md. It lists the packages and their import paths, working code for every part of this app, and the full list of rules.

## Commands

`pnpm dev`, `pnpm build`, `pnpm type-check`, `pnpm lint:fix`.

## Rules

- Create the wagmi config, the Satellite adapters and the Pulsar store once, at module level, never inside components.
- Send blockchain writes through `executeTxAction` of the Pulsar store and read their status from the store.
- The theme lives in `src/styles`: `app.css` overrides the `--tuwa-*` variables, `customization/` holds the `customization` objects of the Nova components. Change styles there, not in the components.
- Do not add Solana packages: the app has no Solana network.
- Keep strict TypeScript without `any`; run `pnpm lint:fix` after changes.
