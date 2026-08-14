export const TRANSACTION_SUCCESS_EVENT = 'tuwa:transaction-success';

export type TransactionSuccessDetail = {
  txKey?: string;
  hash?: string;
};

export function notifyTransactionSuccess(detail?: TransactionSuccessDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<TransactionSuccessDetail>(TRANSACTION_SUCCESS_EVENT, { detail }));
  }
}
