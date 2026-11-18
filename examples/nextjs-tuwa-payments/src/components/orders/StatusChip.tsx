import type { InvoiceStatus } from '@tuwaio/quasar-sdk';

import { INVOICE_STATUS } from '@/lib/status';

/** The status of an order as a chip: the status of its invoice in Quasar. */
export function StatusChip({ status }: { status: InvoiceStatus }) {
  const { label, tone } = INVOICE_STATUS[status];
  return <span className={`shop-chip is-dot${tone === 'neutral' ? '' : ` is-${tone}`}`}>{label}</span>;
}
