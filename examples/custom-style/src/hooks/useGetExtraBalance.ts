/**
 * Global balance cache store and hook for fetching ERC20 token balances.
 * Uses zustand for global caching that persists across component unmounts.
 */
'use client';

import { NativeBalanceResult } from '@tuwaio/nova-connect';
import { useSatelliteConnectStore } from '@tuwaio/nova-connect/satellite';
import { createViemClient } from '@tuwaio/orbit-evm';
import { useCallback, useEffect, useRef } from 'react';
import { Address, formatUnits } from 'viem';
import { create } from 'zustand';

import { appEVMChains } from '../configs/appConfig';
import { ERC20_BALANCE_ABI, TokenConfig } from '../configs/tokenConfig';

// --- Global Balance Cache Store ---
type BalanceCache = Record<string, NativeBalanceResult>;

interface BalanceCacheStore {
  cache: BalanceCache;
  loadingKeys: Set<string>;
  setBalance: (key: string, balance: NativeBalanceResult) => void;
  getBalance: (key: string) => NativeBalanceResult | undefined;
  setLoading: (key: string, loading: boolean) => void;
  clearBalance: (key: string) => void;
}

const useBalanceCacheStore = create<BalanceCacheStore>((set, get) => ({
  cache: {},
  loadingKeys: new Set(),

  setBalance: (key, balance) => set((state) => ({ cache: { ...state.cache, [key]: balance } })),

  getBalance: (key) => get().cache[key],

  setLoading: (key, loading) =>
    set((state) => {
      const newLoadingKeys = new Set(state.loadingKeys);
      if (loading) {
        newLoadingKeys.add(key);
      } else {
        newLoadingKeys.delete(key);
      }
      return { loadingKeys: newLoadingKeys };
    }),

  clearBalance: (key) =>
    set((state) => {
      const newCache = { ...state.cache };
      delete newCache[key];
      return { cache: newCache };
    }),
}));

// --- Hook Types ---
interface BalanceData {
  balance: NativeBalanceResult | null;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * Hook to fetch and cache ERC20 token balance with global zustand cache.
 */
export function useGetExtraBalance(token: TokenConfig): BalanceData {
  const fetchOperationRef = useRef<string | null>(null);

  // Store actions
  const setBalance = useBalanceCacheStore((s) => s.setBalance);
  const setLoading = useBalanceCacheStore((s) => s.setLoading);
  const clearBalance = useBalanceCacheStore((s) => s.clearBalance);

  // Connection state
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);

  // Cache key - simple computation, React 19 compiler handles optimization
  const cacheKey =
    activeConnection?.chainId && activeConnection?.address
      ? `${activeConnection.address}-${activeConnection.chainId}-${token.address}`
      : null;

  // Reactive store selectors
  const isLoading = useBalanceCacheStore((s) => (cacheKey ? s.loadingKeys.has(cacheKey) : false));
  const cachedBalance = useBalanceCacheStore((s) => (cacheKey ? s.cache[cacheKey] : undefined));

  const fetchBalance = useCallback(
    async (forceRefresh = false) => {
      if (!activeConnection?.address || !activeConnection?.chainId || !cacheKey) return;

      const operationId = `${cacheKey}-${Date.now()}`;
      fetchOperationRef.current = operationId;

      // Check global cache
      if (!forceRefresh && useBalanceCacheStore.getState().getBalance(cacheKey)) return;

      setLoading(cacheKey, true);

      try {
        if (typeof activeConnection.chainId === 'number') {
          const client = createViemClient(activeConnection.chainId, appEVMChains);

          if (client) {
            const rawBalance = await client.readContract({
              address: token.address,
              abi: ERC20_BALANCE_ABI,
              functionName: 'balanceOf',
              args: [activeConnection.address as Address],
            });

            if (fetchOperationRef.current === operationId) {
              setBalance(cacheKey, {
                value: formatUnits(rawBalance, token.decimals),
                symbol: token.symbol,
              });
            }
          }
        }
      } catch (error) {
        console.error(`Failed to fetch ${token.symbol} balance:`, error);
        if (forceRefresh && fetchOperationRef.current === operationId) {
          clearBalance(cacheKey);
        }
      } finally {
        if (fetchOperationRef.current === operationId) {
          setLoading(cacheKey, false);
        }
      }
    },
    [activeConnection?.address, activeConnection?.chainId, cacheKey, token, setBalance, setLoading, clearBalance],
  );

  const refetch = useCallback(() => fetchBalance(true), [fetchBalance]);

  // Fetch on mount if not cached
  useEffect(() => {
    if (cacheKey && !useBalanceCacheStore.getState().getBalance(cacheKey)) {
      fetchBalance(false);
    }
  }, [cacheKey, fetchBalance]);

  // Cleanup
  useEffect(
    () => () => {
      fetchOperationRef.current = null;
    },
    [],
  );

  return {
    balance: cachedBalance ?? null,
    isLoading,
    refetch,
  };
}
