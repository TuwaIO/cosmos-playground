import { cn } from '@tuwaio/nova-core';

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED STYLES - Accountable Theme
// All brand-specific values are CSS variables for easy brand switching
// ═══════════════════════════════════════════════════════════════════════════════

export const SHARED_STYLES = {
  // ─────────────────────────────────────────────────────────────────────────────
  // Typography
  // ─────────────────────────────────────────────────────────────────────────────
  fontMono: 'font-[DM_Mono] font-light',
  fontMonoMedium: 'font-[DM_Mono] font-medium',

  // ─────────────────────────────────────────────────────────────────────────────
  // Colors - Text
  // ─────────────────────────────────────────────────────────────────────────────
  textForeground: 'text-[var(--accountable-foreground)]',
  textPrimary: 'text-[var(--accountable-primary)]',
  textSecondary: 'text-[var(--accountable-secondary)]',
  textAccent: 'text-[var(--accountable-accent)]',
  textAccentDark: 'text-[var(--accountable-accent-dark)]',
  textError: 'text-[var(--accountable-error)]',

  // ─────────────────────────────────────────────────────────────────────────────
  // Colors - Background
  // ─────────────────────────────────────────────────────────────────────────────
  bgBase: 'bg-[var(--accountable-background-2)]',
  bgDark: 'bg-[var(--accountable-background)]',
  bgAccent: 'bg-[var(--accountable-accent)]',
  bgAccentDark: 'bg-[var(--accountable-accent-dark)]',
  bgCard: 'bg-[var(--accountable-background-2)]',

  // ─────────────────────────────────────────────────────────────────────────────
  // Borders
  // ─────────────────────────────────────────────────────────────────────────────
  borderDefault: 'border border-[var(--accountable-border)]',
  borderAccent: 'border-[var(--accountable-accent)]',
  borderError: 'border-[var(--accountable-error)]',

  // ─────────────────────────────────────────────────────────────────────────────
  // Focus States
  // ─────────────────────────────────────────────────────────────────────────────
  baseFocus: 'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accountable-accent)]',
  focusWithOffset: (offset: string) =>
    `focus:outline-none focus:ring-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-2 focus:ring-offset-[${offset}]`,

  // ─────────────────────────────────────────────────────────────────────────────
  // Interactive States
  // ─────────────────────────────────────────────────────────────────────────────
  itemInteractive:
    'transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accountable-accent)] focus:ring-offset-[var(--accountable-background-2)]',
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// BUTTON STYLES - Reusable button patterns
// ═══════════════════════════════════════════════════════════════════════════════

const BUTTON_BASE =
  'cursor-pointer inline-flex items-center justify-center gap-2 rounded-[4px] transition-all duration-200';

export const BUTTON_STYLES = {
  // Base layout (no colors)
  base: cn(BUTTON_BASE, 'min-h-[44px]'),
  baseSmall: cn(BUTTON_BASE, 'min-h-0'),

  // Primary - accent background
  primary: cn(
    BUTTON_BASE,
    SHARED_STYLES.fontMonoMedium,
    'px-2 py-1 text-sm',
    SHARED_STYLES.bgAccent,
    SHARED_STYLES.textAccentDark,
    'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-primary)]',
    SHARED_STYLES.baseFocus,
  ),

  // Secondary - outlined
  secondary: cn(
    BUTTON_BASE,
    SHARED_STYLES.fontMono,
    'px-4 py-2 text-sm',
    'bg-[var(--accountable-background-3)]',
    SHARED_STYLES.textForeground,
    SHARED_STYLES.borderDefault,
    'hover:bg-[var(--accountable-accent-dark)] hover:text-[var(--accountable-primary)]',
  ),

  // Ghost - transparent background
  ghost: cn(
    BUTTON_BASE,
    SHARED_STYLES.fontMono,
    SHARED_STYLES.bgBase,
    SHARED_STYLES.borderDefault,
    SHARED_STYLES.textForeground,
    'hover:bg-[var(--accountable-border)]',
    SHARED_STYLES.baseFocus,
  ),

  // Link - text only
  link: cn(
    SHARED_STYLES.fontMono,
    'cursor-pointer text-sm transition-opacity',
    SHARED_STYLES.textAccent,
    'hover:opacity-80',
  ),

  // Danger - error action
  danger: cn(
    BUTTON_BASE,
    SHARED_STYLES.fontMono,
    SHARED_STYLES.borderDefault,
    SHARED_STYLES.textForeground,
    SHARED_STYLES.bgBase,
    'hover:bg-[var(--accountable-error)]/10',
    'hover:border-[var(--accountable-error)]',
    'hover:text-[var(--accountable-error)]',
    SHARED_STYLES.baseFocus,
  ),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL STYLES - Dialog/Modal patterns
// ═══════════════════════════════════════════════════════════════════════════════

export const MODAL_STYLES = {
  // Container
  container: SHARED_STYLES.bgBase,

  // Header with border
  header: cn(SHARED_STYLES.bgBase, 'border-b border-[var(--accountable-border)]'),

  // Header title
  headerTitle: cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary),

  // Close/back button
  closeButton: cn(
    'cursor-pointer rounded-[4px] p-1 transition-colors',
    SHARED_STYLES.textSecondary,
    'hover:bg-[var(--accountable-accent-dark)]',
    'hover:text-[var(--accountable-primary)]',
    SHARED_STYLES.baseFocus,
    `[&_svg]:text-[var(--accountable-secondary)]`,
  ),

  // Close button with icon styling
  closeButtonWithIcon: cn(
    'cursor-pointer rounded-[4px] p-1 transition-colors',
    'hover:bg-[var(--accountable-accent-dark)]',
    '[&_svg]:text-[var(--accountable-primary)]',
  ),

  // Footer with border
  footer: cn(SHARED_STYLES.bgBase, 'border-t border-[var(--accountable-border)]'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ICON BUTTON STYLES - Small interactive icons (copy, close, etc.)
// ═══════════════════════════════════════════════════════════════════════════════

export const ICON_BUTTON_STYLES = {
  // Default icon button
  default: cn(
    'cursor-pointer rounded-[4px] p-1 transition-colors',
    SHARED_STYLES.textSecondary,
    'hover:text-[var(--accountable-accent)] hover:bg-[var(--accountable-accent-dark)]',
  ),

  // Danger icon button (delete, disconnect)
  danger: cn(
    'cursor-pointer rounded-[4px] p-1.5 transition-colors',
    SHARED_STYLES.textSecondary,
    'hover:bg-[var(--accountable-error)]/10',
    'hover:text-[var(--accountable-error)]',
  ),

  // Copy button
  copy: cn(SHARED_STYLES.textSecondary, 'hover:text-[var(--accountable-accent)]', 'transition-colors'),

  // Copy button with error hover
  copyError: cn(SHARED_STYLES.textSecondary, 'hover:text-[var(--accountable-error)]', 'transition-colors'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL BUTTON STYLES - For scrollable lists
// ═══════════════════════════════════════════════════════════════════════════════

export const SCROLL_BUTTON_STYLES = {
  button: cn(
    'cursor-pointer flex items-center justify-center h-6 w-full',
    SHARED_STYLES.bgAccentDark,
    'hover:bg-[var(--accountable-border)]',
  ),
  buttonTop: cn(
    'cursor-pointer flex items-center justify-center h-6 w-full rounded-t-[4px]',
    SHARED_STYLES.bgAccentDark,
    'hover:bg-[var(--accountable-border)]',
  ),
  buttonBottom: cn(
    'cursor-pointer flex items-center justify-center h-6 w-full rounded-b-[4px]',
    SHARED_STYLES.bgAccentDark,
    'hover:bg-[var(--accountable-border)]',
  ),
  icon: SHARED_STYLES.textAccent,
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// CARD STYLES - Container patterns
// ═══════════════════════════════════════════════════════════════════════════════

export const CARD_STYLES = {
  // Base card
  base: cn('rounded-[4px]', SHARED_STYLES.borderDefault, SHARED_STYLES.bgBase),

  // Card with hover
  interactive: cn(
    'rounded-[4px]',
    SHARED_STYLES.borderDefault,
    SHARED_STYLES.bgBase,
    'hover:bg-[var(--accountable-accent-dark)]',
    'hover:border-[var(--accountable-accent)]',
    SHARED_STYLES.baseFocus,
  ),

  // Info block card
  infoBlock: cn('rounded-[4px]', SHARED_STYLES.borderDefault, 'bg-[var(--accountable-background-3)]'),

  // Error card
  error: cn('rounded-[4px] border border-[var(--accountable-error)]/30', 'bg-[var(--accountable-background-3)]'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS STYLES - State-based patterns
// ═══════════════════════════════════════════════════════════════════════════════

export const STATUS_STYLES = {
  // Status colors for icons/indicators
  icon: {
    success: 'text-[var(--accountable-accent)]',
    error: 'text-[var(--accountable-error)]',
    warning: 'text-[var(--accountable-alert)]',
    pending: 'text-[var(--accountable-accent)] animate-spin',
    initializing: 'text-[var(--accountable-alert)] animate-pulse',
    disabled: 'text-[var(--accountable-disabled)]',
  },

  // Progress indicator colors
  progress: {
    completed: {
      line: 'bg-[var(--accountable-accent)]',
      circle: 'bg-[var(--accountable-accent)] border-[var(--accountable-accent)]',
    },
    active: {
      line: 'bg-[var(--accountable-alert)]',
      circle: 'border-[var(--accountable-alert)] bg-transparent',
    },
    inactive: {
      line: 'bg-[var(--accountable-border)]',
      circle: 'border-[var(--accountable-border)] bg-transparent',
    },
    error: {
      line: 'bg-[var(--accountable-error)]',
      circle: 'bg-[var(--accountable-error)] border-[var(--accountable-error)]',
    },
    replaced: {
      line: 'bg-[var(--accountable-disabled)]',
      circle: 'bg-[var(--accountable-disabled)] border-[var(--accountable-disabled)]',
    },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// HASH LINK STYLES - Transaction hash display
// ═══════════════════════════════════════════════════════════════════════════════

export const HASH_LINK_STYLES = {
  label: cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textForeground),
  link: cn(SHARED_STYLES.textAccent, 'hover:underline transition-colors'),
  copyButton: ICON_BUTTON_STYLES.copy,
} as const;
