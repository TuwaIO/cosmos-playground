import { cn } from '@tuwaio/nova-core';

/**
 * The small count beside a filter choice, a tab or a header button.
 *
 * @param props - The count; `chosen` for the chosen option, `raised` on a muted surface, `solid` on a header button.
 */
export function CountBadge({
  count,
  tone = 'muted',
  className,
}: {
  count: number;
  tone?: 'chosen' | 'muted' | 'raised' | 'solid';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex min-w-[18px] items-center justify-center rounded-shop px-1.5 py-px font-mono text-[11px] font-bold tabular-nums',
        tone === 'chosen' && 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-primary)]',
        tone === 'muted' && 'bg-[var(--tuwa-bg-muted)] text-[var(--shop-text-label)]',
        tone === 'raised' && 'bg-[var(--tuwa-bg-primary)] text-[var(--shop-text-label)]',
        tone === 'solid' && 'bg-[var(--tuwa-button-primary-bg)] text-[var(--tuwa-text-on-accent)]',
        className,
      )}
    >
      {count}
    </span>
  );
}
