import { ConnectCardCustomization } from '@tuwaio/nova-connect/components';
import { cn } from '@tuwaio/nova-core';

import { SHARED_STYLES } from './shared_styles';

export const connect_card_customization: ConnectCardCustomization = {
  classNames: {
    // Card container - preserve original structure, override colors only
    container: ({ cardData }) =>
      cn(
        'group cursor-pointer p-4 rounded-xl transition-colors relative border disabled:opacity-50 disabled:cursor-not-allowed',
        'w-full h-auto flex items-center justify-between',
        {
          'w-[125px] h-[125px] p-2 flex flex-col items-center justify-center text-center': cardData.isTouch,
        },
        // Accountable theme colors
        'border-[var(--accountable-border)]',
        'bg-[var(--accountable-background-2)]',
        'hover:bg-[var(--accountable-accent-dark)]',
        'hover:border-[var(--accountable-accent)]',
        SHARED_STYLES.baseFocus,
      ),

    // Content wrapper - preserve original, override colors
    content: ({ cardData }) =>
      cn(
        'flex gap-3 transition duration-300 ease-in-out items-center',
        {
          'flex-col items-center gap-1': cardData.isTouch,
        },
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

    // Wallet title - preserve original, override font/colors
    title: () =>
      cn(
        SHARED_STYLES.fontMono,
        'text-[var(--accountable-foreground)]',
        'group-hover:text-[var(--accountable-accent)]',
        'transition-colors duration-200',
      ),

    // Subtitle - override font/colors
    subtitle: ({ cardData }) =>
      cn(SHARED_STYLES.fontMono, 'text-[var(--accountable-secondary)] text-sm', {
        'text-[10px]': cardData.isTouch,
      }),

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
