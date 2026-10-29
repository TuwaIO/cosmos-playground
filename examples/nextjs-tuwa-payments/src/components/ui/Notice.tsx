import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  LightBulbIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import type { ComponentType, ReactNode, SVGProps } from 'react';

const TONES = {
  info: {
    box: 'border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)]',
    icon: InformationCircleIcon,
    iconClass: 'text-[var(--tuwa-text-secondary)]',
  },
  tip: {
    box: 'border-[var(--tuwa-border-primary)] bg-[var(--tuwa-info-bg)] text-[var(--tuwa-info-text)]',
    icon: LightBulbIcon,
    iconClass: 'text-[var(--tuwa-info-icon)]',
  },
  success: {
    box: 'border-[color-mix(in_oklab,var(--tuwa-success-icon)_35%,transparent)] bg-[var(--tuwa-success-bg)] text-[var(--shop-success-text)]',
    icon: CheckCircleIcon,
    iconClass: 'text-[var(--shop-success-text)]',
  },
  warning: {
    box: 'border-[color-mix(in_oklab,var(--tuwa-pending-icon)_40%,transparent)] bg-[var(--tuwa-pending-bg)] text-[var(--shop-pending-text)]',
    icon: ExclamationTriangleIcon,
    iconClass: 'text-[var(--shop-pending-text)]',
  },
  error: {
    box: 'border-[color-mix(in_oklab,var(--tuwa-error-icon)_35%,transparent)] bg-[var(--tuwa-error-bg)] text-[var(--shop-error-text)]',
    icon: XCircleIcon,
    iconClass: 'text-[var(--shop-error-text)]',
  },
} satisfies Record<string, { box: string; icon: ComponentType<SVGProps<SVGSVGElement>>; iconClass: string }>;

export type NoticeTone = keyof typeof TONES;

/** A note in a page: information, a tip, a success, a warning or an error (errors are announced as alerts). */
export function Notice({
  tone = 'info',
  title,
  children,
  action,
  className,
}: {
  tone?: NoticeTone;
  title?: ReactNode;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const { box, icon: Icon, iconClass } = TONES[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex flex-wrap items-start gap-x-3 gap-y-2 rounded-shop border px-4 py-3 text-[13px] leading-relaxed',
        box,
        className,
      )}
    >
      <Icon aria-hidden className={cn('mt-0.5 h-4 w-4 shrink-0', iconClass)} />
      <div className="min-w-0 flex-1 space-y-0.5">
        {title && <p className="m-0 font-bold">{title}</p>}
        {children && <div className="[&_a]:font-semibold [&_a]:underline [&_a:hover]:no-underline">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
