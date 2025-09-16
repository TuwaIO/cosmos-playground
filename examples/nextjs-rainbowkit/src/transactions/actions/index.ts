import { config } from '@/configs/wagmiConfig';
import { incrementGelato } from '@/transactions/actions/incrementGelato';

import { increment } from './increment';

export const txActions = {
  increment: () => increment({ wagmiConfig: config }),
  incrementGelato: () => incrementGelato(),
};
