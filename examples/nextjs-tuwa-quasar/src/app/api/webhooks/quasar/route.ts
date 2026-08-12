import crypto from 'node:crypto';

import { NextRequest, NextResponse } from 'next/server';

import { getQuasarWebhooks, type QuasarWebhookPayload, saveQuasarWebhook } from '@/lib/quasarWebhookStore';

export const runtime = 'nodejs';

// This route is an educational example of receiving Quasar webhook deliveries.
// In production, replace the in-memory store with durable storage and enqueue
// any long-running business processing instead of doing it in the request path.
function isValidSignature(signature: string, rawBody: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) {
    return false;
  }

  const expectedSignature = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
}

export async function GET() {
  return NextResponse.json(getQuasarWebhooks());
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-quasar-signature');
  const event = request.headers.get('x-quasar-event') ?? 'unknown';
  const secret = process.env.QUASAR_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return NextResponse.json({ success: false, error: 'Missing webhook signature or server secret' }, { status: 401 });
  }

  // Read the raw body before parsing it. HMAC verification must use the exact
  // bytes sent by Quasar, including the original whitespace and formatting.
  const rawBody = await request.text();
  if (!isValidSignature(signature, rawBody, secret)) {
    return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 401 });
  }

  let payload: QuasarWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as QuasarWebhookPayload;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Store the verified event so the demo UI can show how webhook data was
  // received and processed. This is intentionally simple for local testing.
  const savedEvent = saveQuasarWebhook(event, payload);
  console.info(`[Quasar Webhook] Processed ${event} for txKey=${payload.txKey ?? 'unknown'}`);

  return NextResponse.json({ success: true, eventId: savedEvent.id }, { status: 200 });
}
