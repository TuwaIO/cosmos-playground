'use client';

import { cn } from '@tuwaio/nova-core';
import { type ReactNode, useId } from 'react';

/** A surface of the shop: white (dark gray in the dark theme) with a border, the radius variable and a soft shadow. */
export function Card({
  children,
  className,
  as: Tag = 'section',
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
}) {
  return (
    <Tag
      className={cn(
        'rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] shadow-sm',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/**
 * A titled card of a details page: a region named by its mono title, with an optional line under it and a control or
 * badge on its right.
 */
export function DetailCard({
  title,
  icon,
  description,
  action,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <section
      aria-labelledby={id}
      className={cn(
        'flex min-w-0 flex-col gap-5 rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-5 shadow-sm sm:p-6',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        {icon && (
          <span
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-primary)] [&>svg]:h-5 [&>svg]:w-5"
          >
            {icon}
          </span>
        )}
        <div className="flex min-w-0 flex-[1_1_200px] flex-col gap-1.5 self-center">
          <h2 id={id} className="truncate text-lg font-bold tracking-tight sm:text-xl" title={title}>
            {title}
          </h2>
          {description && (
            <div className="text-[13.5px] leading-relaxed text-[var(--tuwa-text-secondary)]">{description}</div>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** A label and its value on one line of a details card. */
export function KeyValueRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-4 border-b border-[var(--tuwa-border-secondary)] pb-3 text-[13.5px] last:border-b-0 last:pb-0">
      <dt className="shrink-0 text-[var(--tuwa-text-secondary)]">{label}</dt>
      <dd className="m-0 min-w-0 text-right break-words text-[var(--tuwa-text-primary)]">{children}</dd>
    </div>
  );
}

/** The label above a group of fields or a list: 11px uppercase, wide tracking. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'm-0 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--tuwa-text-secondary)]',
        className,
      )}
    >
      {children}
    </p>
  );
}
