// Dates and amounts as the shop writes them. The dates follow the checkout of Nova Payments: `Intl.DateTimeFormat` with
// the language of the page, so an English page reads `Nov 18, 2026, 9:47 AM`.

/** The language of the shop's pages. */
export const LOCALE = 'en';

/** How a time is written: with its date, with its date and no year, or the time alone with seconds. */
export type TimeStyle = 'full' | 'short' | 'clock';

const STYLES: Record<TimeStyle, Intl.DateTimeFormatOptions> = {
  full: { dateStyle: 'medium', timeStyle: 'short' },
  short: { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
  clock: { timeStyle: 'medium' },
};

/**
 * A moment as text.
 *
 * @param iso - The moment (ISO 8601).
 * @param style - `full`: `Nov 18, 2026, 9:47 AM`; `short`: `Nov 18, 9:47 AM`; `clock`: `9:47:10 AM`.
 * @param timeZone - The time zone; the zone of where the code runs when omitted.
 */
export function formatTime(iso: string, style: TimeStyle = 'full', timeZone?: string): string {
  return new Intl.DateTimeFormat(LOCALE, { ...STYLES[style], timeZone }).format(new Date(iso));
}

/** An amount of the catalog currency with two decimals: `2.00`. */
export function amount(value: string | number): string {
  return Number(value).toFixed(2);
}

/** A wallet address or transaction hash, shortened: `0x1111…1111`. */
export function shorten(value: string, head = 6, tail = 4): string {
  return value.length <= head + tail + 1 ? value : `${value.slice(0, head)}…${value.slice(-tail)}`;
}
