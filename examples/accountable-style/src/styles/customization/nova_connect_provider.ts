import { NovaConnectProviderCustomization } from '@tuwaio/nova-connect';
import { ConnectCardCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { chain_list_customization } from './chain_list';
import { SHARED_STYLES } from './shared_styles';

// ═══════════════════════════════════════════════════════════════════════════════
// CONNECT CARD CUSTOMIZATION - Wallet item cards
// Only override colors and fonts, preserving original component behavior
// ═══════════════════════════════════════════════════════════════════════════════

const getConnectCardCustomization = (): ConnectCardCustomization => {
  return {
    classNames: {
      // Card container - preserve original structure, override colors only
      container: () =>
        cn(
          // Original layout & behavior (KEEP)
          'group cursor-pointer p-4 rounded-xl transition-colors relative border disabled:opacity-50 disabled:cursor-not-allowed',
          'w-full h-auto',
          'flex items-center justify-between',
          // Accountable theme colors
          'border-[var(--accountable-border)]',
          'bg-[var(--accountable-background-2)]',
          'hover:bg-[var(--accountable-accent-dark)]',
          'hover:border-[var(--accountable-accent)]',
          SHARED_STYLES.baseFocus,
        ),

      // Content wrapper - preserve original, override colors
      content: () =>
        cn(
          // Original layout (KEEP)
          'flex gap-3 transition duration-300 ease-in-out items-center',
          // Accountable theme colors
          'text-[var(--accountable-foreground)]',
          'group-hover:text-[var(--accountable-accent)]',
        ),

      // Icon container - preserve original animation
      iconContainer: () => cn('flex relative transition duration-300 ease-in-out group-hover:scale-115'),

      // Icon wrapper - preserve original sizes
      iconWrapper: () =>
        cn(
          'w-[42px] h-[42px] sm:w-[32px] sm:h-[32px]',
          '[&_img]:w-[42px]! [&_img]:h-[42px]! sm:[&_img]:w-[32px]! sm:[&_img]:h-[32px]!',
          '[&_svg]:w-[42px]! [&_svg]:h-[42px]! sm:[&_svg]:w-[32px]! sm:[&_svg]:h-[32px]!',
          'leading-[0]',
          'rounded-[4px] overflow-hidden',
        ),

      // Text container - preserve original
      textContainer: () => cn('flex flex-col gap-0.5 items-start'),

      // Wallet title - preserve original, override font/colors
      title: () =>
        cn(
          SHARED_STYLES.fontMono,
          'text-[var(--accountable-foreground)]',
          'group-hover:text-[var(--accountable-accent)]',
          'transition-colors duration-200',
        ),

      // Subtitle - override font/colors
      subtitle: () => cn(SHARED_STYLES.fontMono, 'text-[var(--accountable-secondary)] text-sm'),

      // Info link - preserve behavior, override colors
      infoLink: () =>
        cn(
          'absolute top-[2px] right-[2px]',
          'text-[var(--accountable-secondary)]',
          'transition duration-300 ease-in-out',
          'active:scale-75 hover:scale-110',
          'group-hover:text-[var(--accountable-foreground)]',
        ),

      // Recent badge wrapper - PRESERVE original hover behavior (hide on hover)
      recentBadgeWrapper: () =>
        cn(
          SHARED_STYLES.fontMono,
          'absolute top-0.5 right-0.5',
          'transition group-hover:opacity-0 group-hover:scale-90',
          'text-[var(--accountable-secondary)]',
        ),

      // Chevron icon - PRESERVE original animation (slide in on hover)
      chevron: () =>
        cn(
          'w-5 h-5',
          'transition duration-300 ease-in-out',
          // Original animation: hidden, slides in on hover
          'translate-x-[-10px] opacity-0',
          'group-hover:translate-x-0 group-hover:opacity-100',
          // Accountable colors
          'text-[var(--accountable-secondary)]',
          'group-hover:text-[var(--accountable-accent)]',
        ),
    },
    recentBadge: {
      classNames: {
        container: () =>
          cn(
            'inline-flex items-center rounded-full font-medium relative overflow-hidden text-[var(--accountable-secondary)] border border-[var(--accountable-border)] px-2.5 py-0.5 text-xs',
          ),
        backgroundOverlay: () =>
          'absolute z-10 pointer-events-none rounded-full bg-[var(--accountable-background-2)] inset-[1px]',
      },
      config: {
        gradient: {
          direction: '90deg',
          stops: [
            { position: 0, color: 'rgba(255, 255, 255, 0)' },
            { position: 20, color: 'var(--accountable-accent)' },
            { position: 40, color: 'rgba(255, 255, 255, 0)' },
          ],
        },
      },
    },
  };
};

export const nova_connect_provider_customization: NovaConnectProviderCustomization = {
  modals: {
    connectModal: {
      // ─────────────────────────────────────────────────────────────────────
      // Modal Structure Classes
      // ─────────────────────────────────────────────────────────────────────
      classNames: {
        // Modal container
        modalContainer: () => cn(SHARED_STYLES.bgBase),

        // Header styling
        header: () => cn(SHARED_STYLES.bgBase, 'border-[var(--accountable-border)]'),

        // Title styling
        title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary, 'text-lg'),

        // Info button (?)
        infoButton: () =>
          cn(
            'rounded-[4px]',
            SHARED_STYLES.textSecondary,
            'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-accent)]',
          ),

        // Close button (X)
        closeButton: () =>
          cn(
            'rounded-[4px]',
            SHARED_STYLES.textSecondary,
            'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-primary)]',
            SHARED_STYLES.baseFocus,
          ),

        // Main content area
        mainContent: () => cn(SHARED_STYLES.bgBase),

        // Footer
        footer: () => cn('border-t border-[var(--accountable-border)]', SHARED_STYLES.bgBase),

        // Back button
        backButton: () =>
          cn(
            SHARED_STYLES.baseButton,
            'min-h-[40px]',
            SHARED_STYLES.bgBase,
            SHARED_STYLES.borderDefault,
            SHARED_STYLES.textForeground,
            SHARED_STYLES.fontMono,
            'hover:bg-[var(--accountable-border)]',
            SHARED_STYLES.baseFocus,
          ),

        // Action button ("I don't have a wallet", etc.)
        actionButton: () =>
          cn(
            SHARED_STYLES.baseButton,
            'min-h-[40px]',
            SHARED_STYLES.bgAccent,
            SHARED_STYLES.textAccentDark,
            SHARED_STYLES.fontMonoMedium,
            'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-foreground)]',
            SHARED_STYLES.baseFocus,
          ),
      },

      // ─────────────────────────────────────────────────────────────────────
      // Child Components Customization
      // ─────────────────────────────────────────────────────────────────────
      childComponents: {
        // Connector selections (wallet list container)
        connectorsSelections: {
          // ConnectorsBlock - sections like "Installed", "Popular"
          connectorsBlock: {
            installed: {
              classNames: {
                title: () =>
                  cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textAccent, 'text-sm uppercase tracking-wide'),
              },
              connectCard: getConnectCardCustomization(),
            },
            popular: {
              classNames: {
                title: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm'),
              },
              connectCard: getConnectCardCustomization(),
            },
          },

          // Impersonate wallet card
          impersonateCard: getConnectCardCustomization(),
        },

        // About wallets / educational content
        aboutWallets: {
          classNames: {
            // Section wrapper
            section: () => cn('relative m-[-16px]', SHARED_STYLES.bgBase),

            // Content section (title + description area) - override the default bg
            contentSection: () => cn('text-center relative p-4', 'bg-[var(--accountable-background-2)]'),

            // Title styling
            title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary, 'text-base'),

            // Description styling
            description: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm leading-relaxed'),

            // Navigation container styling
            navigation: () =>
              cn(
                'flex justify-center space-x-2 mt-6 relative z-3 mx-4 mb-4',
                // Override the line color via child selectors
                '[&>div:first-child]:bg-[var(--accountable-border)]',
                // Navigation wrapper background
                '[&>div:last-child]:bg-[var(--accountable-background-2)]',
              ),

            // Indicator dots styling
            indicator: ({ isActive }) =>
              cn(
                'cursor-pointer h-2 rounded-full transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-2',
                isActive
                  ? 'bg-[var(--accountable-accent)] w-6'
                  : 'bg-[var(--accountable-border)] w-2 hover:bg-[var(--accountable-accent)]',
              ),
          },
        },

        // Get wallet screen
        getWallet: {
          classNames: {
            title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary, 'text-base mb-3'),
            description: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm'),
          },
        },

        // Impersonate form
        impersonateForm: {
          classNames: {
            label: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm'),
            input: ({ hasError }) =>
              cn(
                SHARED_STYLES.fontMono,
                SHARED_STYLES.bgBase,
                SHARED_STYLES.textForeground,
                'w-full mt-2 px-4 py-3 rounded-[4px] text-sm',
                'placeholder:text-[var(--accountable-disabled)]',
                'border transition-colors duration-200',
                hasError
                  ? 'border-[var(--accountable-error)] focus:ring-1 focus:ring-[var(--accountable-error)] focus:border-[var(--accountable-error)]'
                  : 'border-[var(--accountable-border)] focus:border-[var(--accountable-accent)] focus:ring-1 focus:ring-[var(--accountable-accent)]',
                'focus:outline-none',
              ),
            errorMessage: () => cn(SHARED_STYLES.fontMono, 'mt-2 text-sm', 'text-[var(--accountable-error)]'),
          },
        },

        legalDisclaimer: {
          classNames: {
            container: () => cn('border-t border-[var(--accountable-border)]', 'pt-3 mt-2'),
            text: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-xs text-center'),
            termsLink: () => cn('underline transition-colors', 'hover:text-[var(--accountable-accent)]'),
            privacyLink: () => cn('underline transition-colors', 'hover:text-[var(--accountable-accent)]'),
            separator: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-xs text-center'),
          },
        },

        // ─────────────────────────────────────────────────────────────────────
        // Connecting Screen Customization
        // ─────────────────────────────────────────────────────────────────────
        connecting: {
          classNames: {
            // Main container - preserve layout, override colors
            container: () =>
              cn(
                // Original layout (KEEP)
                'flex flex-col gap-4 items-center justify-center w-full',
              ),

            // Status container (circular icon wrapper)
            statusContainer: ({ statusData }) =>
              cn(
                // Original layout (KEEP)
                'relative flex items-center justify-center',
                'min-w-[110px] min-h-[110px] md:min-w-[150px] md:min-h-[150px]',
                'border-2 rounded-full',
                'p-4 md:p-6',
                'transition-all duration-300 ease-in-out',
                // Accountable theme colors based on state
                statusData.state === 'error'
                  ? 'border-[var(--accountable-error)] bg-[var(--accountable-error)]/5'
                  : statusData.state === 'success'
                    ? 'border-[var(--accountable-accent)] bg-[var(--accountable-accent)]/5'
                    : 'border-[var(--accountable-border)] bg-[var(--accountable-background-2)]',
              ),

            // Loading spinner
            spinner: () =>
              cn(
                // Original layout (KEEP)
                'absolute animate-spin rounded-full -inset-[2px]',
                'w-[calc(100%_+_4px)] h-[calc(100%_+_4px)]',
                'border-2',
                // Accountable accent color for spinner
                'border-[var(--accountable-accent)]',
                'border-t-transparent',
              ),

            // Success/Error icon badge
            statusIcon: ({ statusData }) =>
              cn(
                // Original layout (KEEP)
                'absolute -top-2 -right-2 w-8 h-8 rounded-full',
                'flex items-center justify-center',
                // Accountable colors
                statusData.state === 'success' ? 'bg-[var(--accountable-accent)]' : 'bg-[var(--accountable-error)]',
              ),

            // Wallet icon container
            walletIconContainer: () =>
              cn(
                // Original sizes (KEEP)
                '[&_svg]:w-[60px]! [&_svg]:h-[auto]! md:[&_svg]:w-[80px]!',
                '[&_img]:w-[60px]! [&_img]:h-[auto]! md:[&_img]:w-[80px]!',
                'leading-[0]',
              ),

            // Message container
            messageContainer: () => cn('text-center space-y-2 max-w-md'),

            // Status message text
            statusMessage: ({ statusData }) =>
              cn(
                SHARED_STYLES.fontMonoMedium,
                'text-lg transition-colors duration-300',
                statusData.state === 'error'
                  ? 'text-[var(--accountable-error)]'
                  : statusData.state === 'success'
                    ? 'text-[var(--accountable-accent)]'
                    : 'text-[var(--accountable-foreground)]',
              ),

            // Error message
            errorMessage: () =>
              cn(SHARED_STYLES.fontMono, 'text-sm text-center leading-relaxed', 'text-[var(--accountable-error)]'),

            // Error details (expandable)
            errorDetails: () => cn('mt-3 text-left'),

            // Loading placeholder
            loadingPlaceholder: () =>
              cn(
                'flex flex-col gap-4 items-center justify-center w-full py-8',
                // Accountable muted colors for skeleton
                '[&>div]:bg-[var(--accountable-background-2)]',
              ),
          },
        },
      },
    },

    // ═══════════════════════════════════════════════════════════════════════════════
    // CONNECTED MODAL CUSTOMIZATION - Post-connection wallet management
    // ═══════════════════════════════════════════════════════════════════════════════
    connectedModal: {
      // ─────────────────────────────────────────────────────────────────────
      // Modal Structure Classes
      // ─────────────────────────────────────────────────────────────────────
      classNames: {
        // Modal header
        header: () =>
          cn(
            SHARED_STYLES.bgBase,
            'border-b border-[var(--accountable-border)]',
            'p-4',
            '[&_button]:rounded-[4px]',
            '[&_button]:text-[var(--accountable-secondary)]',
            '[&_button]:hover:bg-[var(--accountable-accent-dark)]',
            '[&_button]:hover:text-[var(--accountable-primary)]',
            '[&_button]:focus:ring-[var(--accountable-accent)]',
          ),

        // Title styling
        title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary, 'text-base'),

        // Back button
        backButton: () =>
          cn(
            'rounded-[4px] p-1 cursor-pointer transition-colors',
            SHARED_STYLES.textSecondary,
            'hover:bg-[var(--accountable-accent-dark)]',
            'hover:text-[var(--accountable-primary)]',
            SHARED_STYLES.baseFocus,
          ),

        // Close button
        closeButton: () =>
          cn(
            'rounded-[4px] p-1 cursor-pointer transition-colors',
            SHARED_STYLES.textSecondary,
            'hover:bg-[var(--accountable-accent-dark)]',
            'hover:text-[var(--accountable-primary)]',
            SHARED_STYLES.baseFocus,
          ),

        // Main content area
        mainContent: () => cn(SHARED_STYLES.bgBase),

        // Footer
        footer: () =>
          cn(
            SHARED_STYLES.bgBase,
            'border-t border-[var(--accountable-border)]',
            'p-4',
            // Footer buttons
            '[&_button]:cursor-pointer',
            '[&_button]:rounded-[4px]',
            '[&_button]:transition-colors',
            '[&_a]:cursor-pointer',
            '[&_a]:rounded-[4px]',
            '[&_a]:transition-colors',
          ),
      },

      // ─────────────────────────────────────────────────────────────────────
      // Child Components Customization
      // ─────────────────────────────────────────────────────────────────────
      childCustomizations: {
        // ConnectionsContent - wallet connections list
        connections: {
          classNames: {
            // Container
            container: () => cn('flex flex-col gap-6 p-4', SHARED_STYLES.bgBase),

            // Empty state
            emptyState: () => cn('flex flex-col items-center justify-center p-8', SHARED_STYLES.bgBase),

            // Active section title
            activeSectionTitle: () =>
              cn(SHARED_STYLES.fontMonoMedium, 'mb-2 text-xs uppercase tracking-wider', SHARED_STYLES.textAccent),
            // Active section wrapper
            activeSectionWrapper: () =>
              cn(
                'overflow-hidden rounded-[4px]',
                'border border-[var(--accountable-border)]',
                'bg-[var(--accountable-background-2)]',
              ),

            // Recent section title
            recentSectionTitle: () =>
              cn(SHARED_STYLES.fontMono, 'mb-2 text-xs uppercase tracking-wider', SHARED_STYLES.textSecondary),
            // Recent section list
            recentSectionList: () => cn('max-h-[240px] overflow-x-hidden overflow-y-auto flex flex-col gap-2'),

            // Active row container (main connected wallet)
            activeRowContainer: () =>
              cn('relative flex items-center justify-between p-4', 'bg-[var(--accountable-accent)]/5'),
            // Active badge
            activeRowBadge: () =>
              cn(
                SHARED_STYLES.fontMono,
                'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                'bg-[var(--accountable-accent)]/20',
                SHARED_STYLES.textAccent,
              ),
            // Active row wallet name
            activeRowWalletName: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textForeground),
            // Active row connector name
            activeRowConnectorName: () => cn(SHARED_STYLES.fontMono, 'text-xs', SHARED_STYLES.textSecondary),
            // Actions container
            activeRowActionsContainer: () => cn('mt-1 flex items-center gap-2'),
            // Copy button
            activeRowCopyButton: () =>
              cn(
                'flex cursor-pointer items-center gap-1 text-[10px]',
                SHARED_STYLES.fontMono,
                SHARED_STYLES.textSecondary,
                'transition-colors',
                'hover:text-[var(--accountable-accent)]',
              ),
            // Explorer button
            activeRowExplorerButton: () =>
              cn(
                'flex cursor-pointer items-center gap-1 text-[10px]',
                SHARED_STYLES.fontMono,
                SHARED_STYLES.textSecondary,
                'transition-colors',
                'hover:text-[var(--accountable-accent)]',
              ),
            // Disconnect button
            activeRowDisconnectButton: () =>
              cn(
                SHARED_STYLES.baseButton,
                'mt-4 min-h-0 px-3 py-1.5 text-xs',
                SHARED_STYLES.fontMono,
                SHARED_STYLES.borderDefault,
                SHARED_STYLES.textForeground,
                'hover:bg-[var(--accountable-error)]/10',
                'hover:border-[var(--accountable-error)]',
                'hover:text-[var(--accountable-error)]',
              ),

            // Connected row (secondary wallets)
            connectedRowContainer: () =>
              cn(
                'group relative flex cursor-pointer items-center justify-between',
                'border-t border-[var(--accountable-border)]',
                'p-3 transition-colors',
                'hover:bg-[var(--accountable-accent-dark)]',
              ),
            connectedRowWalletName: () => cn(SHARED_STYLES.fontMono, 'text-sm', SHARED_STYLES.textForeground),
            connectedRowConnectorName: () => cn(SHARED_STYLES.fontMono, 'text-[10px]', SHARED_STYLES.textSecondary),
            connectedRowDisconnectButton: () =>
              cn(
                'cursor-pointer rounded-[4px] p-1.5',
                SHARED_STYLES.textSecondary,
                'transition-colors',
                'hover:bg-[var(--accountable-error)]/10',
                'hover:text-[var(--accountable-error)]',
              ),

            // Recent row
            recentRowContainer: () =>
              cn(
                'flex items-center justify-between rounded-[4px] p-3',
                SHARED_STYLES.borderDefault,
                'bg-[var(--accountable-background-2)]',
              ),
            recentRowWalletName: () => cn(SHARED_STYLES.fontMono, 'text-sm', SHARED_STYLES.textForeground),
            recentRowConnectorName: () => cn(SHARED_STYLES.fontMono, 'text-[10px]', SHARED_STYLES.textSecondary),
            recentRowConnectButton: () =>
              cn(
                SHARED_STYLES.baseButton,
                'min-h-0 px-3 py-1.5 text-xs',
                SHARED_STYLES.fontMono,
                SHARED_STYLES.borderDefault,
                SHARED_STYLES.textForeground,
                'hover:bg-[var(--accountable-accent-dark)]',
                'hover:border-[var(--accountable-accent)]',
              ),
            recentRowRemoveButton: () =>
              cn(
                'cursor-pointer rounded-[4px] p-1.5',
                SHARED_STYLES.textSecondary,
                'transition-colors',
                'hover:bg-[var(--accountable-error)]/10',
                'hover:text-[var(--accountable-error)]',
              ),

            // Add wallet button
            addWalletButton: () =>
              cn(
                'mt-2 w-full cursor-pointer rounded-[4px]',
                'border border-dashed border-[var(--accountable-border)]',
                'p-3 text-sm',
                SHARED_STYLES.fontMono,
                SHARED_STYLES.textSecondary,
                'transition-colors',
                'hover:border-[var(--accountable-accent)]',
                'hover:text-[var(--accountable-accent)]',
              ),
          },
        },

        chainList: chain_list_customization.scrollableChainList,

        // Footer customization
        footer: {
          classNames: {
            // Container
            container: () =>
              cn(
                'flex flex-wrap gap-4 w-full items-center justify-between border-t border-[var(--accountable-border)] p-4 flex-col-reverse sm:flex-row',
                SHARED_STYLES.bgBase,
              ),

            // Disconnect button
            disconnectButton: () =>
              cn(
                SHARED_STYLES.baseButton,
                'min-h-[40px]',
                SHARED_STYLES.fontMono,
                'text-sm',
                SHARED_STYLES.borderDefault,
                SHARED_STYLES.textForeground,
                'hover:bg-[var(--accountable-error)]/10',
                'hover:border-[var(--accountable-error)]',
                'hover:text-[var(--accountable-error)]',
                SHARED_STYLES.baseFocus,
              ),

            // Explorer link
            explorerLink: () =>
              cn(
                SHARED_STYLES.baseButton,
                'min-h-[40px]',
                SHARED_STYLES.fontMono,
                'text-sm no-underline',
                SHARED_STYLES.borderDefault,
                SHARED_STYLES.textForeground,
                'hover:bg-[var(--accountable-accent-dark)]',
                'hover:border-[var(--accountable-accent)]',
                'hover:text-[var(--accountable-accent)]',
                SHARED_STYLES.baseFocus,
              ),
          },
        },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ERRORS PROVIDER CUSTOMIZATION - Toast notifications
  // ═══════════════════════════════════════════════════════════════════════════════
  errors: {
    toastErrorCustomization: {
      classNames: {
        // Toast container
        container: () =>
          cn(
            SHARED_STYLES.fontMono,
            'p-4 rounded-md w-full',
            'bg-[var(--accountable-background-2)]',
            'border border-[var(--accountable-error)]',
          ),

        // Error title
        title: () => cn(SHARED_STYLES.fontMonoMedium, 'text-sm truncate', 'text-[var(--accountable-error)]'),

        // Error description
        description: () =>
          cn(SHARED_STYLES.fontMono, 'mt-1 text-xs break-words opacity-80', 'text-[var(--accountable-error)]'),

        // Copy button
        button: ({ isCopied }) =>
          cn(
            SHARED_STYLES.fontMono,
            'cursor-pointer mt-2 text-xs font-medium inline-flex items-center space-x-1.5',
            'rounded-md px-2 py-1 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--accountable-error)] focus:ring-opacity-50',
            isCopied
              ? 'bg-[var(--accountable-accent)] bg-opacity-10 text-[var(--accountable-accent)]'
              : 'text-[var(--accountable-error)] hover:bg-[var(--accountable-error)] hover:bg-opacity-10',
          ),

        // Copy icon
        icon: ({ isCopied }) => cn('w-4 h-4 transition-colors', isCopied && 'text-[var(--accountable-accent)]'),
      },
    },
  },
};
