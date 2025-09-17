import { install as installEd25519 } from '@solana/webcrypto-ed25519-polyfill';
import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';
import { generateKeyPairSigner } from 'gill';

import { PROGRAM_ID } from '@/constants';
import { getInitializeInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions/actions/index';

// polyfill ed25519 for browsers (to allow `generateKeyPairSigner` to work)
installEd25519();

export async function initialize({ client, signer }: BaseTxParams) {
  const solanatest = await generateKeyPairSigner();
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getInitializeInstruction({ payer: signer, solanatest }, { programAddress: PROGRAM_ID }),
  });
}
