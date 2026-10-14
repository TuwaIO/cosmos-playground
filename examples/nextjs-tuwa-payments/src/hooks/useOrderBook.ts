'use client';

import { useCallback, useEffect, useState } from 'react';

import { readOrderBook } from '@/app/actions';
import type { OrderBook } from '@/lib/orderTypes';

/** The orders and webhooks of the shop, read again every `intervalMs` so webhook updates show up. */
export function useOrderBook(intervalMs = 3000) {
  const [book, setBook] = useState<OrderBook>({ orders: [], webhooks: [] });

  const refresh = useCallback(async () => {
    setBook(await readOrderBook());
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const next = await readOrderBook();
        if (!cancelled) setBook(next);
      } catch (error) {
        console.warn('[Shop] Could not read the orders', error);
      }
    };
    void load();
    const timer = setInterval(() => void load(), intervalMs);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return { book, refresh };
}
