// What a Server Action returns when it may be refused: the value, or Quasar's stable code and message. Errors thrown
// by a Server Action reach the browser without their details in production, so the shop returns them instead.

export type ActionResult<T> = { ok: true; value: T } | { ok: false; code: string; message: string };

export function ok<T>(value: T): ActionResult<T> {
  return { ok: true, value };
}

export function refused(code: string, message: string): ActionResult<never> {
  return { ok: false, code, message };
}
