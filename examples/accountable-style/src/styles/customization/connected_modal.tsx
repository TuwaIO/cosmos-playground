import { ConnectedModalCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';
import React from 'react';

import { ExtraBalancesSection } from '../../components/connect-wallet/ExtraBalances';
import { TelegramBotButton } from '../../components/connect-wallet/TelegramBotButton';
import { balance_display_customization } from './balance_display';
import { chain_list_customization } from './chain_list';
import { BUTTON_STYLES, ICON_BUTTON_STYLES, MODAL_STYLES, SHARED_STYLES } from './shared_styles';
import { transactions_history_customization } from './tx_history';

// ═══════════════════════════════════════════════════════════════════════════════
// CONNECTED MODAL CUSTOMIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export const connected_modal_customization: ConnectedModalCustomization = {
  classNames: {
    // Modal header
    header: () =>
      cn(
        MODAL_STYLES.header,
        'p-4',
        '[&_button]:rounded-[4px]',
        '[&_button]:' + SHARED_STYLES.textSecondary,
        '[&_button]:hover:bg-[var(--accountable-accent-dark)]',
        '[&_button]:hover:text-[var(--accountable-primary)]',
        '[&_button]:focus:ring-[var(--accountable-accent)]',
      ),

    // Title styling
    dialogTitle: () => MODAL_STYLES.headerTitle,

    // Back button
    backButton: () => MODAL_STYLES.closeButton,

    // Close button
    closeButton: () => MODAL_STYLES.closeButton,

    // Main content area
    mainContent: () => SHARED_STYLES.bgBase,

    // Footer
    footer: () =>
      cn(
        MODAL_STYLES.footer,
        'p-4',
        '[&_button]:cursor-pointer [&_button]:rounded-[4px] [&_button]:transition-colors',
        '[&_a]:cursor-pointer [&_a]:rounded-[4px] [&_a]:transition-colors',
      ),
  },

  // ─────────────────────────────────────────────────────────────────────
  // Child Components Customization
  // ─────────────────────────────────────────────────────────────────────
  childCustomizations: {
    // ═══════════════════════════════════════════════════════════════════
    // MAIN CONTENT - Center section with avatar, balance, etc.
    // ═══════════════════════════════════════════════════════════════════
    mainContent: {
      classNames: {
        // Main container
        container: () => cn('flex flex-col items-center justify-center gap-3 p-4', SHARED_STYLES.bgBase),

        // Transactions button - accent style, NOT full width
        transactionsButton: () => cn(BUTTON_STYLES.primary, 'min-h-[40px] px-6 text-sm', SHARED_STYLES.fontMono),

        // Extra balances container
        extraBalancesContainer: () => 'w-full',
        // Custom content container (Telegram button)
        customContentContainer: () => 'w-full mt-2',
      },

      // Child component customizations
      childCustomizations: {
        // WalletAvatar - Large avatar in center
        walletAvatar: {
          classNames: {
            // Container with Accountable styling
            container: () =>
              cn(
                // Size override (will use className from MainContent for sizing)
                'flex-shrink-0 rounded-full relative overflow-hidden w-36 h-36 sm:w-32 sm:h-32',
                // Accountable border
                'ring-2 ring-[var(--accountable-border)]',
                // Focus state
                'focus-within:ring-[var(--accountable-accent)]',
              ),
            // Loading overlay with Accountable colors
            loadingOverlay: ({ isLoading, showLoading, disableAnimation }) =>
              cn(
                'absolute inset-0 rounded-full',
                'bg-[var(--accountable-background-3)]',
                !disableAnimation && showLoading && isLoading && 'animate-pulse',
                (!isLoading || !showLoading) && 'opacity-0',
                'transition-opacity duration-300',
              ),
          },
        },

        // Switch wallet IconButton (LEFT button under avatar)
        switchWalletButton: {
          customization: {
            classNames: {
              // Full native styles with Accountable colors + POSITIONING
              button: ({ isClickable, disabled, loading }) =>
                cn(
                  // POSITIONING - must be here because className is ignored when button() is provided
                  'absolute z-[11] bottom-[-10px] left-[-10px]',
                  // Base styles (from native IconButton)
                  'flex items-center justify-center gap-1 rounded-full leading-[0]',
                  'p-1.5 transition-all duration-200',
                  // Accountable colors
                  'bg-[var(--accountable-background-2)] border border-[var(--accountable-border)]',
                  // Icon sizing
                  '[&_svg]:w-6! [&_svg]:h-6! [&_svg]:transition-transform [&_svg]:duration-200',
                  '[&_img]:w-6! [&_img]:h-6! [&_img]:transition-transform [&_img]:duration-200',
                  // Interactive states
                  isClickable && [
                    'cursor-pointer',
                    'hover:[&_svg]:scale-95 active:[&_svg]:scale-85',
                    'hover:[&_img]:scale-95 active:[&_img]:scale-85',
                    'hover:shadow-sm',
                    'hover:border-[var(--accountable-accent)]',
                    'hover:bg-[var(--accountable-accent-dark)]',
                  ],
                  disabled && !loading && 'cursor-not-allowed opacity-50',
                  loading && 'cursor-wait opacity-75',
                  !isClickable && !disabled && !loading && 'cursor-default',
                  // Focus states
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-[var(--accountable-accent)] focus-visible:ring-offset-2',
                ),
              // Green chevron
              chevronContainer: () => '[&_svg]:text-[var(--accountable-tertiary)]',
            },
          },
        },

        // Switch network IconButton (RIGHT button under avatar)
        switchNetworkButton: {
          customization: {
            classNames: {
              // Full native styles with Accountable colors + POSITIONING
              button: ({ isClickable, disabled, loading }) =>
                cn(
                  // POSITIONING - must be here because className is ignored when button() is provided
                  'absolute z-[11] bottom-[-10px] right-[-10px]',
                  // Base styles (from native IconButton)
                  'flex items-center justify-center gap-1 rounded-full leading-[0]',
                  'p-1.5 transition-all duration-200',
                  // Accountable colors
                  'bg-[var(--accountable-background-2)] border border-[var(--accountable-border)]',
                  // Icon sizing
                  '[&_svg]:w-6! [&_svg]:h-6! [&_svg]:transition-transform [&_svg]:duration-200',
                  '[&_img]:w-6! [&_img]:h-6! [&_img]:transition-transform [&_img]:duration-200',
                  // Interactive states
                  isClickable && [
                    'cursor-pointer',
                    'hover:[&_svg]:scale-95 active:[&_svg]:scale-85',
                    'hover:[&_img]:scale-95 active:[&_img]:scale-85',
                    'hover:shadow-sm',
                    'hover:border-[var(--accountable-accent)]',
                    'hover:bg-[var(--accountable-accent-dark)]',
                  ],
                  disabled && !loading && 'cursor-not-allowed opacity-50',
                  loading && 'cursor-wait opacity-75',
                  !isClickable && !disabled && !loading && 'cursor-default',
                  // Focus states
                  'focus-visible:outline-none focus-visible:ring-2',
                  'focus-visible:ring-[var(--accountable-accent)] focus-visible:ring-offset-2',
                ),
              // Green chevron
              chevronContainer: () => '[&_svg]:text-[var(--accountable-tertiary)]',
            },
          },
        },

        // Name and balance section
        nameAndBalance: {
          classNames: {
            walletNameDisplay: () => cn(SHARED_STYLES.fontMonoMedium, 'text-lg', SHARED_STYLES.textForeground),
            copyButton: () => cn(ICON_BUTTON_STYLES.default),
          },
          childCustomizations: {
            balanceDisplay: balance_display_customization,
          },
        },
      },

      renderExtraBalances: () => React.createElement(ExtraBalancesSection),
      renderCustomContent: () => React.createElement(TelegramBotButton),
    },

    // ConnectionsContent - wallet connections list
    connections: {
      classNames: {
        container: () => cn('flex flex-col gap-6 p-4', SHARED_STYLES.bgBase),
        emptyState: () => cn('flex flex-col items-center justify-center p-8', SHARED_STYLES.bgBase),

        // Active section
        activeSectionTitle: () =>
          cn(SHARED_STYLES.fontMonoMedium, 'mb-2 text-xs uppercase tracking-wider', SHARED_STYLES.textAccent),
        activeSectionWrapper: () =>
          cn('overflow-hidden rounded-[4px]', SHARED_STYLES.borderDefault, SHARED_STYLES.bgBase),

        // Recent section
        recentSectionTitle: () =>
          cn(SHARED_STYLES.fontMono, 'mb-2 text-xs uppercase tracking-wider', SHARED_STYLES.textSecondary),
        recentSectionList: () => 'max-h-[240px] overflow-x-hidden overflow-y-auto flex flex-col gap-2',

        // Active row
        activeRowContainer: () =>
          cn('relative flex items-center justify-between p-4', 'bg-[var(--accountable-accent)]/5'),
        activeRowBadge: () =>
          cn(
            SHARED_STYLES.fontMono,
            'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
            'bg-[var(--accountable-accent)]/20',
            SHARED_STYLES.textAccent,
          ),
        activeRowWalletName: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textForeground),
        activeRowConnectorName: () => cn(SHARED_STYLES.fontMono, 'text-xs', SHARED_STYLES.textSecondary),
        activeRowActionsContainer: () => 'mt-1 flex items-center gap-2',
        activeRowCopyButton: () =>
          cn('flex cursor-pointer items-center gap-1 text-[10px]', SHARED_STYLES.fontMono, ICON_BUTTON_STYLES.copy),
        activeRowExplorerButton: () =>
          cn('flex cursor-pointer items-center gap-1 text-[10px]', SHARED_STYLES.fontMono, ICON_BUTTON_STYLES.copy),
        activeRowDisconnectButton: () =>
          cn(
            BUTTON_STYLES.base,
            'mt-4 min-h-0 px-3 py-1.5 text-xs',
            SHARED_STYLES.fontMono,
            SHARED_STYLES.borderDefault,
            SHARED_STYLES.textForeground,
            'hover:bg-[var(--accountable-error)]/10 hover:border-[var(--accountable-error)] hover:text-[var(--accountable-error)]',
          ),

        // Connected row
        connectedRowContainer: () =>
          cn(
            'group relative flex cursor-pointer items-center justify-between',
            'border-t border-[var(--accountable-border)]',
            'p-3 transition-colors',
            'hover:bg-[var(--accountable-accent-dark)]',
          ),
        connectedRowSwitchIcon: () => SHARED_STYLES.textAccent,
        connectedRowWalletName: () => cn(SHARED_STYLES.fontMono, 'text-sm', SHARED_STYLES.textForeground),
        connectedRowConnectorName: () => cn(SHARED_STYLES.fontMono, 'text-[10px]', SHARED_STYLES.textSecondary),
        connectedRowDisconnectButton: () => ICON_BUTTON_STYLES.danger,

        // Recent row
        recentRowContainer: () =>
          cn('flex items-center justify-between rounded-[4px] p-3', SHARED_STYLES.borderDefault, SHARED_STYLES.bgBase),
        recentRowWalletName: () => cn(SHARED_STYLES.fontMono, 'text-sm', SHARED_STYLES.textForeground),
        recentRowConnectorName: () => cn(SHARED_STYLES.fontMono, 'text-[10px]', SHARED_STYLES.textSecondary),
        recentRowConnectButton: () =>
          cn(
            BUTTON_STYLES.baseSmall,
            'px-3 py-1.5 text-xs',
            SHARED_STYLES.fontMono,
            SHARED_STYLES.borderDefault,
            SHARED_STYLES.textForeground,
            'hover:bg-[var(--accountable-accent-dark)] hover:border-[var(--accountable-accent)]',
          ),
        recentRowRemoveButton: () => ICON_BUTTON_STYLES.danger,

        // Add wallet button
        addWalletButton: () =>
          cn(
            'mt-2 w-full cursor-pointer rounded-[4px]',
            'border border-dashed border-[var(--accountable-border)]',
            'p-3 text-sm',
            SHARED_STYLES.fontMono,
            SHARED_STYLES.textSecondary,
            'transition-colors',
            'hover:border-[var(--accountable-accent)] hover:text-[var(--accountable-accent)]',
          ),

        connectorIconBadge: () => 'border-[var(--accountable-border)]',
      },
    },

    chainList: chain_list_customization.scrollableChainList,

    // Transaction history
    txHistory: {
      classNames: {
        container: () => cn('flex flex-col items-center justify-center p-4', SHARED_STYLES.bgBase),
        loadingContainer: () => cn('flex flex-col items-center justify-center p-8 gap-4', SHARED_STYLES.bgBase),
        loadingSpinner: () =>
          cn('animate-spin rounded-full h-8 w-8 border-2', 'border-[var(--accountable-accent)] border-t-transparent'),
        loadingText: () => cn(SHARED_STYLES.fontMono, 'text-sm', SHARED_STYLES.textSecondary),
        errorContainer: () =>
          cn('flex flex-col items-center justify-center text-center gap-4 p-6', SHARED_STYLES.bgBase),
        errorIconContainer: () =>
          'w-12 h-12 p-2 rounded-full bg-[var(--accountable-warning)]/20 text-[var(--accountable-warning)]',
        errorIcon: () => 'w-full h-full',
        errorContent: () => 'space-y-2',
        errorTitle: () => cn(SHARED_STYLES.fontMonoMedium, 'text-lg', SHARED_STYLES.textForeground),
        errorDescription: () => cn(SHARED_STYLES.fontMono, 'text-sm max-w-md', SHARED_STYLES.textSecondary),
        noWalletContainer: () => cn('flex flex-col items-center justify-center p-6', SHARED_STYLES.bgBase),
        noWalletText: () => cn(SHARED_STYLES.fontMono, 'text-sm', SHARED_STYLES.textSecondary),
        pulsarRequiredContainer: () =>
          cn('flex flex-col items-center justify-center text-center gap-4 p-6', SHARED_STYLES.bgBase),
        pulsarRequiredIconContainer: () =>
          'w-12 h-12 p-2 rounded-full bg-gradient-to-r from-[var(--accountable-accent)] to-[var(--accountable-accent-dark)] text-[var(--accountable-foreground)]',
        pulsarRequiredIcon: () => 'w-full h-full',
        pulsarRequiredContent: () => 'space-y-2',
        pulsarRequiredTitle: () => cn(SHARED_STYLES.fontMonoMedium, 'text-lg', SHARED_STYLES.textForeground),
        pulsarRequiredDescription: () =>
          cn(SHARED_STYLES.fontMono, 'text-sm max-w-md leading-relaxed', SHARED_STYLES.textSecondary),
        transactionsHistoryWrapper: () => 'w-full',
      },
      transactionsHistory: transactions_history_customization,
    },

    footer: {
      classNames: {
        container: () =>
          cn(
            'flex flex-wrap gap-4 w-full items-center justify-between flex-col-reverse sm:flex-row',
            MODAL_STYLES.footer,
            'p-4',
          ),
        disconnectButton: () => cn(BUTTON_STYLES.danger, 'min-h-[40px] text-sm'),
        explorerLink: () =>
          cn(
            BUTTON_STYLES.ghost,
            'min-h-[40px] text-sm no-underline',
            'hover:bg-[var(--accountable-accent-dark)] hover:border-[var(--accountable-accent)] hover:text-[var(--accountable-accent)]',
          ),
      },
    },
  },
};
