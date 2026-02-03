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
        header: () => cn(SHARED_STYLES.bgBase, 'border-[var(--tuwa-border-primary)]'),
        title: () => cn(MODAL_STYLES.headerTitle, 'text-lg'),
        infoButton: () =>
          cn(
            'rounded-[4px]',
            SHARED_STYLES.textSecondary,
            'hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-accent)]',
          ),
        closeButton: () => MODAL_STYLES.closeButton,
        mainContent: () => SHARED_STYLES.bgBase,
        footer: () => MODAL_STYLES.footer,
        backButton: () => BUTTON_STYLES.ghost,
        actionButton: () =>
          cn(
            BUTTON_STYLES.primary,
            'min-h-[40px]',
            'hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]',
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

        // NetworkSelections - "Select one of available network" screen
        networkSelections: {
          classNames: {
            container: () => cn('flex flex-col gap-4', SHARED_STYLES.textForeground),
            title: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textForeground, 'mb-2'),
            networkList: ({ selectionsData }) =>
              cn(
                'flex NovaCustomScroll',
                selectionsData.isTouch
                  ? 'flex-row overflow-x-auto gap-3 pb-4 px-1'
                  : 'flex-col max-h-[310px] overflow-y-auto gap-2',
              ),
            networkItem: ({ selectionsData }) => cn({ 'flex-shrink-0': selectionsData.isTouch }),
            networkIcon: () => 'leading-[0]',
            errorContainer: () =>
              cn(
                'flex flex-col items-center justify-center p-8 text-center rounded-[4px]',
                SHARED_STYLES.borderDefault,
                SHARED_STYLES.bgBase,
                SHARED_STYLES.textSecondary,
              ),
            errorIcon: () => cn(SHARED_STYLES.textAccent, 'mb-3'),
            errorTitle: () => cn(SHARED_STYLES.fontMonoMedium, 'text-lg mb-1', SHARED_STYLES.textForeground),
            errorMessage: () => cn(SHARED_STYLES.fontMono, 'text-sm'),
          },
          connectCard: connect_card_customization,
          disclaimer: {
            classNames: {
              container: () => cn('p-2 rounded-[4px] flex flex-col gap-2 sm:p-4 sm:gap-4', SHARED_STYLES.borderDefault),
              title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textForeground, 'text-md'),
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
                '[&>div:first-child]:bg-[var(--tuwa-border-primary)]',
                '[&>div:last-child]:bg-[var(--tuwa-bg-secondary)]',
              ),
            indicator: ({ isActive }) =>
              cn(
                'cursor-pointer h-2 rounded-full transition-all duration-300',
                SHARED_STYLES.baseFocus,
                'hover:bg-[var(--tuwa-text-accent)]',
                isActive ? 'bg-[var(--tuwa-text-accent)] w-6' : 'bg-[var(--tuwa-border-primary)] w-2',
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
                'placeholder:text-[var(--text-disabled)]',
                'border transition-colors duration-200 focus:outline-none',
                hasError
                  ? 'border-[var(--tuwa-error-icon)] focus:ring-1 focus:ring-[var(--tuwa-error-icon)]'
                  : 'border-[var(--tuwa-border-primary)] focus:border-[var(--tuwa-text-accent)] focus:ring-1 focus:ring-[var(--tuwa-text-accent)]',
              ),
            errorMessage: () => cn(SHARED_STYLES.fontMono, 'mt-2 text-sm', SHARED_STYLES.textError),
            resolvingStatus: () => cn(SHARED_STYLES.fontMono, 'text-[var(--tuwa-pending-icon)]'),
            resolvedAddress: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textAccent),
          },
        },

        legalDisclaimer: {
          classNames: {
            container: () => cn('border-t border-[var(--tuwa-border-primary)] pt-3 mt-2'),
            text: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-xs text-center'),
            termsLink: () => 'underline transition-colors hover:text-[var(--tuwa-text-accent)]',
            privacyLink: () => 'underline transition-colors hover:text-[var(--tuwa-text-accent)]',
            separator: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-xs text-center'),
          },
        },

        // Connecting Screen
        connecting: {
          classNames: {
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
            'border border-[var(--tuwa-error-icon)]',
          ),
        title: () => cn(SHARED_STYLES.fontMonoMedium, 'text-sm truncate', SHARED_STYLES.textError),
        description: () => cn(SHARED_STYLES.fontMono, 'mt-1 text-xs break-words opacity-80', SHARED_STYLES.textError),
        button: ({ isCopied }) =>
          cn(
            SHARED_STYLES.fontMono,
            'cursor-pointer mt-2 text-xs font-medium inline-flex items-center space-x-1.5',
            'rounded-md px-2 py-1 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-error-icon)] focus:ring-opacity-50',
            isCopied
              ? 'bg-[var(--tuwa-text-accent)] bg-opacity-10 text-[var(--tuwa-text-accent)]'
              : 'text-[var(--tuwa-error-icon)] hover:bg-[var(--tuwa-error-icon)] hover:bg-opacity-10',
          ),
        icon: ({ isCopied }) => cn('w-4 h-4 transition-colors', isCopied && SHARED_STYLES.textAccent),
      },
    },
  },
};
