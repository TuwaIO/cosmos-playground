import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// One date style, the Quasar dashboard's: the short date and the 24-hour time in en-US, in the viewer's time zone
const DATE_TIME = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});
const CLOCK = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

/** A date and time as the dashboard shows it: `Oct 29, 2026, 14:05`. */
export function dateTime(iso: string): string {
  return DATE_TIME.format(new Date(iso));
}

/** A time of the log: `14:05:09` today, else the date and time as {@link dateTime}. */
export function clockTime(iso: string): string {
  const time = dayjs(iso);
  return time.isSame(dayjs(), 'day') ? CLOCK.format(time.toDate()) : dateTime(iso);
}

/** How long ago, as `3 minutes ago`, from `now`. */
export function ago(iso: string, now: number): string {
  const seconds = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (seconds < 60) return `${seconds} s ago`;
  return dayjs(iso).from(dayjs(now));
}

/** An amount of the catalog currency: `2.00 USD`. */
export function money(amount: string | number, currency = 'USD'): string {
  return `${Number(amount).toFixed(2)} ${currency}`;
}
