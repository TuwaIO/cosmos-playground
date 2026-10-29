import { readAcceptedMethods } from '@/app/actions';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { isDemoMode, prepareDemo } from '@/lib/mode';
import { findOrder } from '@/lib/orders';
import { getQuasar } from '@/lib/quasar';

export const metadata = { title: 'Order · Cosmos Store' };

// Whether an invoice has its e-invoice (UBL XML): Quasar issues it with the invoice when the app has e-invoices on and
// the buyer details allow it. Asked once per invoice and kept in memory.
const eInvoices: Map<string, boolean> = ((
  globalThis as { __paymentsShopXml?: Map<string, boolean> }
).__paymentsShopXml ??= new Map());

async function hasEInvoice(invoiceId: string): Promise<boolean> {
  const known = eInvoices.get(invoiceId);
  if (known !== undefined) return known;
  const issued = await getQuasar()
    .payments.getDocument(invoiceId, 'invoice.xml')
    .then(() => true)
    .catch(() => false);
  eInvoices.set(invoiceId, issued);
  return issued;
}

// The order's confirmation and details: where the checkout returns the buyer after paying (the invoice's success URL)
export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  prepareDemo();
  const invoice = findOrder(orderId)?.invoices[0];
  const [methods, eInvoiceIssued] = await Promise.all([
    readAcceptedMethods(),
    invoice?.number && !isDemoMode() ? hasEInvoice(invoice.id) : Promise.resolve(false),
  ]);
  return <OrderDetail orderId={orderId} methods={methods.ok ? methods.methods : []} eInvoiceIssued={eInvoiceIssued} />;
}
