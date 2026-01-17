import { cn } from '@tuwaio/nova-core';
import { NovaTransactionsProviderProps } from '@tuwaio/nova-transactions/providers';

import { TransactionUnion } from '../../transactions';
import { SHARED_STYLES } from './shared_styles';
import { transactions_history_customization } from './tx_history';

// Shared button styles for Accountable theme
const BUTTON_STYLES = {
  primary: cn(
    SHARED_STYLES.fontMonoMedium,
    'cursor-pointer rounded-[4px] px-3 py-1 text-xs transition-all',
    'bg-[var(--accountable-accent)] text-[var(--accountable-background)]',
    'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-primary)]',
    'focus:outline-none focus:ring-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-2',
  ),
  secondary: cn(
    SHARED_STYLES.fontMono,
    'cursor-pointer rounded-[4px] px-4 py-2 text-sm transition-all',
    'bg-[var(--accountable-background-3)] text-[var(--accountable-foreground)]',
    'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-primary)]',
    'border border-[var(--accountable-border)]',
  ),
  link: cn(
    SHARED_STYLES.fontMono,
    'cursor-pointer text-sm transition-opacity',
    'text-[var(--accountable-accent)]',
    'hover:opacity-80',
  ),
};

export const nova_tx_provider_customization: NovaTransactionsProviderProps<TransactionUnion>['customization'] = {
  // ========== Toast Customization ==========
  toast: {
    classNames: {
      container: cn('rounded-[4px] border border-[var(--accountable-border)]', 'bg-[var(--accountable-background-2)]'),

      // Title & Description
      title: cn(SHARED_STYLES.fontMonoMedium, 'text-sm', SHARED_STYLES.textForeground),
      description: cn(SHARED_STYLES.fontMono, 'mt-1 text-xs', SHARED_STYLES.textSecondary),

      // Transaction Key / Hash
      transactionKey: cn('border-[var(--accountable-border)]'),
      hashLabel: cn(SHARED_STYLES.fontMonoMedium, 'text-sm pr-1', SHARED_STYLES.textForeground),
      hashLink: cn(SHARED_STYLES.fontMono, 'text-[var(--accountable-accent)]', 'hover:underline transition-colors'),
      hashCopyButton: cn('text-[var(--accountable-secondary)]', 'hover:text-[var(--accountable-accent)]'),

      // Footer & Status
      statusBadge: cn(SHARED_STYLES.fontMono, 'text-xs font-medium'),
      statusBadgeLabel: cn(SHARED_STYLES.fontMono),

      // Action Buttons
      speedUpButton: BUTTON_STYLES.link,
      cancelButton: cn(SHARED_STYLES.fontMono, 'text-[var(--accountable-secondary)] hover:opacity-80'),
      txInfoButton: BUTTON_STYLES.primary,
    },
  },

  // ========== Transactions Info Modal ==========
  transactionsInfoModal: {
    classNames: {
      header: cn(
        'bg-[var(--accountable-background-2)] border-[var(--accountable-border)]',
        'text-[var(--accountable-foreground)]',
      ),
      headerTitle: cn(SHARED_STYLES.fontMonoMedium),
      closeButton: cn(
        'cursor-pointer rounded-[4px] p-1 transition-colors',
        'hover:bg-[var(--accountable-accent-dark)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-2',
        '[&_svg]:text-[var(--accountable-primary)]',
      ),
    },
    historyCustomization: transactions_history_customization,
  },

  // ========== Tracking Transaction Modal ==========
  trackingTxModal: {
    classNames: {
      // Container & Sections
      container: 'bg-[var(--accountable-background-2)]',
      header: cn(
        'bg-[var(--accountable-background-2)] border-[var(--accountable-border)]',
        'text-[var(--accountable-foreground)]',
      ),
      headerTitle: cn(SHARED_STYLES.fontMonoMedium, 'text-lg'),
      closeButton: cn(
        'cursor-pointer rounded-[4px] p-1 transition-colors',
        'hover:bg-[var(--accountable-accent-dark)]',
        '[&_svg]:text-[var(--accountable-primary)]',
      ),
      main: 'bg-[var(--accountable-background-2)]',

      // Footer
      footer: cn('border-t border-[var(--accountable-border)] p-4', 'bg-[var(--accountable-background-2)]'),
      footerActions: 'flex items-center gap-4',
      footerButtons: 'flex items-center gap-3',

      // Buttons
      speedUpButton: BUTTON_STYLES.link,
      cancelButton: cn(SHARED_STYLES.fontMono, 'text-sm text-[var(--accountable-secondary)] hover:opacity-80'),
      retryButton: cn(
        BUTTON_STYLES.primary,
        'text-sm px-4 py-2 from-[var(--accountable-accent)] to-[var(--accountable-accent)] hover:from-[var(--accountable-accent-dark)] hover:to-[var(--accountable-accent-dark)]',
      ),
      allTransactionsButton: BUTTON_STYLES.secondary,
      closeModalButton: BUTTON_STYLES.secondary,
    },

    // Status Visual (big icon at top)
    statusVisualCustomization: {
      iconClassNames: {
        statusOverrides: {
          succeed: 'text-[var(--accountable-accent)]',
          failed: 'text-[var(--accountable-error)]',
          processing: 'text-[var(--accountable-accent)] animate-spin',
          initializing: 'text-[var(--accountable-alert)] animate-pulse',
          replaced: 'text-[var(--accountable-disabled)]',
        },
      },
    },

    // Progress Indicator (Created → Processing → Succeed)
    progressIndicatorCustomization: {
      stepClassNames: {
        label: cn(SHARED_STYLES.fontMono, 'text-[var(--accountable-foreground)]'),
        statusOverrides: {
          completed: {
            line: 'bg-[var(--accountable-accent)]',
            circle: 'bg-[var(--accountable-accent)] border-[var(--accountable-accent)]',
          },
          active: {
            line: 'bg-[var(--accountable-alert)]',
            circle: 'border-[var(--accountable-alert)] bg-transparent',
          },
          inactive: {
            line: 'bg-[var(--accountable-border)]',
            circle: 'border-[var(--accountable-border)] bg-transparent',
          },
          error: {
            line: 'bg-[var(--accountable-error)]',
            circle: 'bg-[var(--accountable-error)] border-[var(--accountable-error)]',
          },
          replaced: {
            line: 'bg-[var(--accountable-disabled)]',
            circle: 'bg-[var(--accountable-disabled)] border-[var(--accountable-disabled)]',
          },
        },
      },
    },

    // Info Block (Network, Started, Tx Hash)
    infoBlockCustomization: {
      classNames: {
        container: cn(
          'rounded-[4px] border border-[var(--accountable-border)]',
          'bg-[var(--accountable-background-3)]',
        ),
        row: 'text-sm',
        rowLabel: cn(SHARED_STYLES.fontMono, 'text-[var(--accountable-secondary)]'),
        rowValue: cn(SHARED_STYLES.fontMonoMedium, 'text-[var(--accountable-foreground)]'),
        separator: 'border-[var(--accountable-border)]',
        hashLink: {
          label: cn(SHARED_STYLES.fontMonoMedium, 'text-[var(--accountable-foreground)]'),
          link: 'text-[var(--accountable-accent)] hover:underline',
          copyButton: 'text-[var(--accountable-secondary)] hover:text-[var(--accountable-accent)]',
        },
      },
    },

    // Error Block
    errorBlockCustomization: {
      classNames: {
        container: cn(
          'rounded-[4px] border border-[var(--accountable-error)]/30',
          'bg-[var(--accountable-background-3)]',
        ),
        title: cn(SHARED_STYLES.fontMonoMedium, 'text-[var(--accountable-error)]'),
        icon: 'text-[var(--accountable-error)]',
        copyButton: 'text-[var(--accountable-secondary)] hover:text-[var(--accountable-error)]',
        messageContainer: cn(
          'rounded-[4px] bg-[var(--accountable-background)]',
          'border border-[var(--accountable-border)]',
        ),
        messageText: cn(SHARED_STYLES.fontMono, 'text-xs text-[var(--accountable-foreground)]'),
      },
    },
  },
};
