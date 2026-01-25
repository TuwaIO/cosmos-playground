import { NovaConnectProviderCustomization } from '@tuwaio/nova-connect';
import { cn } from '@tuwaio/nova-core';

import { connect_card_customization } from './connect_card';
import { connected_modal_customization } from './connected_modal';
import { BUTTON_STYLES, MODAL_STYLES, SHARED_STYLES } from './shared_styles';

export const nova_connect_provider_customization: NovaConnectProviderCustomization = {
  modals: {
    connectModal: {
      // ─────────────────────────────────────────────────────────────────────
      // Modal Structure Classes
      // ─────────────────────────────────────────────────────────────────────
      classNames: {
        modalContainer: () => MODAL_STYLES.container,
        header: () => cn(SHARED_STYLES.bgBase, 'border-[var(--accountable-border)]'),
        title: () => cn(MODAL_STYLES.headerTitle, 'text-lg'),
        infoButton: () =>
          cn(
            'rounded-[4px]',
            SHARED_STYLES.textSecondary,
            'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-accent)]',
          ),
        closeButton: () => MODAL_STYLES.closeButton,
        mainContent: () => SHARED_STYLES.bgBase,
        footer: () => MODAL_STYLES.footer,
        backButton: () => BUTTON_STYLES.ghost,
        actionButton: () =>
          cn(
            BUTTON_STYLES.primary,
            'min-h-[40px]',
            'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-foreground)]',
          ),
      },

      // ─────────────────────────────────────────────────────────────────────
      // Child Components Customization
      // ─────────────────────────────────────────────────────────────────────
      childComponents: {
        connectorsSelections: {
          classNames: {
            emptyState: () =>
              cn(
                SHARED_STYLES.fontMono,
                SHARED_STYLES.textSecondary,
                SHARED_STYLES.bgDark,
                SHARED_STYLES.textSecondary,
                SHARED_STYLES.borderDefault,
                'text-sm',
                'flex flex-col items-center justify-center p-4 text-center rounded-[4px]',
                `[&_svg]:${SHARED_STYLES.textAccent}`,
                `[&_h2]:${SHARED_STYLES.textPrimary}`,
              ),
          },
          connectorsBlock: {
            installed: {
              classNames: {
                title: () =>
                  cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textAccent, 'text-sm uppercase tracking-wide'),
                emptyState: () =>
                  cn(
                    SHARED_STYLES.fontMono,
                    SHARED_STYLES.textSecondary,
                    SHARED_STYLES.bgDark,
                    SHARED_STYLES.textSecondary,
                    'text-sm',
                    'flex items-center justify-center p-4 rounded-[4px]',
                  ),
              },
              connectCard: connect_card_customization,
            },
            popular: {
              classNames: { title: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm') },
              connectCard: connect_card_customization,
            },
          },
          impersonateCard: connect_card_customization,
          disclaimer: {
            classNames: {
              container: () => cn('p-2 rounded-[4px] flex flex-col gap-2 sm:p-4 sm:gap-4', SHARED_STYLES.borderDefault),
              title: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textPrimary, 'font-medium text-md'),
              description: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-[12px]'),
              button: () => cn(BUTTON_STYLES.ghost, 'px-2 min-h-[40px] text-sm'),
            },
          },
        },

        aboutWallets: {
          classNames: {
            section: () => cn('relative m-[-16px]', SHARED_STYLES.bgBase),
            contentSection: () => cn('text-center relative p-4', SHARED_STYLES.bgBase),
            title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary, 'text-base'),
            description: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm leading-relaxed'),
            navigation: () =>
              cn(
                'flex justify-center space-x-2 mt-6 relative z-3 mx-4 mb-4',
                '[&>div:first-child]:bg-[var(--accountable-border)]',
                '[&>div:last-child]:bg-[var(--accountable-background-2)]',
              ),
            indicator: ({ isActive }) =>
              cn(
                'cursor-pointer h-2 rounded-full transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-2 hover:bg-[var(--accountable-accent)]',
                isActive ? 'bg-[var(--accountable-accent)] w-6' : 'bg-[var(--accountable-border)] w-2',
              ),
          },
        },

        getWallet: {
          classNames: {
            title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary, 'text-base mb-3'),
            description: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm'),
          },
        },

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
                'border transition-colors duration-200 focus:outline-none',
                hasError
                  ? 'border-[var(--accountable-error)] focus:ring-1 focus:ring-[var(--accountable-error)]'
                  : 'border-[var(--accountable-border)] focus:border-[var(--accountable-accent)] focus:ring-1 focus:ring-[var(--accountable-accent)]',
              ),
            errorMessage: () => cn(SHARED_STYLES.fontMono, 'mt-2 text-sm', SHARED_STYLES.textError),
            resolvingStatus: () => cn(SHARED_STYLES.fontMono, 'text-[var(--accountable-alert)]'),
            resolvedAddress: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textAccent),
          },
        },

        legalDisclaimer: {
          classNames: {
            container: () => cn('border-t border-[var(--accountable-border)] pt-3 mt-2'),
            text: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-xs text-center'),
            termsLink: () => 'underline transition-colors hover:text-[var(--accountable-accent)]',
            privacyLink: () => 'underline transition-colors hover:text-[var(--accountable-accent)]',
            separator: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-xs text-center'),
          },
        },

        // Connecting Screen
        connecting: {
          classNames: {
            container: () => 'flex flex-col gap-4 items-center justify-center w-full',
            statusContainer: ({ statusData }) =>
              cn(
                'relative flex items-center justify-center',
                'min-w-[110px] min-h-[110px] md:min-w-[150px] md:min-h-[150px]',
                'border-2 rounded-full p-4 md:p-6',
                'transition-all duration-300 ease-in-out',
                statusData.state === 'error'
                  ? 'border-[var(--accountable-error)] bg-[var(--accountable-error)]/5'
                  : statusData.state === 'success'
                    ? 'border-[var(--accountable-accent)] bg-[var(--accountable-accent)]/5'
                    : 'border-[var(--accountable-border)] bg-[var(--accountable-background-2)]',
              ),
            spinner: () =>
              cn(
                'absolute animate-spin rounded-full -inset-[2px]',
                'w-[calc(100%_+_4px)] h-[calc(100%_+_4px)]',
                'border-2 border-[var(--accountable-accent)] border-t-transparent',
              ),
            statusIcon: ({ statusData }) =>
              cn(
                'absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center',
                statusData.state === 'success' ? 'bg-[var(--accountable-accent)]' : 'bg-[var(--accountable-error)]',
              ),
            walletIconContainer: () =>
              '[&_svg]:w-[60px]! [&_svg]:h-[auto]! md:[&_svg]:w-[80px]! [&_img]:w-[60px]! [&_img]:h-[auto]! md:[&_img]:w-[80px]! leading-[0]',
            messageContainer: () => 'text-center space-y-2 max-w-md',
            statusMessage: ({ statusData }) =>
              cn(
                SHARED_STYLES.fontMonoMedium,
                'text-lg transition-colors duration-300',
                statusData.state === 'error'
                  ? SHARED_STYLES.textError
                  : statusData.state === 'success'
                    ? SHARED_STYLES.textAccent
                    : SHARED_STYLES.textForeground,
              ),
            errorMessage: () =>
              cn(SHARED_STYLES.fontMono, 'text-sm text-center leading-relaxed', SHARED_STYLES.textError),
            errorDetails: () => 'mt-3 text-left',
            loadingPlaceholder: () =>
              cn(
                'flex flex-col gap-4 items-center justify-center w-full py-8',
                '[&>div]:bg-[var(--accountable-background-2)]',
              ),
          },
          walletIcon: {
            classNames: {
              container: ({ isLoading, showLoading }) =>
                cn({
                  'animate-pulse bg-[var(--accountable-background-2)]': showLoading && isLoading,
                }),
              loadingOverlay: () => 'bg-[var(--accountable-accent-dark)]',
            },
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
    toastCloseButton: {
      className: MODAL_STYLES.closeButton,
    },
    toastErrorCustomization: {
      classNames: {
        container: () =>
          cn(
            SHARED_STYLES.fontMono,
            'p-4 rounded-md w-full',
            SHARED_STYLES.bgBase,
            'border border-[var(--accountable-error)]',
          ),
        title: () => cn(SHARED_STYLES.fontMonoMedium, 'text-sm truncate', SHARED_STYLES.textError),
        description: () => cn(SHARED_STYLES.fontMono, 'mt-1 text-xs break-words opacity-80', SHARED_STYLES.textError),
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
        icon: ({ isCopied }) => cn('w-4 h-4 transition-colors', isCopied && SHARED_STYLES.textAccent),
      },
    },
  },
};
