import { NovaConnectProviderCustomization } from '@tuwaio/nova-connect';
import { ConnectCardCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

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
            input: () =>
              cn(
                SHARED_STYLES.fontMono,
                SHARED_STYLES.bgBase,
                SHARED_STYLES.borderDefault,
                SHARED_STYLES.textForeground,
                'w-full mt-2 px-4 py-3 rounded-[4px] text-sm',
                'placeholder:text-[var(--accountable-disabled)]',
                'focus:border-[var(--accountable-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accountable-accent)]',
              ),
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
      },
    },
  },
};
