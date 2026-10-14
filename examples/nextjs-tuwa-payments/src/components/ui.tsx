import { cn } from '@tuwaio/nova-core';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

// Small building blocks of the shop page, styled with the Nova theme variables

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={cn(
        'rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] p-5',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' }) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-[var(--tuwa-rounded-corners)] px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary'
          ? 'bg-[var(--tuwa-button-primary-bg)] text-[var(--tuwa-text-on-accent)] hover:bg-[var(--tuwa-button-primary-bg-hover)]'
          : 'border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-standart-button-bg)] text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-standart-button-hover)]',
        className,
      )}
      {...props}
    />
  );
}

const TONES = {
  success: 'bg-[var(--tuwa-success-bg)] text-[var(--tuwa-success-text)]',
  pending: 'bg-[var(--tuwa-pending-bg)] text-[var(--tuwa-pending-text)]',
  info: 'bg-[var(--tuwa-info-bg)] text-[var(--tuwa-info-text)]',
  error: 'bg-[var(--tuwa-error-bg)] text-[var(--tuwa-error-text)]',
} as const;

export function Badge({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', TONES[tone])}>
      {children}
    </span>
  );
}
