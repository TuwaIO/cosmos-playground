/**
 * Token configuration for extra balance display.
 * Maps chain IDs to supported ERC20 tokens.
 */

import { Address } from 'viem';
import { arbitrum, mainnet, monad } from 'viem/chains';

export interface TokenConfig {
  symbol: string;
  address: Address;
  decimals: number;
}

/**
 * Supported tokens per chain.
 * Only these tokens will be fetched and displayed in ExtraBalances.
 */
export const SUPPORTED_TOKENS: Record<number, TokenConfig[]> = {
  [monad.id]: [
    {
      symbol: 'USDC',
      address: '0x754704Bc059F8C67012fEd69BC8A327a5aafb603',
      decimals: 6,
    },
    {
      symbol: 'USDT0',
      address: '0xe7cd86e13AC4309349F30B3435a9d337750fC82D',
      decimals: 6,
    },
  ],
  [mainnet.id]: [
    {
      symbol: 'USDC',
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 6,
    },
  ],
  [arbitrum.id]: [
    {
      symbol: 'USDC',
      address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      decimals: 6,
    },
  ],
};

/**
 * ERC20 ABI for balanceOf function
 */
export const ERC20_BALANCE_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: 'balance', type: 'uint256' }],
  },
] as const;
