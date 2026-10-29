import { cn } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

/**
 * The header of a page, as on the Quasar dashboard: an uppercase eyebrow, the mono title on one line (its full text in
 * `title`), a description, and the page's actions to the right of the title (under it on narrow screens).
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
  className,
}: {
  eyebrow: ReactNode;
  title: string;
  description?: ReactNode;
  status?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('flex min-w-0 flex-wrap items-end justify-between gap-x-6 gap-y-4', className)}>
      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
        <p className="m-0 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--tuwa-text-secondary)] sm:text-xs">
          {eyebrow}
        </p>
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
          <h1 title={title} className="m-0 min-w-0 truncate text-2xl font-black tracking-tight sm:text-3xl">
            {title}
          </h1>
          {status}
        </div>
        {description && (
          <p className="m-0 max-w-2xl text-[15px] leading-relaxed text-[var(--tuwa-text-secondary)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex max-w-full flex-wrap items-center gap-2.5">{actions}</div>}
    </header>
  );
}
