# AGENTS.md: nextjs-tuwa-quasar

This app is the full-stack Next.js template: EVM and Solana wallets, SIWX sign-in, transactions synced to Quasar with the history loaded back, and a webhook receiver. It comes from the `nextjs-tuwa-quasar` template of [Cosmos Playground](https://github.com/TuwaIO/cosmos-playground); `README.md` describes its features, environment variables and files.

Before changing TUWA code, read the TUWA integration guide for agents: https://raw.githubusercontent.com/TuwaIO/workflows/main/TUWA_AGENTS.md. It lists the packages and their import paths, working code for every part of this app, and the full list of rules.

## Commands

`pnpm dev`, `pnpm build`, `pnpm webhooks` (relays Quasar webhooks to localhost), `pnpm lint:fix`, `pnpm generate:solana` (after changing the Anchor IDL in `src/targets`).

## Rules

- Create the wagmi config, the Satellite adapters and the Pulsar store once, at module level, never inside components.
- Send blockchain writes through `executeTxAction` of the Pulsar store and read their status from the store.
- Pass `siwx` only to `NovaConnectProvider`, with `getNonce`: the `/api/siwx` routes accept only nonces they issued.
- The Server Actions in `src/app/actions.ts` read the session from the cookie and check `isSessionMatchingTarget` before calling Quasar; keep that check in every new action.
- `onRemoteCreate` must throw when the sync fails, so Pulsar retries it. Import `preFlightTxCheck` from `@tuwaio/quasar-sdk/react`.
- `QUASAR_SECRET_KEY`, `QUASAR_WEBHOOK_SECRET` and `SIWX_DEMO_SIGNING_SECRET` are server-only: never read them in client code or give them a `NEXT_PUBLIC_` prefix.
- Never edit `src/programs/solanatest/generated`: regenerate it with `pnpm generate:solana`.
- Keep strict TypeScript without `any`; run `pnpm lint:fix` after changes.
