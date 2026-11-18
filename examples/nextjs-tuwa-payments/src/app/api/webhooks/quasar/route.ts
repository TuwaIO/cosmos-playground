import { isPaymentWebhookEvent, QuasarWebhookError, verifyWebhook, WEBHOOK_SIGNATURE_HEADER } from '@tuwaio/quasar-sdk';

export const runtime = 'nodejs';

// The IDs of the events this server acted on. Quasar may deliver an event more than once (retries, redeliveries from
// the dashboard), so a shop acts on each event ID once. The demo keeps them in memory, which one server forgets on a
// restart and several servers do not share: a real shop saves the ID in its database, in the transaction that fulfils
// the order.
const processed: Set<string> = ((globalThis as { __cosmosStoreEvents?: Set<string> }).__cosmosStoreEvents ??=
  new Set());

// Receives the webhooks of the Quasar app. Verify the signature over the raw body before trusting anything in it:
// `verifyWebhook` also refuses a payment event sent more than 5 minutes ago (a replay).
//
// This is where a shop fulfils an order: on `invoice.paid`, never when the checkout in the browser says paid. The demo
// has nothing to ship and no database: its pages read the invoices from Quasar, so here it only writes a line to the log.
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

    const firstDelivery = !processed.has(event.id);
    processed.add(event.id);
    const orderId = event.data.invoice?.metadata?.orderId;
    if (firstDelivery && event.type === 'invoice.paid') {
      // Fulfil the order here: mark it paid in your database, send the goods, write to the buyer
    }
    console.info(
      `[Quasar webhook] ${event.type} ${event.data.invoice?.number ?? ''} order=${
        typeof orderId === 'string' ? orderId : 'unknown'
      }${firstDelivery ? '' : ' (repeat, ignored)'}`,
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
