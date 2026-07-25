import { cn } from '@tuwaio/sdk/nova-core';
import { TransactionsHistoryCustomization } from '@tuwaio/sdk/nova-transactions';

import { ICON_BUTTON_STYLES, SHARED_STYLES } from './shared_styles';

/**
 * Custom theme customization for TransactionsHistory.
 * This can be used both in ConnectedModal and standalone NovaTransactionsProvider.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transactions_history_customization: TransactionsHistoryCustomization<any> = {
  classNames: {
    // Container
    container: 'flex flex-col gap-y-3',

    // Title (if used)
    titleText: cn('text-lg', SHARED_STYLES.textForeground),

    // List wrapper
    listWrapper: cn('max-h-[400px] overflow-y-auto rounded-[4px]', SHARED_STYLES.borderDefault, SHARED_STYLES.bgBase),

    // Placeholder
    placeholderContainer: cn('rounded-[4px] p-8 text-center', SHARED_STYLES.bgBase, SHARED_STYLES.borderDefault),
    placeholderTitle: cn(SHARED_STYLES.textForeground),
    placeholderMessage: cn('mt-1 text-sm', SHARED_STYLES.textSecondary),

    // Individual item
    itemContainer: cn(
      'flex flex-col gap-2 p-3 transition-colors',
      'border-b border-[var(--tuwa-border-primary)]',
      'hover:bg-[var(--tuwa-bg-muted)]',
    ),

    // Item icon
    itemIconWrapper: cn(
      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full',
      SHARED_STYLES.bgBase,
      SHARED_STYLES.borderDefault,
    ),
    itemIcon: 'h-8 w-8 text-[var(--tuwa-text-secondary)]',

    // Item content
    itemContentWrapper: 'flex flex-col',
    itemTitle: cn('text-sm', SHARED_STYLES.textForeground),
    itemTimestamp: cn('mb-1 block text-xs', SHARED_STYLES.textSecondary),
    itemDescription: cn('mt-1 text-xs', SHARED_STYLES.textSecondary),

    // Status badge
    itemStatusBadge: cn('text-xs'),

    // Transaction key / hash link
    itemTxKeyContainer: 'flex flex-col gap-y-2',
    itemHashLabel: cn('text-sm pr-1', SHARED_STYLES.textForeground),
    itemHashLink: cn('flex items-center gap-x-1', SHARED_STYLES.textAccent, 'hover:underline transition-colors'),
    itemHashCopyButton: cn('cursor-pointer', ICON_BUTTON_STYLES.copy),

    // Original hash (replaced transactions) - less prominent
    itemOriginalHashLabel: cn('text-xs', SHARED_STYLES.textSecondary),
    itemOriginalHashLink: cn('text-xs', SHARED_STYLES.textSecondary),
    itemOriginalHashCopyButton: cn('opacity-50', ICON_BUTTON_STYLES.copy),
  },
};
