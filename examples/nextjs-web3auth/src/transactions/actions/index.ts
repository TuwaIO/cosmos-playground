import { Config } from '@wagmi/core';

import { increment } from './increment';

export const txActions = {
  increment: ({ config }: { config: Config }) => increment({ wagmiConfig: config }),
};
