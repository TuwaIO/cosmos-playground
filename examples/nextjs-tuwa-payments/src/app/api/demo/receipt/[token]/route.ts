import { demoDocument, demoInvoiceIdOfToken } from '@/lib/demo/engine';
import { isDemoMode } from '@/lib/mode';

export const runtime = 'nodejs';

// Demo mode: the receipt link of the paid checkout (`url('receipt')` of the demo checkout API)
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invoiceId = isDemoMode() ? demoInvoiceIdOfToken(token) : undefined;
  const bytes = invoiceId ? demoDocument(invoiceId, 'receipt') : null;
  if (!bytes) return new Response('No receipt', { status: 404 });
  return new Response(Buffer.from(bytes), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="receipt-demo.pdf"' },
  });
}
