import { NovaConnectProviderCustomization } from '@tuwaio/nova-connect';
import { cn } from '@tuwaio/nova-core';

import { connect_card_customization } from './connect_card';
import { connected_modal_customization } from './connected_modal';
import { SHARED_STYLES } from './shared_styles';

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
              connectCard: connect_card_customization,
            },
            popular: {
              classNames: {
                title: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm'),
              },
              connectCard: connect_card_customization,
            },
          },

          // Impersonate wallet card
          impersonateCard: connect_card_customization,

          disclaimer: {
            classNames: {
              container: () =>
                cn('p-2 rounded-[4px] border border-[var(--accountable-border)] flex flex-col gap-2 sm:p-4 sm:gap-4'),
              title: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textPrimary, 'font-medium', 'text-md'),
              description: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-[12px]'),
              button: () =>
                cn(
                  SHARED_STYLES.baseButton,
                  'px-2 min-h-[40px] text-sm',
                  SHARED_STYLES.bgBase,
                  SHARED_STYLES.borderDefault,
                  SHARED_STYLES.textForeground,
                  SHARED_STYLES.fontMono,
                  'hover:bg-[var(--accountable-border)]',
                  SHARED_STYLES.baseFocus,
                ),
            },
          },
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
    connectedModal: connected_modal_customization,
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
