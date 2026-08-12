export const TRANSACTION_SUCCESS_EVENT = 'tuwa:transaction-success';

export function notifyTransactionSuccess() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(TRANSACTION_SUCCESS_EVENT));
  }
}
