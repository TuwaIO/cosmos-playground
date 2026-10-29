import { prepareDemo } from '@/lib/mode';
import { getOrderBook, onOrderBookChange } from '@/lib/orders';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HEARTBEAT_MS = 15_000;

// The live order book for the page, as Server-Sent Events: the whole book now, then again after every change (a
// webhook, an order), and a comment every 15 s so proxies keep the stream open. The page falls back to reading the
// book every 3 s when the stream fails. A real shop shows each buyer only their own orders, after its sign-in.
export async function GET(request: Request) {
  prepareDemo();
  const encoder = new TextEncoder();
  let cleanup = () => {};

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let timer: ReturnType<typeof setTimeout> | null = null;
      const send = () => {
        timer = null;
        try {
          controller.enqueue(encoder.encode(`event: book\ndata: ${JSON.stringify(getOrderBook())}\n\n`));
        } catch {
          cleanup();
        }
      };
      // Several changes in a row (an event and its order) go out as one message
      const schedule = () => {
        timer ??= setTimeout(send, 60);
      };
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch {
          cleanup();
        }
      }, HEARTBEAT_MS);
      const unsubscribe = onOrderBookChange(schedule);
      cleanup = () => {
        unsubscribe();
        clearInterval(heartbeat);
        if (timer) clearTimeout(timer);
      };
      request.signal.addEventListener('abort', () => {
        cleanup();
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
      send();
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
