import { cn } from '@tuwaio/nova-core';
import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'md' | 'sm' | 'icon' | 'icon-sm';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--tuwa-button-primary-bg)] text-[var(--tuwa-text-on-accent)] enabled:hover:bg-[var(--tuwa-button-primary-bg-hover)] [&[href]]:hover:bg-[var(--tuwa-button-primary-bg-hover)]',
  secondary:
    'border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] text-[var(--tuwa-text-primary)] enabled:hover:bg-[var(--tuwa-bg-muted)] [&[href]]:hover:bg-[var(--tuwa-bg-muted)]',
  ghost:
    'text-[var(--tuwa-text-secondary)] enabled:hover:bg-[var(--tuwa-bg-muted)] enabled:hover:text-[var(--tuwa-text-primary)] [&[href]]:hover:bg-[var(--tuwa-bg-muted)]',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'h-10 px-4 text-sm',
  sm: 'h-8 px-3 text-[13px]',
  icon: 'h-10 w-10 shrink-0',
  'icon-sm': 'h-8 w-8 shrink-0',
};

/** The classes of a button, for elements that look like one (links). */
export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(
    'relative inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-shop font-semibold transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

/** A button of the shop: solid primary (the zinc accent, no gradient), bordered secondary, or ghost. */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

/** A link that looks like a button. */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

/** A spinner for a button that waits; still where motion is reduced. */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn('h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none', className)}
      fill="none"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
