import { clsx as cn } from 'clsx';
import type { ReactNode } from 'react';

/**
 * The bar at the start of a section, as on tuwa.io: its number and name on the left, a fact about it on the right,
 * with cross marks where its rule meets the sides of the page column.
 */
export function SectionBar({
  index,
  title,
  meta,
  first = false,
  plain = false,
}: {
  /** The number or mark before the name: `01`, `//`. */
  index: ReactNode;
  title: ReactNode;
  meta?: ReactNode;
  /** The first thing in the column: no rule above it. */
  first?: boolean;
  /** Without the cross marks, for a bar inside a panel. */
  plain?: boolean;
}) {
  return (
    <div className={cn('shop-bar', first && 'is-first', plain && 'is-plain')}>
      <span>
        {index} / <b>{title}</b>
      </span>
      {meta && <span>{meta}</span>}
    </div>
  );
}
