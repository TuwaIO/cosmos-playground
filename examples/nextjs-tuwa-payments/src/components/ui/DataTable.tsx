'use client';

import { cn } from '@tuwaio/nova-core';
import type { MouseEvent, ReactNode } from 'react';

/** A column of a `DataTable`. */
export type DataColumn<T> = {
  id: string;
  /** The name above the column; on phones the label of the value. */
  header: string;
  cell: (row: T) => ReactNode;
  align?: 'left' | 'right';
  /** A column without a visible name (the open arrow): on phones it sits at the right of the title line. */
  srOnlyHeader?: boolean;
  className?: string;
};

// What a click in a row leaves to itself: its own links, buttons and fields
const OWN_CONTROLS = 'a, button, input, select, textarea, label, summary, [role="button"]';

/** Opens a row from a click anywhere on it: what its `[data-row-open]` link opens. */
function openRow(event: MouseEvent<HTMLElement>) {
  const target = event.target as HTMLElement;
  if (target.closest(OWN_CONTROLS) || window.getSelection?.()?.toString()) return;
  event.currentTarget.querySelector<HTMLElement>('[data-row-open]')?.click();
}

/**
 * A list as a table from `sm` up, with a muted header row; on phones stacked rows: the first column as the title line,
 * the column without a name at its right, the others as label and value. A row whose last column holds a
 * `[data-row-open]` link opens on a click anywhere on it; the link stays the way in for keyboards and screen readers.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
}: {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption: string;
}) {
  const [title, ...rest] = columns;
  const trailing = rest.filter((column) => column.srOnlyHeader);
  const fields = rest.filter((column) => !column.srOnlyHeader);
  const rowClass =
    'cursor-pointer transition-colors hover:bg-[color-mix(in_oklab,var(--tuwa-bg-muted)_55%,transparent)]';

  return (
    <>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    'whitespace-nowrap border-b border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-muted)] px-3 py-2.5 text-[10.5px] font-bold uppercase tracking-widest text-[var(--shop-text-label)] first:pl-5 last:pr-5',
                    column.align === 'right' ? 'text-right' : 'text-left',
                  )}
                >
                  {column.srOnlyHeader ? <span className="sr-only">{column.header}</span> : column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className={rowClass} onClick={openRow}>
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'border-b border-[var(--tuwa-border-secondary)] px-3 py-3 align-middle text-[13.5px] first:pl-5 last:pr-5',
                      column.align === 'right' ? 'text-right' : 'text-left',
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="m-0 list-none p-0 sm:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li
            key={rowKey(row)}
            onClick={openRow}
            className={cn('flex flex-col gap-2 border-b border-[var(--tuwa-border-secondary)] px-4 py-3.5', rowClass)}
          >
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 flex-1">{title.cell(row)}</span>
              {trailing.map((column) => (
                <span key={column.id} className="shrink-0">
                  {column.cell(row)}
                </span>
              ))}
            </div>
            {fields.map((column) => (
              <div key={column.id} className="flex items-baseline justify-between gap-3 text-[13.5px]">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[var(--tuwa-text-secondary)]">
                  {column.header}
                </span>
                <span className="min-w-0 text-right">{column.cell(row)}</span>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </>
  );
}
