'use client';

import { cn } from '@tuwaio/nova-core';

import { MAX_QUANTITY } from '@/lib/catalog';

/** How many of a product: one less, the number, one more, from 1 to the most a cart may hold. */
export function Quantity({
  value,
  onChange,
  label,
  small = false,
}: {
  value: number;
  onChange: (next: number) => void;
  /** What is counted, for screen readers: `Quantity of Cosmos hoodie`. */
  label: string;
  small?: boolean;
}) {
  return (
    <div className={cn('shop-qty', small && 'is-sm')} role="group" aria-label={label}>
      <button type="button" aria-label="One less" disabled={value <= 1} onClick={() => onChange(value - 1)}>
        −
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" aria-label="One more" disabled={value >= MAX_QUANTITY} onClick={() => onChange(value + 1)}>
        +
      </button>
    </div>
  );
}
