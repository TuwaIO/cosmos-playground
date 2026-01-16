import { ConnectedModalCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { chain_list_customization } from './chain_list';
import { SHARED_STYLES } from './shared_styles';

export const connected_modal_customization: ConnectedModalCustomization = {
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
    dialogTitle: () => cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary),

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
};
