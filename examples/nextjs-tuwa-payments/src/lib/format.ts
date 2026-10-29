import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

/** A time as `14:05:09` today, else `27 Oct 14:05`, in the viewer's time zone. */
export function clockTime(iso: string): string {
  const time = dayjs(iso);
  return time.isSame(dayjs(), 'day') ? time.format('HH:mm:ss') : time.format('D MMM HH:mm');
}

/** A date and time as `29 Oct, 14:05`. */
export function dateTime(iso: string): string {
  return dayjs(iso).format('D MMM, HH:mm');
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
