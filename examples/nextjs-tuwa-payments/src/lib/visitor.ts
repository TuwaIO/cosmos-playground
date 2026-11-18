import { cookies } from 'next/headers';

// The shop keeps no accounts. A visitor is a random ID in a cookie of this site: invoices are issued with it as the
// buyer's external ID, and the shop lists only the invoices that carry it, so nobody sees the orders of another browser.
// The cookie is HttpOnly (scripts of the page cannot read it) and holds nothing about the person.

/** The cookie of the visitor ID. */
export const VISITOR_COOKIE = 'cosmos-store-visitor';

/** How long the cookie lasts, in seconds: 30 days from the latest order. */
const MAX_AGE = 60 * 60 * 24 * 30;

const VISITOR_ID = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;

/**
 * The visitor ID of this browser, when it has one. Safe to call while rendering a page: it only reads the cookie.
 *
 * @returns The ID, or `null` for a browser that has not ordered yet (or sent something that is not an ID of the shop).
 */
export async function readVisitor(): Promise<string | null> {
  const value = (await cookies()).get(VISITOR_COOKIE)?.value;
  return value && VISITOR_ID.test(value) ? value : null;
}

/**
 * The visitor ID of this browser, created and saved in the cookie when it has none. It also renews the cookie, so the
 * 30 days count from the latest order. Call it from a Server Action or a route handler only: a page cannot set cookies.
 *
 * @returns The ID.
 */
export async function ensureVisitor(): Promise<string> {
  const id = (await readVisitor()) ?? crypto.randomUUID();
  (await cookies()).set(VISITOR_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
  return id;
}
