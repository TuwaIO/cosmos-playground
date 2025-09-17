import { SolanaClient, TransactionSendingSigner } from 'gill';

import { increment, IncrementTxParams } from '@/transactions/actions/increment';
import { initialize } from '@/transactions/actions/initialize';

export type BaseTxParams = {
  client: SolanaClient;
  signer: TransactionSendingSigner;
};

export const txActions = {
  increment: ({ client, signer, solanatest }: IncrementTxParams) => increment({ client, signer, solanatest }),
  initialize: ({ client, signer }: BaseTxParams) => initialize({ client, signer }),
};
