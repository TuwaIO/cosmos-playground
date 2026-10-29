import { InboxIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

/**
 * What a list shows while it has nothing: an icon in a circle, a mono title, what the list will hold and, when there
 * is one, the action that fills it. `bare` inside a card (no frame in a frame).
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  bare = false,
  className,
}: {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  bare?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        !bare && 'rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] shadow-sm',
        className,
      )}
    >
      <span
        aria-hidden
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-tertiary)] [&_svg]:h-[26px] [&_svg]:w-[26px]"
      >
        {icon ?? <InboxIcon />}
      </span>
      <h3 className="m-0 py-1 text-lg font-bold tracking-tight">{title}</h3>
      {description && (
        <p className="m-0 max-w-[460px] text-sm leading-relaxed text-[var(--tuwa-text-secondary)]">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
