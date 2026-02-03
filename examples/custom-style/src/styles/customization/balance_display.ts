import { BalanceDisplayCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { SHARED_STYLES } from './shared_styles';

export const balance_display_customization: BalanceDisplayCustomization = {
  classNames: {
    // Container
    container: () => cn('flex items-center relative'),
    // Balance value text
    balanceValue: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary),
    // Refresh button
    refreshButton: ({ isLoading, showSuccess }) =>
      cn(
        'cursor-pointer ml-2 p-1 rounded-full transition-colors',
        'hover:bg-[var(--tuwa-bg-muted)]',
        SHARED_STYLES.textSecondary,
        SHARED_STYLES.baseFocus,
        showSuccess && 'text-[var(--tuwa-text-accent)]',
        isLoading && 'animate-spin',
      ),
    // Loading state
    loadingState: () => cn('animate-pulse rounded-xl h-5 w-24', 'bg-[var(--tuwa-border-primary)]'),
    // Empty state
    emptyState: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'opacity-75'),
  },
};
