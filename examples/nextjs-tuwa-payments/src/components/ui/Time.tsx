'use client';

import { useSyncExternalStore } from 'react';

import { formatTime, type TimeStyle } from '@/lib/format';

const subscribe = () => () => {};

/**
 * A moment in the visitor's time zone. The server does not know that zone, so it writes the moment in UTC and says so;
 * the browser replaces it with the local time once the page is live.
 */
export function Time({ iso, style = 'full', className }: { iso: string; style?: TimeStyle; className?: string }) {
  const text = useSyncExternalStore(
    subscribe,
    () => formatTime(iso, style),
    () => `${formatTime(iso, style, 'UTC')} UTC`,
  );
  return (
    <time dateTime={iso} className={className}>
      {text}
    </time>
  );
}
