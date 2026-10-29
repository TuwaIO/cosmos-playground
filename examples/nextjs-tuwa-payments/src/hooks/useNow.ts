'use client';

import { useEffect, useState } from 'react';

/** `Date.now()`, ticking every `intervalMs`: relative times ("12 s ago") stay true. */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);
  return now;
}
