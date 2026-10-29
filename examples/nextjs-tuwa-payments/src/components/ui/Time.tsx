'use client';

import { useSyncExternalStore } from 'react';

import { ago, clockTime, dateTime } from '@/lib/format';

const subscribe = () => () => {};

/**
 * A time in the viewer's time zone (`clock`, `date`) or relative to `now` (`ago`). Written after hydration only: the
 * server's clock and time zone are not the viewer's, so the server renders a placeholder of one figure space.
 */
export function Time({ iso, format, now }: { iso: string; format: 'clock' | 'date' | 'ago'; now?: number }) {
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!hydrated) return <>{' '}</>;
  return (
    <>{format === 'clock' ? clockTime(iso) : format === 'date' ? dateTime(iso) : ago(iso, now ?? Date.parse(iso))}</>
  );
}
