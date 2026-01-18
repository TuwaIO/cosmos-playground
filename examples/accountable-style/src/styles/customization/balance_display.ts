import { BalanceDisplayCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { SHARED_STYLES } from './shared_styles';

export const balance_display_customization: BalanceDisplayCustomization = {
  classNames: {
    // Container
    container: () => cn('flex items-center relative'),
    // Balance value text
    balanceValue: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary),
    // Refresh button with Accountable colors
    refreshButton: ({ isLoading, showSuccess }) =>
      cn(
        'cursor-pointer ml-2 p-1 rounded-full transition-colors',
        'hover:bg-[var(--accountable-accent-dark)]',
        SHARED_STYLES.textSecondary,
        'focus:outline-none focus:ring-2 focus:ring-[var(--accountable-accent)]',
        showSuccess && 'text-[var(--accountable-accent)]',
        isLoading && 'animate-spin',
      ),
    // Loading state
    loadingState: () => cn('animate-pulse rounded-xl h-5 w-24', 'bg-[var(--accountable-border)]'),
    // Empty state
    emptyState: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'opacity-75'),
  },
};
