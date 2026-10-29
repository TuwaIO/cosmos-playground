import { cn } from '@tuwaio/nova-core';

/** A placeholder of the size of what it waits for; still where motion is reduced. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('block animate-pulse rounded-shop bg-[var(--tuwa-bg-muted)] motion-reduce:animate-none', className)}
    />
  );
}
