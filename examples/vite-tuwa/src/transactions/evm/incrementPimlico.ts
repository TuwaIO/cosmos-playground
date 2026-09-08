import { createPimlicoSmartAccountClient } from '@tuwaio/evm-sdk/orbit';
import { type Config } from '@wagmi/core';
import { encodeFunctionData, type Hex } from 'viem';
import { sepolia } from 'viem/chains';

import { CounterAbi } from '../../abis/CounterAbi';
import { COUNTER_ADDRESS } from '../../constants';

/**
 * Executes a counter increment via an ERC-4337 UserOperation using a Pimlico bundler.
 * Orchestrates Solady Smart Account and Pimlico Bundler client via `@tuwaio/evm-sdk/orbit`.
 *
 * @param {object} params - Configuration containing optional Wagmi config.
 * @param {Config} [params.wagmiConfig] - The connected Wagmi configuration instance.
 * @returns {Promise<Hex | undefined>} The UserOperation hash for tracking.
 */
export async function incrementPimlico({ wagmiConfig }: { wagmiConfig?: Config }): Promise<Hex | undefined> {
  if (!wagmiConfig) return undefined;

  const { account, bundlerClient } = await createPimlicoSmartAccountClient({
    chain: sepolia,
    wagmiConfig,
    apiKey: import.meta.env.VITE_PIMLICO_API_KEY,
    rpcUrl: import.meta.env.VITE_ALCHEMY_KEY
      ? `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`
      : undefined,
  });

  const data = encodeFunctionData({
    abi: CounterAbi,
    functionName: 'increment',
  });

  return bundlerClient.sendUserOperation({
    account,
    calls: [
      {
        to: COUNTER_ADDRESS,
        data,
        value: 0n,
      },
    ],
  });
}
