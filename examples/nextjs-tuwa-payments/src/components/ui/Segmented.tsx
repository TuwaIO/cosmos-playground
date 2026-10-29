'use client';

import { cn } from '@tuwaio/nova-core';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';

import { CountBadge } from '@/components/ui/CountBadge';

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
  count?: number;
  /** A link instead of a button (the navigation of the header). */
  href?: string;
  /** Turns the option off; an option with a count of 0 is off too (unless it is the chosen one). */
  disabled?: boolean;
  /** The ID of the text that says why the option is off. */
  describedBy?: string;
};

/**
 * A row of mutually exclusive choices, as on the Quasar dashboard: a pill (the card surface with a small shadow) on the
 * muted track slides to the chosen option; it moves at once where motion is reduced. Options with a count show it in
 * a badge. Buttons are pressed (`aria-pressed`); links are the current page (`aria-current`).
 */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  className,
}: {
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange?: (value: T) => void;
  size?: 'md' | 'sm';
  className?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [placed, setPlaced] = useState(false);
  const first = useRef(true);

  useLayoutEffect(() => {
    const row = rowRef.current;
    const pill = pillRef.current;
    if (!row || !pill) return;
    const place = (slide: boolean) => {
      const item = row.querySelector<HTMLElement>(':scope > [data-chosen="true"]');
      if (!item) {
        pill.style.visibility = 'hidden';
        return;
      }
      pill.style.transitionDuration = slide ? '' : '0s';
      pill.style.transform = `translate(${item.offsetLeft}px, ${item.offsetTop}px)`;
      pill.style.width = `${item.offsetWidth}px`;
      pill.style.height = `${item.offsetHeight}px`;
      pill.style.visibility = '';
    };
    place(!first.current);
    if (first.current) {
      first.current = false;
      setPlaced(true);
    }
    const observer = new ResizeObserver(() => place(false));
    observer.observe(row);
    return () => observer.disconnect();
  }, [value, options.length]);

  const itemClass = (chosen: boolean) =>
    cn(
      'relative z-[1] inline-flex flex-[1_0_auto] cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-shop font-bold transition-colors',
      size === 'md' ? 'min-h-9 px-3.5 text-[13px]' : 'min-h-8 gap-1 px-1.5 text-[12.5px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      chosen
        ? cn('text-[var(--tuwa-text-primary)]', !placed && PILL)
        : 'text-[var(--shop-text-label)] hover:text-[var(--tuwa-text-primary)]',
    );

  return (
    <div
      ref={rowRef}
      role="group"
      aria-label={label}
      className={cn(
        'relative inline-flex max-w-full gap-0.5 overflow-x-auto rounded-shop border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] p-1 [scrollbar-width:none]',
        className,
      )}
    >
      <span
        ref={pillRef}
        aria-hidden
        className={cn(
          PILL,
          'pointer-events-none absolute left-0 top-0 transition-[transform,width,height] duration-200 ease-out motion-reduce:transition-none',
        )}
      />
      {options.map((option) => {
        const chosen = option.value === value;
        const content = (
          <>
            {option.label}
            {option.count !== undefined && (
              <>
                {' '}
                <CountBadge count={option.count} tone={chosen ? 'chosen' : 'raised'} />
              </>
            )}
          </>
        );
        if (option.href) {
          return (
            <Link
              key={option.value}
              href={option.href}
              data-chosen={chosen}
              aria-current={chosen ? 'page' : undefined}
              className={itemClass(chosen)}
            >
              {content}
            </Link>
          );
        }
        return (
          <button
            key={option.value}
            type="button"
            data-chosen={chosen}
            aria-pressed={chosen}
            aria-describedby={option.describedBy}
            disabled={option.disabled || (option.count === 0 && !chosen)}
            onClick={() => onChange?.(option.value)}
            className={itemClass(chosen)}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}

const PILL = 'rounded-shop bg-[var(--tuwa-bg-primary)] shadow-sm';
