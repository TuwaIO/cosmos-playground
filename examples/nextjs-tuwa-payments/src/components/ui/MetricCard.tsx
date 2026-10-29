import { cn } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

/**
 * A number of the shop, as the dashboard shows it: an icon in a circle, an uppercase label, the value in black weight
 * and a line under it. Compact on phones, where three stay in a row.
 */
export function MetricCard({
  icon,
  label,
  value,
  subValue,
  className,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  subValue?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-2.5 rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-3 shadow-sm sm:gap-3 sm:p-5',
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
        <span
          aria-hidden
          className="hidden shrink-0 items-center justify-center rounded-full bg-[var(--tuwa-bg-muted)] p-2 text-[var(--tuwa-text-primary)] min-[420px]:flex sm:p-2.5 [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5"
        >
          {icon}
        </span>
        <span className="truncate text-[10px] font-black uppercase tracking-widest text-[var(--tuwa-text-secondary)] sm:text-[11px]">
          {label}
        </span>
      </div>
      <div className="min-w-0">
        <div className="truncate font-mono text-lg font-black tabular-nums sm:text-2xl xl:text-3xl">{value}</div>
        {subValue && (
          <div className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-[var(--tuwa-text-secondary)] sm:text-xs">
            {subValue}
          </div>
        )}
      </div>
    </div>
  );
}
