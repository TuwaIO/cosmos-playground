export type QuasarWebhookPayload = {
  txKey?: string;
  hash?: string;
  status?: string;
  action?: string;
  txType?: string;
  chainId?: string | number;
  timestamp?: number;
  payload?: Record<string, unknown>;
  [key: string]: unknown;
};

export type QuasarWebhookEvent = {
  id: string;
  event: string;
  payload: QuasarWebhookPayload;
  receivedAt: string;
  processedAt: string;
  status: 'processed';
};

const MAX_EVENTS = 50;
const events: QuasarWebhookEvent[] = [];

/**
 * Saves a validated Quasar webhook delivery into the in-memory store.
 */
export function saveQuasarWebhook(event: string, payload: QuasarWebhookPayload): QuasarWebhookEvent {
  const now = new Date().toISOString();
  const txKey = payload.txKey;
  const hash = payload.hash;

  const savedEvent: QuasarWebhookEvent = {
    id: `${txKey ?? hash ?? 'webhook'}:${payload.action ?? event}:${payload.timestamp ?? now}`,
    event,
    payload,
    receivedAt: now,
    processedAt: now,
    status: 'processed',
  };

  const existingIndex = events.findIndex((item) => item.id === savedEvent.id);
  if (existingIndex >= 0) {
    events[existingIndex] = savedEvent;
  } else {
    events.unshift(savedEvent);
    events.splice(MAX_EVENTS);
  }

  return savedEvent;
}

/**
 * Retrieves stored webhook events, optionally filtered by a specific transaction key or transaction hash.
 */
export function getQuasarWebhooks(filter?: { txKey?: string | null; hash?: string | null }) {
  const txKey = filter?.txKey?.trim();
  const hash = filter?.hash?.trim();

  let matchedEvents = [...events];
  if (txKey || hash) {
    matchedEvents = events.filter((item) => {
      if (txKey && item.payload.txKey === txKey) return true;
      if (hash && item.payload.hash === hash) return true;
      return false;
    });
  }

  // Create a fast lookup map by txKey
  const byTxKey: Record<string, QuasarWebhookEvent> = {};
  for (const item of events) {
    if (item.payload.txKey && !byTxKey[item.payload.txKey]) {
      byTxKey[item.payload.txKey] = item;
    }
  }

  return {
    latest: matchedEvents[0] ?? (filter ? null : (events[0] ?? null)),
    events: matchedEvents,
    allEventsCount: events.length,
    byTxKey,
  };
}
