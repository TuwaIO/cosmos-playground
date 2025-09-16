import { Config } from 'wagmi';

import { increment } from './increment';

export const txActions = {
  increment: ({ config }: { config: Config }) => increment({ wagmiConfig: config }),
};
