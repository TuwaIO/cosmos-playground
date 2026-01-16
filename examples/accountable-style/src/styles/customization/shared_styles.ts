import { cn } from '@tuwaio/nova-core';

export const SHARED_STYLES = {
  // Base button styles
  baseButton:
    'cursor-pointer inline-flex items-center justify-center gap-2 min-h-[48px] rounded-[4px] transition-all duration-200',
  baseFocus: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accountable-accent)]',

  // Font
  fontMono: 'font-[DM_Mono] font-light',
  fontMonoMedium: 'font-[DM_Mono] font-medium',

  // Background
  bgBase: 'bg-[var(--accountable-background-2)]',
  bgAccent: 'bg-[var(--accountable-accent)]',
  bgAccentDark: 'bg-[var(--accountable-accent-dark)]',

  // Text
  textForeground: 'text-[var(--accountable-foreground)]',
  textAccentDark: 'text-[var(--accountable-accent-dark)]',
  textAccent: 'text-[var(--accountable-accent)]',
  textPrimary: 'text-[var(--accountable-primary)]',
  textSecondary: 'text-[var(--accountable-secondary)]',

  // Border
  borderDefault: 'border border-[var(--accountable-border)]',
  borderAccent: 'border-[var(--accountable-accent)]',

  // Common interactive states
  itemInteractive:
    'transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-[var(--accountable-background-2)]',

  // Scroll button
  scrollButton: 'cursor-pointer flex items-center justify-center h-6 w-full',

  // Card styles
  cardBase: 'rounded-[4px] border border-[var(--accountable-border)] bg-[var(--accountable-background-2)]',
  cardHover: 'hover:bg-[var(--accountable-accent-dark)] hover:border-[var(--accountable-accent)]',
};

// Shared item styles generator
export const getItemStyles = (isActive: boolean) =>
  cn(
    SHARED_STYLES.fontMono,
    'text-sm',
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

// ═══════════════════════════════════════════════════════════════════════════════
// CONNECT CARD CUSTOMIZATION - Wallet item cards
// Only override colors and fonts, preserving original component behavior
// ═══════════════════════════════════════════════════════════════════════════════

export const getConnectCardCustomization = () => {
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
  };
};
