import { ChainSelectorCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { SHARED_STYLES } from './shared_styles';

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
        'bg-[var(--accountable-background-2)] border-[var(--accountable-border)] text-[var(--accountable-foreground)] [&_h2]:text-[var(--accountable-primary)]',
        `[&_h2]:font-[DM_Mono] [&_h2]:font-medium`,
      ),
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
          cn('flex items-center justify-between px-4 py-2 min-h-[48px] gap-2 rounded-[6px]', getItemStyles(isActive)),
      },
    },
  },
};
