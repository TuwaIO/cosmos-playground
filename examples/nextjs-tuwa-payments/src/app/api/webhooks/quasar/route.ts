import { isPaymentWebhookEvent, QuasarWebhookError, verifyWebhook, WEBHOOK_SIGNATURE_HEADER } from '@tuwaio/quasar-sdk';

import { applyPaymentEvent } from '@/lib/orders';

export const runtime = 'nodejs';

// Receives the webhooks of the Quasar app. Verify the signature over the raw body before trusting anything in it:
// `verifyWebhook` also refuses a payment event sent more than 5 minutes ago (a replay).
export async function POST(request: Request) {
  const secret = process.env.QUASAR_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: 'QUASAR_WEBHOOK_SECRET is not set' }, { status: 500 });

  try {
    const event = await verifyWebhook({
      body: await request.text(),
      signature: request.headers.get(WEBHOOK_SIGNATURE_HEADER),
      secret,
    });

    if (!isPaymentWebhookEvent(event)) {
      // A transaction webhook (Pulsar sync): this shop does not sync transactions
      return new Response(null, { status: 204 });
    }

    const { firstDelivery, order } = applyPaymentEvent(event);
    console.info(
      `[Quasar webhook] ${event.type} ${event.data.invoice?.number ?? ''} order=${order?.id ?? 'unknown'}${
        firstDelivery ? '' : ' (repeat)'
      }`,
    );
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof QuasarWebhookError) {
      console.warn(`[Quasar webhook] Refused: ${error.code}`);
      return Response.json({ error: error.code }, { status: error.code === 'invalid_body' ? 400 : 401 });
    }
    throw error;
  }
}
