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

    chainSelector: chain_list_customization,
  },
};
