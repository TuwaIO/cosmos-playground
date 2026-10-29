'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@tuwaio/nova-core';
import type { ReactNode } from 'react';

/**
 * A panel over the page (Radix Dialog): from the right on tablets and desktops; on phones a sheet from the bottom up to
 * 85% of the screen (`phone="sheet"`) or the full height (`phone="full"`).
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  phone = 'sheet',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  phone?: 'sheet' | 'full';
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="shop-overlay fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className={cn(
            'shop-drawer fixed z-50 flex flex-col border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] text-[var(--tuwa-text-primary)] shadow-xl outline-none',
            phone === 'sheet'
              ? 'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[var(--tuwa-rounded-corners)] border-t'
              : 'inset-0',
            'md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-none md:w-[420px] md:rounded-none md:border-t-0 md:border-l',
          )}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--tuwa-border-primary)] px-5 py-4">
            <div className="min-w-0">
              <Dialog.Title className="m-0 truncate font-mono text-lg font-bold tracking-tight">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description asChild>
                  <div className="m-0 mt-1 text-[13px] text-[var(--tuwa-text-secondary)]">{description}</div>
                </Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Close"
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-shop text-[var(--tuwa-text-secondary)] hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden />
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
          {footer && <div className="border-t border-[var(--tuwa-border-primary)] px-5 py-4">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
