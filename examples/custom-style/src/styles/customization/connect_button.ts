import { ConnectButtonCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { chain_list_customization } from './chain_list';
import { BUTTON_STYLES, SHARED_STYLES } from './shared_styles';

export const connect_button_customization: ConnectButtonCustomization = {
  classNames: {
    container: () => 'flex items-center gap-3',

    button: ({ buttonData }) => {
      const { isConnected } = buttonData;
      return cn(
        BUTTON_STYLES.base,
        'px-4 py-2 text-md',
        SHARED_STYLES.fontMono,
        SHARED_STYLES.focusWithOffset('var(--tuwa-bg-primary)'),
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isConnected
          ? cn(
              SHARED_STYLES.bgBase,
              SHARED_STYLES.textForeground,
              SHARED_STYLES.borderDefault,
              'hover:bg-[var(--tuwa-border-primary)]',
            )
          : cn(SHARED_STYLES.bgAccent, SHARED_STYLES.textAccentDark, 'hover:opacity-90'),
      );
    },
  },

  childComponents: {
    waitForConnectionContent: {
      classNames: { text: () => 'font-light' },
    },

    connectedContent: {
      childCustomizations: {
        walletAvatar: {
          classNames: {
            container: () =>
              'h-6 w-6 flex-shrink-0 rounded-full overflow-hidden ring-1 ring-[var(--tuwa-text-accent)] focus-within:ring-2 relative z-2',
          },
        },
        // StatusIcon customization for transaction states
        statusIcon: {
          succeed: {
            classNames: {
              container: () =>
                cn(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-accent)]',
                  'ring-1 ring-[var(--tuwa-text-accent)]',
                ),
            },
          },
          failed: {
            classNames: {
              container: () =>
                cn(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  'bg-[rgba(224,36,36,0.15)] text-[var(--tuwa-error-icon)]',
                  'ring-1 ring-[var(--tuwa-error-icon)]',
                ),
            },
          },
          replaced: {
            classNames: {
              container: () =>
                cn(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  'bg-[var(--tuwa-bg-primary)] text-[var(--tuwa-text-secondary)]',
                  'ring-1 ring-[var(--tuwa-border-primary)]',
                ),
            },
          },
        },
      },
      classNames: {
        balanceContainer: () => 'text-[var(--tuwa-text-tertiary)]',
        balanceDivider: () => SHARED_STYLES.bgAccent,
        mainContent: () => '[&_span]:text-[var(--tuwa-text-primary)] [&_svg]:text-[var(--tuwa-text-accent)]',
      },
    },

    chainSelector: chain_list_customization,
  },
};
