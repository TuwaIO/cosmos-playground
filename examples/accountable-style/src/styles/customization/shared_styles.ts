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
