import { ConnectButtonCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { getItemStyles, SHARED_STYLES } from './shared_styles';

export const connect_button_customization: ConnectButtonCustomization = {
  classNames: {
    container: () => 'flex items-center gap-3',

    button: ({ buttonData }) => {
      const { isConnected } = buttonData;
      return cn(
        SHARED_STYLES.baseButton,
        'px-4 py-2',
        'text-md',
        SHARED_STYLES.fontMono,
        'focus:ring-offset-[var(--accountable-background)]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isConnected
          ? cn(
              SHARED_STYLES.bgBase,
              SHARED_STYLES.textForeground,
              SHARED_STYLES.borderDefault,
              'hover:bg-[var(--accountable-border)]',
              SHARED_STYLES.baseFocus,
            )
          : cn(SHARED_STYLES.bgAccent, SHARED_STYLES.textAccentDark, 'hover:opacity-90', SHARED_STYLES.baseFocus),
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
              'h-6 w-6 flex-shrink-0 rounded-full overflow-hidden ring-1 ring-[var(--accountable-accent)] focus-within:ring-2 relative z-2',
          },
        },
      },
      classNames: {
        balanceContainer: () => 'text-[var(--accountable-tertiary)]',
        balanceDivider: () => SHARED_STYLES.bgAccent,
        mainContent: () => '[&_span]:text-[var(--accountable-primary)] [&_svg]:text-[var(--accountable-accent)]',
      },
    },

    chainSelector: {
      classNames: {
        dialogInnerContainer: () => SHARED_STYLES.bgBase,
        dialogHeader: () =>
          'bg-[var(--accountable-background-2)] border-[var(--accountable-border)] text-[var(--accountable-foreground)] [&_h2]:text-[var(--accountable-primary)]',
      },

      dialogHeader: {
        closeButton: {
          className:
            'cursor-pointer rounded-[4px] p-1 transition-colors hover:bg-[var(--accountable-accent-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-2 [&_svg]:text-[var(--accountable-primary)]',
        },
      },

      triggerButton: {
        classNames: {
          button: ({ isOpen }) =>
            cn(
              SHARED_STYLES.baseButton,
              SHARED_STYLES.bgBase,
              SHARED_STYLES.borderDefault,
              SHARED_STYLES.textForeground,
              SHARED_STYLES.fontMono,
              'text-md',
              'focus:ring-offset-[var(--accountable-background)]',
              isOpen
                ? cn(SHARED_STYLES.borderAccent, 'ring-1 ring-[var(--accountable-accent)]')
                : 'hover:bg-[var(--accountable-border)]',
              SHARED_STYLES.baseFocus,
            ),
          arrowWrapper: () => '[&_svg]:text-[var(--accountable-accent)]',
        },
      },

      selectContent: {
        contentClassName: SHARED_STYLES.bgBase,
        topButtonCustomization: {
          classNames: {
            button: () =>
              cn(
                SHARED_STYLES.scrollButton,
                SHARED_STYLES.bgAccentDark,
                'rounded-t-[4px]',
                'hover:bg-[var(--accountable-border)]',
              ),
            icon: () => SHARED_STYLES.textAccent,
          },
        },
        bottomButtonCustomization: {
          classNames: {
            button: () =>
              cn(
                SHARED_STYLES.scrollButton,
                SHARED_STYLES.bgAccentDark,
                'rounded-b-[4px]',
                'hover:bg-[var(--accountable-border)]',
              ),
            icon: () => SHARED_STYLES.textAccent,
          },
        },
      },

      chainListRenderer: {
        classNames: {
          container: () => cn(SHARED_STYLES.bgBase, 'rounded-[6px]'),
          item: ({ isActive }) => getItemStyles(isActive),
        },
      },

      scrollableChainList: {
        buttons: {
          topButton: {
            classNames: {
              button: () =>
                cn(
                  SHARED_STYLES.scrollButton,
                  SHARED_STYLES.bgAccentDark,
                  'rounded-t-[4px]',
                  'hover:bg-[var(--accountable-border)]',
                ),
              icon: () => SHARED_STYLES.textAccent,
            },
          },
          bottomButton: {
            classNames: {
              button: () =>
                cn(
                  SHARED_STYLES.scrollButton,
                  SHARED_STYLES.bgAccentDark,
                  'rounded-b-[4px]',
                  'hover:bg-[var(--accountable-border)]',
                ),
              icon: () => SHARED_STYLES.textAccent,
            },
          },
        },
        chainListRenderer: {
          classNames: {
            activeIndicatorWrapper: () => 'text-[var(--accountable-background-2)]',
            item: ({ isActive }) =>
              cn(
                'flex items-center justify-between px-4 py-2 min-h-[48px] gap-2 rounded-[6px]',
                getItemStyles(isActive),
              ),
          },
        },
      },
    },
  },
};
