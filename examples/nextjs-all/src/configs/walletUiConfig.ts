import { createSolanaDevnet, createWalletUiConfig } from '@wallet-ui/react';

export const configSolana = createWalletUiConfig({
  clusters: [
    // You can add mainnet when you're ready
    // createSolanaMainnet('https://mainnet.your-rpc.com?api-key=secret'),
    createSolanaDevnet(),
  ],
});
