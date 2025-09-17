import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';
import { Address } from 'gill';

import { PROGRAM_ID } from '@/constants';
import { getIncrementInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions/index';

export type IncrementTxParams = BaseTxParams & { solanatest: Address };

export function increment({ client, signer, solanatest }: IncrementTxParams) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getIncrementInstruction({ solanatest }, { programAddress: PROGRAM_ID }),
  });
}
