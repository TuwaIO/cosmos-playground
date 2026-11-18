import { QuasarSDKError } from '@tuwaio/quasar-sdk';

import { findOrder } from '@/lib/orders';
import { getQuasar } from '@/lib/quasar';
import { readVisitor } from '@/lib/visitor';

export const runtime = 'nodejs';

const KINDS = ['invoice', 'receipt'] as const;
type Kind = (typeof KINDS)[number];

function notFound(message: string) {
  return new Response(message, { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

// Downloads a document of an order: the invoice PDF, or the receipt PDF once it is paid. Quasar keeps them byte for
// byte as issued; the secret key stays here. The order is looked up among the invoices of this browser's visitor ID,
// so nobody downloads the documents of another visitor.
export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string; kind: string }> }) {
  const { orderId, kind } = await params;
  if (!KINDS.includes(kind as Kind)) return notFound('Unknown document');
  const visitorId = await readVisitor();
  if (!visitorId) return notFound('No such order');

  try {
    const order = await findOrder(visitorId, orderId);
    if (!order) return notFound('No such order');
    const document = await getQuasar().payments.getDocument(order.invoiceId, kind as Kind);
    const filename = document.filename ?? `${kind}-${order.number ?? order.invoiceId}.pdf`;
    return new Response(Buffer.from(document.bytes), {
      headers: {
        'Content-Type': document.contentType ?? 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    if (error instanceof QuasarSDKError && error.status === 404) return notFound('This document is not issued yet');
    throw error;
  }
}
