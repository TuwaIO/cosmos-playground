'use client';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useSyncExternalStore } from 'react';

import { THEME_STORAGE_KEY } from '@/configs/theme';

// The theme is the `dark` class on <html>, set before the first paint by `themeScript` in the root layout
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

const isDarkTheme = () => document.documentElement.classList.contains('dark');

/** Switches the light and dark Nova themes and saves the choice in `localStorage`. */
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, isDarkTheme, () => false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark', !isDark);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'light' : 'dark');
    } catch {
      // Storage is blocked: the theme holds until the page is reloaded
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to the light theme' : 'Switch to the dark theme'}
      className="inline-flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-[var(--tuwa-rounded-corners)] border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-secondary)] transition-all duration-200 hover:scale-[1.02] hover:text-[var(--tuwa-text-primary)] active:scale-[0.98]"
    >
      {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
}
