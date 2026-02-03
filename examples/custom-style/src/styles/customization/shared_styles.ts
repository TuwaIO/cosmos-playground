import { cn } from '@tuwaio/nova-core';

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED STYLES - Custom Theme
// All values use TUWA CSS variables for easy theme switching
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
  textForeground: 'text-[var(--tuwa-text-primary)]',
  textPrimary: 'text-[var(--tuwa-text-primary)]',
  textSecondary: 'text-[var(--tuwa-text-secondary)]',
  textAccent: 'text-[var(--tuwa-text-accent)]',
  textAccentDark: 'text-[var(--tuwa-text-on-accent)]',
  textError: 'text-[var(--tuwa-error-icon)]',

  // ─────────────────────────────────────────────────────────────────────────────
  // Colors - Background
  // ─────────────────────────────────────────────────────────────────────────────
  bgBase: 'bg-[var(--tuwa-bg-secondary)]',
  bgDark: 'bg-[var(--tuwa-bg-primary)]',
  bgAccent: 'bg-[var(--tuwa-text-accent)]',
  bgAccentDark: 'bg-[var(--tuwa-bg-muted)]',
  bgCard: 'bg-[var(--tuwa-bg-secondary)]',

  // ─────────────────────────────────────────────────────────────────────────────
  // Borders
  // ─────────────────────────────────────────────────────────────────────────────
  borderDefault: 'border border-[var(--tuwa-border-primary)]',
  borderAccent: 'border-[var(--tuwa-text-accent)]',
  borderError: 'border-[var(--tuwa-error-icon)]',

  // ─────────────────────────────────────────────────────────────────────────────
  // Focus States
  // ─────────────────────────────────────────────────────────────────────────────
  baseFocus:
    'focus:outline-none focus:ring-[var(--tuwa-ring-width)] focus:ring-offset-[var(--tuwa-ring-width)] focus:ring-[var(--tuwa-text-accent)] focus:ring-offset-[var(--tuwa-border-secondary)]',
  focusWithOffset: (offset: string) =>
    `focus:outline-none focus:ring-[var(--tuwa-ring-width)] focus:ring-[var(--tuwa-text-accent)] focus:ring-offset-[var(--tuwa-ring-width)] focus:ring-offset-[${offset}]`,

  // Focus-visible variant for buttons
  focusVisible:
    'focus-visible:outline-none focus-visible:ring-[var(--tuwa-ring-width)] focus-visible:ring-offset-[var(--tuwa-ring-width)] focus-visible:ring-[var(--tuwa-text-accent)] focus-visible:ring-offset-[var(--tuwa-border-secondary)]',

  // ─────────────────────────────────────────────────────────────────────────────
  // Interactive States
  // ─────────────────────────────────────────────────────────────────────────────
  itemInteractive:
    'transition-all duration-200 ease-out focus:outline-none focus:ring-[var(--tuwa-ring-width)] focus:ring-offset-[var(--tuwa-ring-width)] focus:ring-[var(--tuwa-text-accent)] focus:ring-offset-[var(--tuwa-border-secondary)]',
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
    'hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]',
    SHARED_STYLES.baseFocus,
  ),

  // Secondary - outlined
  secondary: cn(
    BUTTON_BASE,
    SHARED_STYLES.fontMono,
    'px-4 py-2 text-sm',
    'bg-[var(--tuwa-bg-muted)]',
    SHARED_STYLES.textForeground,
    SHARED_STYLES.borderDefault,
    'hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]',
  ),

  // Ghost - transparent background
  ghost: cn(
    BUTTON_BASE,
    SHARED_STYLES.fontMono,
    SHARED_STYLES.bgBase,
    SHARED_STYLES.borderDefault,
    SHARED_STYLES.textForeground,
    'hover:bg-[var(--tuwa-border-primary)]',
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
    'hover:bg-[var(--tuwa-error-icon)]/10',
    'hover:border-[var(--tuwa-error-icon)]',
    'hover:text-[var(--tuwa-error-icon)]',
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
  header: cn(SHARED_STYLES.bgBase, 'border-b border-[var(--tuwa-border-primary)]'),

  // Header title
  headerTitle: cn(SHARED_STYLES.fontMonoMedium, SHARED_STYLES.textPrimary),

  // Close/back button
  closeButton: cn(
    'cursor-pointer rounded-[4px] p-1 transition-colors',
    SHARED_STYLES.textSecondary,
    'hover:bg-[var(--tuwa-bg-muted)]',
    'hover:text-[var(--tuwa-text-primary)]',
    SHARED_STYLES.baseFocus,
    `[&_svg]:text-[var(--tuwa-text-secondary)]`,
  ),

  // Close button with icon styling
  closeButtonWithIcon: cn(
    'cursor-pointer rounded-[4px] p-1 transition-colors',
    'hover:bg-[var(--tuwa-bg-muted)]',
    '[&_svg]:text-[var(--tuwa-text-primary)]',
  ),

  // Footer with border
  footer: cn(SHARED_STYLES.bgBase, 'border-t border-[var(--tuwa-border-primary)]'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// ICON BUTTON STYLES - Small interactive icons (copy, close, etc.)
// ═══════════════════════════════════════════════════════════════════════════════

export const ICON_BUTTON_STYLES = {
  // Default icon button
  default: cn(
    'cursor-pointer rounded-[4px] p-1 transition-colors',
    SHARED_STYLES.textSecondary,
    'hover:text-[var(--tuwa-text-accent)] hover:bg-[var(--tuwa-bg-muted)]',
  ),

  // Danger icon button (delete, disconnect)
  danger: cn(
    'cursor-pointer rounded-[4px] p-1.5 transition-colors',
    SHARED_STYLES.textSecondary,
    'hover:bg-[var(--tuwa-error-icon)]/10',
    'hover:text-[var(--tuwa-error-icon)]',
  ),

  // Copy button
  copy: cn(SHARED_STYLES.textSecondary, 'hover:text-[var(--tuwa-text-accent)]', 'transition-colors'),

  // Copy button with error hover
  copyError: cn(SHARED_STYLES.textSecondary, 'hover:text-[var(--tuwa-error-icon)]', 'transition-colors'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// SCROLL BUTTON STYLES - For scrollable lists
// ═══════════════════════════════════════════════════════════════════════════════

export const SCROLL_BUTTON_STYLES = {
  button: cn(
    'cursor-pointer flex items-center justify-center h-6 w-full',
    SHARED_STYLES.bgAccentDark,
    'hover:bg-[var(--tuwa-border-primary)]',
  ),
  buttonTop: cn(
    'cursor-pointer flex items-center justify-center h-6 w-full rounded-t-[4px]',
    SHARED_STYLES.bgAccentDark,
    'hover:bg-[var(--tuwa-border-primary)]',
  ),
  buttonBottom: cn(
    'cursor-pointer flex items-center justify-center h-6 w-full rounded-b-[4px]',
    SHARED_STYLES.bgAccentDark,
    'hover:bg-[var(--tuwa-border-primary)]',
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
    'hover:bg-[var(--tuwa-bg-muted)]',
    'hover:border-[var(--tuwa-text-accent)]',
    SHARED_STYLES.baseFocus,
  ),

  // Info block card
  infoBlock: cn('rounded-[4px]', SHARED_STYLES.borderDefault, 'bg-[var(--tuwa-bg-muted)]'),

  // Error card
  error: cn('rounded-[4px] border border-[var(--tuwa-error-icon)]/30', 'bg-[var(--tuwa-bg-muted)]'),
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS STYLES - State-based patterns
// ═══════════════════════════════════════════════════════════════════════════════

export const STATUS_STYLES = {
  // Status colors for icons/indicators
  icon: {
    success: 'text-[var(--tuwa-text-accent)]',
    error: 'text-[var(--tuwa-error-icon)]',
    warning: 'text-[var(--tuwa-pending-icon)]',
    pending: 'text-[var(--tuwa-text-accent)] animate-spin',
    initializing: 'text-[var(--tuwa-pending-icon)] animate-pulse',
    disabled: 'text-[var(--text-disabled)]',
  },

  // Progress indicator colors
  progress: {
    completed: {
      line: 'bg-[var(--tuwa-text-accent)]',
      circle: 'bg-[var(--tuwa-text-accent)] border-[var(--tuwa-text-accent)]',
    },
    active: {
      line: 'bg-[var(--tuwa-pending-icon)]',
      circle: 'border-[var(--tuwa-pending-icon)] bg-transparent',
    },
    inactive: {
      line: 'bg-[var(--tuwa-border-primary)]',
      circle: 'border-[var(--tuwa-border-primary)] bg-transparent',
    },
    error: {
      line: 'bg-[var(--tuwa-error-icon)]',
      circle: 'bg-[var(--tuwa-error-icon)] border-[var(--tuwa-error-icon)]',
    },
    replaced: {
      line: 'bg-[var(--text-disabled)]',
      circle: 'bg-[var(--text-disabled)] border-[var(--text-disabled)]',
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
