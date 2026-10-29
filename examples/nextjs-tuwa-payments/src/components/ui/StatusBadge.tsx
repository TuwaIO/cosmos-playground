import { cn } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

/** The tones of a status, from the Nova status tokens (badge text darkened to AA where Nova's is lighter). */
export const STATUS_TONES = {
  success:
    'bg-[var(--tuwa-success-bg)] text-[var(--shop-success-text)] border-[color-mix(in_oklab,var(--tuwa-success-icon)_35%,transparent)]',
  pending:
    'bg-[var(--tuwa-pending-bg)] text-[var(--shop-pending-text)] border-[color-mix(in_oklab,var(--tuwa-pending-icon)_40%,transparent)]',
  error:
    'bg-[var(--tuwa-error-bg)] text-[var(--shop-error-text)] border-[color-mix(in_oklab,var(--tuwa-error-icon)_35%,transparent)]',
  neutral: 'bg-[var(--tuwa-info-bg)] text-[var(--tuwa-info-text)] border-[var(--tuwa-border-primary)]',
} as const;

export type StatusTone = keyof typeof STATUS_TONES;

/** A status as a small uppercase label: invoices, orders, subscriptions, event families. */
export function StatusBadge({
  label,
  tone = 'neutral',
  icon,
  className,
}: {
  label: ReactNode;
  tone?: StatusTone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-shop border px-1.5 py-0.5 text-[10.5px] font-extrabold uppercase leading-4 tracking-wider',
        STATUS_TONES[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}
