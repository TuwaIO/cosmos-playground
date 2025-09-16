import { config } from '@/configs/wagmiConfig';

import { increment } from './increment';

export const txActions = {
  increment: () => increment({ wagmiConfig: config }),
};
