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

const MAX_EVENTS = 20;
const events: QuasarWebhookEvent[] = [];

// This small in-memory store keeps the example easy to run without a database.
// Data is lost when the process restarts or when a request reaches another instance.
export function saveQuasarWebhook(event: string, payload: QuasarWebhookPayload): QuasarWebhookEvent {
  const now = new Date().toISOString();
  const savedEvent: QuasarWebhookEvent = {
    id: `${payload.txKey ?? 'webhook'}:${payload.action ?? event}:${payload.timestamp ?? now}`,
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

export function getQuasarWebhooks() {
  return {
    latest: events[0] ?? null,
    events: [...events],
  };
}
