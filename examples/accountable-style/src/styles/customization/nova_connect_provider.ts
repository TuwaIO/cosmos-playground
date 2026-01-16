import { NovaConnectProviderCustomization } from '@tuwaio/nova-connect';
import { cn } from '@tuwaio/nova-core';

import { getConnectCardCustomization, SHARED_STYLES } from './shared_styles';

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
        // Network tabs (EVM, Solana, etc.)
        networkTabs: {
          classNames: {
            container: () => cn('flex gap-2 p-1 rounded-[4px]', SHARED_STYLES.bgAccentDark),
            tab: ({ isSelected }) =>
              cn(
                SHARED_STYLES.fontMono,
                'px-3 py-1.5 rounded-[4px] text-sm cursor-pointer',
                'transition-all duration-200',
                isSelected
                  ? cn(SHARED_STYLES.bgAccent, SHARED_STYLES.textAccentDark, SHARED_STYLES.fontMonoMedium)
                  : cn(SHARED_STYLES.textSecondary, 'hover:text-[var(--accountable-foreground)]'),
              ),
          },
        },

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
            title: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary, 'text-base'),
            description: () => cn(SHARED_STYLES.fontMono, SHARED_STYLES.textSecondary, 'text-sm leading-relaxed'),
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
