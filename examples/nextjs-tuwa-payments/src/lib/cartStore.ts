import { MAX_QUANTITY } from '@/lib/catalog';

// The cart: a per-viewer convenience kept in `localStorage` (and in memory where storage is blocked). It never reaches
// the server until checkout, which checks it against the catalog.

export type CartLine = { productId: string; quantity: number };

const STORAGE_KEY = 'cosmos-store:cart';
const CHECKED_OUT_KEY = 'cosmos-store:checked-out';
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;

function read(): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(
      (line): line is CartLine =>
        typeof line?.productId === 'string' &&
        Number.isInteger(line?.quantity) &&
        line.quantity >= 1 &&
        line.quantity <= MAX_QUANTITY,
    );
  } catch {
    return EMPTY;
  }
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage is blocked: the cart lasts until the page is reloaded
  }
  listeners.forEach((listener) => listener());
}

/** How many items the cart holds: every unit of every product, the one count the header and the cart show. */
export function cartItemCount(lines: readonly CartLine[]): number {
  return lines.reduce((total, line) => total + line.quantity, 0);
}

/** "1 item", "4 items". */
export function itemsLabel(count: number): string {
  return `${count} ${count === 1 ? 'item' : 'items'}`;
}

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      cache = read();
      listener();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  },
  getSnapshot: (): CartLine[] => (cache ??= read()),
  getServerSnapshot: (): CartLine[] => EMPTY,
  add(productId: string, quantity = 1) {
    const lines = cartStore.getSnapshot();
    const found = lines.find((line) => line.productId === productId);
    write(
      found
        ? lines.map((line) =>
            line.productId === productId
              ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) }
              : line,
          )
        : [...lines, { productId, quantity: Math.min(MAX_QUANTITY, quantity) }],
    );
  },
  setQuantity(productId: string, quantity: number) {
    const clamped = Math.max(1, Math.min(MAX_QUANTITY, quantity));
    write(
      cartStore.getSnapshot().map((line) => (line.productId === productId ? { ...line, quantity: clamped } : line)),
    );
  },
  remove(productId: string) {
    write(cartStore.getSnapshot().filter((line) => line.productId !== productId));
  },
  clear() {
    write(EMPTY);
  },
  /** Remembers the order the cart was checked out as: the cart empties when that order is paid. */
  checkedOut(orderId: string) {
    try {
      sessionStorage.setItem(CHECKED_OUT_KEY, orderId);
    } catch {
      // Storage is blocked: the cart stays
    }
  },
  /** Empties the cart once the order it was checked out as is paid. */
  paid(orderId: string) {
    try {
      if (sessionStorage.getItem(CHECKED_OUT_KEY) !== orderId) return;
      sessionStorage.removeItem(CHECKED_OUT_KEY);
    } catch {
      return;
    }
    write(EMPTY);
  },
};
