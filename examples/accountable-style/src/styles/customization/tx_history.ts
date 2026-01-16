import { cn } from '@tuwaio/nova-core';
import { TransactionsHistoryCustomization } from '@tuwaio/nova-transactions';

import { TransactionUnion } from '../../transactions';
import { SHARED_STYLES } from './shared_styles';

/**
 * Accountable theme customization for TransactionsHistory.
 * This can be used both in ConnectedModal and standalone NovaTransactionsProvider.
 */
export const transactions_history_customization: TransactionsHistoryCustomization<TransactionUnion> = {
  classNames: {
    // Container
    container: cn('flex flex-col gap-y-3'),

    // Title (if used)
    titleText: cn(SHARED_STYLES.fontMonoMedium, 'text-lg', SHARED_STYLES.textForeground),

    // List wrapper
    listWrapper: cn(
      'max-h-[400px] overflow-y-auto rounded-[4px]',
      'border border-[var(--accountable-border)]',
      SHARED_STYLES.bgBase,
    ),

    // Placeholder
    placeholderContainer: cn(
      'rounded-[4px] p-8 text-center',
      'bg-[var(--accountable-background-2)]',
      'border border-[var(--accountable-border)]',
    ),
    placeholderTitle: cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textForeground),
    placeholderMessage: cn(SHARED_STYLES.fontMono, 'mt-1 text-sm', SHARED_STYLES.textSecondary),

    // Individual item
    itemContainer: cn(
      'flex flex-col gap-2 p-3 transition-colors',
      'border-b border-[var(--accountable-border)]',
      'hover:bg-[var(--accountable-accent-dark)]',
    ),

    // Item icon
    itemIconWrapper: cn(
      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
      'bg-[var(--accountable-background-2)]',
      'border border-[var(--accountable-border)]',
    ),
    itemIcon: cn('h-8 w-8 text-[var(--accountable-secondary)]'),

    // Item content
    itemContentWrapper: cn('flex flex-col'),
    itemTitle: cn(SHARED_STYLES.fontMonoMedium, 'text-sm', SHARED_STYLES.textForeground),
    itemTimestamp: cn(SHARED_STYLES.fontMono, 'mb-1 block text-xs', SHARED_STYLES.textSecondary),
    itemDescription: cn(SHARED_STYLES.fontMono, 'mt-1 text-xs', SHARED_STYLES.textSecondary),

    // Status badge
    itemStatusBadge: cn(SHARED_STYLES.fontMono, 'text-xs font-medium'),

    // Transaction key / hash link
    itemTxKeyContainer: cn('flex flex-col gap-y-2'),
    itemHashLabel: cn(SHARED_STYLES.fontMonoMedium, 'text-sm pr-1', SHARED_STYLES.textForeground),
    itemHashLink: cn(
      SHARED_STYLES.fontMono,
      'flex items-center gap-x-1',
      'text-[var(--accountable-accent)]',
      'hover:underline hover:text-[var(--accountable-accent)]',
      'transition-colors',
    ),
    itemHashCopyButton: cn(
      'cursor-pointer transition-colors',
      'text-[var(--accountable-secondary)]',
      'hover:text-[var(--accountable-accent)]',
    ),
  },
};
