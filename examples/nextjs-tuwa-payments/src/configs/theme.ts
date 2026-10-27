/** `localStorage` key of the theme picked with `ThemeToggle`; without it the page follows the system theme. */
export const THEME_STORAGE_KEY = 'theme';

/**
 * Inline script of the root layout: adds the `dark` class of the Nova themes before the first paint, from the saved
 * theme or the system one, so a page load never flashes the other theme.
 */
export const themeScript = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;
