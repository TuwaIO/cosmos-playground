import { createGelatoEvmRelayerClient } from '@gelatocloud/gasless';
import { encodeFunctionData } from 'viem';
import { sepolia } from 'viem/chains';

import { CounterAbi } from '../../abis/CounterAbi';
import { COUNTER_ADDRESS } from '../../constants';

export async function incrementGelato() {
  const relayer = createGelatoEvmRelayerClient({
    apiKey: process.env.VITE_GELATO_API_KEY ?? 'test__YdhbAtrsdIe0InknnlnLNN9OVEGOYjz5_TIEGxCncI_',
    testnet: true,
  });

  const data = encodeFunctionData({
    abi: CounterAbi,
    functionName: 'increment',
  });

  return relayer.sendTransaction({
    chainId: sepolia.id,
    data,
    to: COUNTER_ADDRESS,
  });
}
