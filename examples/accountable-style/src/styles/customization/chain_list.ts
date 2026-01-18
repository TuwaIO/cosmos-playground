import { ChainSelectorCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { BUTTON_STYLES, SCROLL_BUTTON_STYLES, SHARED_STYLES } from './shared_styles';

const getItemStyles = (isActive: boolean) =>
  cn(
    SHARED_STYLES.fontMono,
    'text-sm cursor-pointer transition-colors duration-200',
    SHARED_STYLES.itemInteractive,
    isActive
      ? cn(
          SHARED_STYLES.bgAccent,
          SHARED_STYLES.textAccentDark,
          SHARED_STYLES.fontMonoMedium,
          'focus:ring-[var(--accountable-accent)] focus:ring-offset-[var(--accountable-background-2)]',
          'focus:bg-[var(--accountable-accent)] focus:outline-none',
        )
      : cn(
          SHARED_STYLES.textForeground,
          'hover:bg-[var(--accountable-accent-dark)]',
          'active:bg-[var(--accountable-accent)]',
        ),
  );

export const chain_list_customization: ChainSelectorCustomization = {
  classNames: {
    dialogInnerContainer: () => SHARED_STYLES.bgBase,
    dialogHeader: () =>
      cn(
        SHARED_STYLES.bgBase,
        'border-[var(--accountable-border)]',
        SHARED_STYLES.textForeground,
        '[&_h2]:text-[var(--accountable-primary)] [&_h2]:font-[DM_Mono] [&_h2]:font-medium',
      ),
  },

  dialogHeader: {
    closeButton: {
      className: cn(
        'cursor-pointer rounded-[4px] p-1 transition-colors',
        'hover:bg-[var(--accountable-accent-dark)]',
        SHARED_STYLES.baseFocus,
        '[&_svg]:text-[var(--accountable-primary)]',
      ),
    },
  },

  triggerButton: {
    classNames: {
      button: ({ isOpen }) =>
        cn(
          BUTTON_STYLES.ghost,
          'text-md',
          'focus:ring-offset-[var(--accountable-background)]',
          isOpen ? cn(SHARED_STYLES.borderAccent, 'ring-1 ring-[var(--accountable-accent)]') : '',
        ),
      arrowWrapper: () => '[&_svg]:text-[var(--accountable-accent)]',
    },
  },

  selectContent: {
    contentClassName: cn(SHARED_STYLES.bgBase, 'ring-[var(--accountable-border)]'),
    topButtonCustomization: {
      classNames: {
        button: () => SCROLL_BUTTON_STYLES.buttonTop,
        icon: () => SCROLL_BUTTON_STYLES.icon,
      },
    },
    bottomButtonCustomization: {
      classNames: {
        button: () => SCROLL_BUTTON_STYLES.buttonBottom,
        icon: () => SCROLL_BUTTON_STYLES.icon,
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
          button: () => SCROLL_BUTTON_STYLES.buttonTop,
          icon: () => SCROLL_BUTTON_STYLES.icon,
        },
      },
      bottomButton: {
        classNames: {
          button: () => SCROLL_BUTTON_STYLES.buttonBottom,
          icon: () => SCROLL_BUTTON_STYLES.icon,
        },
      },
    },
    chainListRenderer: {
      classNames: {
        activeIndicatorWrapper: () => 'text-[var(--accountable-background-2)]',
        item: ({ isActive }) =>
          cn('flex items-center justify-between px-4 py-2 min-h-[48px] gap-2 rounded-[6px]', getItemStyles(isActive)),
      },
    },
  },
};
