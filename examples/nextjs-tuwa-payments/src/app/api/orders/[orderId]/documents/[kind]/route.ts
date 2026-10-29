import { QuasarSDKError } from '@tuwaio/quasar-sdk';

import { demoDocument } from '@/lib/demo/engine';
import { isDemoMode, prepareDemo } from '@/lib/mode';
import { findOrder } from '@/lib/orders';
import { getQuasar } from '@/lib/quasar';

export const runtime = 'nodejs';

const KINDS = ['invoice', 'receipt', 'invoice.xml', 'credit-note'] as const;
type Kind = (typeof KINDS)[number];

function notFound(message: string) {
  return new Response(message, { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

// Downloads a document of an order's invoice: the invoice PDF, the receipt PDF (once paid), the e-invoice (UBL XML, when
// issued) or a credit note (`?ref=` its number, after a refund). Quasar keeps them byte for byte as issued; the
// secret key stays here. `?invoice=` picks a period's invoice of a subscription (default: the newest). A real shop
// checks that the person signed in owns the order; this one trusts the unguessable order ID.
export async function GET(request: Request, { params }: { params: Promise<{ orderId: string; kind: string }> }) {
  const { orderId, kind } = await params;
  if (!KINDS.includes(kind as Kind)) return notFound('Unknown document');
  prepareDemo();
  const order = findOrder(orderId);
  if (!order) return notFound('No such order');
  const url = new URL(request.url);
  const wanted = url.searchParams.get('invoice');
  const invoice = wanted ? order.invoices.find((item) => item.id === wanted) : order.invoices[0];
  if (!invoice) return notFound('The order has no invoice yet');
  const ref = url.searchParams.get('ref');

  if (isDemoMode()) {
    if (kind === 'invoice.xml') return notFound('Demo mode issues no e-invoices');
    const bytes = demoDocument(invoice.id, kind as 'invoice' | 'receipt' | 'credit-note');
    if (!bytes) return notFound('This document is not issued yet');
    return new Response(Buffer.from(bytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${kind}-${invoice.number ?? invoice.id}-demo.pdf"`,
      },
    });
  }

  try {
    const payments = getQuasar().payments;
    const document =
      kind === 'credit-note'
        ? await payments.getCreditNote(invoice.id, ref ?? '')
        : await payments.getDocument(invoice.id, kind as 'invoice' | 'receipt' | 'invoice.xml');
    const filename = document.filename ?? `${kind}-${invoice.number ?? invoice.id}`;
    return new Response(Buffer.from(document.bytes), {
      headers: {
        'Content-Type': document.contentType ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
      },
    });
  } catch (error) {
    if (error instanceof QuasarSDKError && error.status === 404) return notFound('This document is not issued yet');
    throw error;
  }
}
