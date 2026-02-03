import { cn } from '@tuwaio/nova-core';
import { NovaTransactionsProviderProps } from '@tuwaio/nova-transactions/providers';

import {
  BUTTON_STYLES,
  CARD_STYLES,
  HASH_LINK_STYLES,
  ICON_BUTTON_STYLES,
  MODAL_STYLES,
  SHARED_STYLES,
  STATUS_STYLES,
} from './shared_styles';
import { transactions_history_customization } from './tx_history';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nova_tx_provider_customization: NovaTransactionsProviderProps<any>['customization'] = {
  // ========== Toast Close Button Customization ==========
  toastCloseButton: {
    className: MODAL_STYLES.closeButton,
  },

  // ========== Toast Customization ==========
  toast: {
    classNames: {
      container: cn('rounded-[4px]', SHARED_STYLES.borderDefault, SHARED_STYLES.bgBase),

      // Title & Description
      title: cn(SHARED_STYLES.fontMonoMedium, 'text-sm', SHARED_STYLES.textForeground),
      description: cn(SHARED_STYLES.fontMono, 'mt-1 text-xs', SHARED_STYLES.textSecondary),

      // Transaction Key / Hash
      transactionKey: 'border-[var(--tuwa-border-primary)]',
      hashLabel: cn(SHARED_STYLES.fontMonoMedium, 'text-sm pr-1', SHARED_STYLES.textForeground),
      hashLink: cn(SHARED_STYLES.fontMono, SHARED_STYLES.textAccent, 'hover:underline transition-colors'),
      hashCopyButton: ICON_BUTTON_STYLES.copy,

      // Original Hash (replaced transactions)
      originalHashLabel: cn(SHARED_STYLES.fontMonoMedium, 'text-xs', SHARED_STYLES.textSecondary),
      originalHashLink: cn(SHARED_STYLES.fontMono, 'text-xs', SHARED_STYLES.textSecondary),
      originalHashCopyButton: cn('opacity-50', ICON_BUTTON_STYLES.copy),

      // Footer & Status
      statusBadge: cn(SHARED_STYLES.fontMono, 'text-xs font-medium'),
      statusBadgeLabel: SHARED_STYLES.fontMono,

      // Action Buttons
      speedUpButton: BUTTON_STYLES.link,
      cancelButton: cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'hover:opacity-80'),
      txInfoButton: BUTTON_STYLES.primary,
    },
  },

  // ========== Transactions Info Modal ==========
  transactionsInfoModal: {
    classNames: {
      header: cn(SHARED_STYLES.bgBase, 'border-[var(--tuwa-border-primary)]', SHARED_STYLES.textForeground),
      headerTitle: MODAL_STYLES.headerTitle,
      closeButton: cn(MODAL_STYLES.closeButtonWithIcon, SHARED_STYLES.baseFocus),
    },
    historyCustomization: transactions_history_customization,
  },

  // ========== Tracking Transaction Modal ==========
  trackingTxModal: {
    classNames: {
      // Container & Sections
      container: SHARED_STYLES.bgBase,
      header: cn(SHARED_STYLES.bgBase, 'border-[var(--tuwa-border-primary)]', SHARED_STYLES.textForeground),
      headerTitle: MODAL_STYLES.headerTitle,
      closeButton: MODAL_STYLES.closeButtonWithIcon,
      main: SHARED_STYLES.bgBase,

      // Footer
      footer: cn(MODAL_STYLES.footer, 'p-4'),

      // Buttons
      speedUpButton: BUTTON_STYLES.link,
      cancelButton: cn(SHARED_STYLES.fontMono, 'text-sm', SHARED_STYLES.textSecondary, 'hover:opacity-80'),
      retryButton: cn(
        BUTTON_STYLES.primary,
        'text-sm px-4 py-2',
        'from-[var(--tuwa-text-accent)] to-[var(--tuwa-text-accent)]',
        'hover:from-[var(--tuwa-bg-muted)] hover:to-[var(--tuwa-bg-muted)]',
      ),
      allTransactionsButton: BUTTON_STYLES.secondary,
      closeModalButton: BUTTON_STYLES.secondary,
    },

    // Status Visual (big icon at top)
    statusVisualCustomization: {
      iconClassNames: {
        statusOverrides: {
          succeed: STATUS_STYLES.icon.success,
          failed: STATUS_STYLES.icon.error,
          processing: STATUS_STYLES.icon.pending,
          initializing: STATUS_STYLES.icon.initializing,
          replaced: STATUS_STYLES.icon.disabled,
        },
      },
    },

    // Progress Indicator (Created → Processing → Succeed)
    progressIndicatorCustomization: {
      stepClassNames: {
        label: cn(SHARED_STYLES.fontMono, SHARED_STYLES.textForeground),
        statusOverrides: STATUS_STYLES.progress,
      },
    },

    // Info Block (Network, Started, Tx Hash)
    infoBlockCustomization: {
      classNames: {
        container: CARD_STYLES.infoBlock,
        rowLabel: cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary),
        rowValue: cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textForeground),
        separator: 'border-[var(--tuwa-border-primary)]',
        hashLink: HASH_LINK_STYLES,
        originalHashLink: {
          label: cn(SHARED_STYLES.fontMonoMedium, 'text-xs', SHARED_STYLES.textSecondary),
          link: cn(SHARED_STYLES.fontMono, 'text-xs', SHARED_STYLES.textSecondary),
          copyButton: cn('opacity-50', ICON_BUTTON_STYLES.copy),
        },
      },
    },

    // Error Block
    errorBlockCustomization: {
      classNames: {
        container: CARD_STYLES.error,
        title: cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textError),
        icon: SHARED_STYLES.textError,
        copyButton: ICON_BUTTON_STYLES.copyError,
        messageContainer: cn('rounded-[4px]', SHARED_STYLES.bgDark, SHARED_STYLES.borderDefault),
        messageText: cn(SHARED_STYLES.fontMono, 'text-xs', SHARED_STYLES.textForeground),
      },
    },
  },
};
