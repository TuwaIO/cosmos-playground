// What the shop sells. Prices are in USD; the buyer pays the price in the token of the method they choose, at the
// rate Quasar locks for the quote. Small amounts keep testnet faucets enough for many payments.

import type { SubscriptionInterval } from '@tuwaio/quasar-sdk';

export type Product = {
  id: string;
  name: string;
  description: string;
  /** Price in USD, as a decimal string. */
  price: string;
  /** Monochrome line art in `/public/products`, drawn for the shop (no stock photos, no external hosts). */
  art: string;
};

/** A billing period of the plan the buyer can choose. */
export type PlanPeriod = {
  interval: SubscriptionInterval;
  label: string;
  /** Price per period in USD, as a decimal string. */
  price: string;
  /** How many periods it bills, then ends. */
  cycles: number;
};

export type Plan = {
  id: string;
  name: string;
  description: string;
  perks: readonly string[];
  periods: readonly PlanPeriod[];
};

export const CURRENCY = 'USD';

export const PRODUCTS: readonly Product[] = [
  {
    id: 'hoodie',
    name: 'Cosmos hoodie',
    description: 'Heavy cotton, embroidered orbit on the chest, ships worldwide.',
    price: '2.00',
    art: '/products/hoodie.svg',
  },
  {
    id: 'stickers',
    name: 'Sticker pack',
    description: 'Ten vinyl stickers with the planets of TUWA, for laptops and bottles.',
    price: '0.50',
    art: '/products/stickers.svg',
  },
  {
    id: 'mug',
    name: 'Orbit mug',
    description: 'Stoneware, 350 ml, keeps the coffee warm through a long deploy.',
    price: '1.20',
    art: '/products/mug.svg',
  },
  {
    id: 'cap',
    name: 'Satellite cap',
    description: 'Six panels, a curved brim and a small satellite on the side.',
    price: '1.50',
    art: '/products/cap.svg',
  },
  {
    id: 'notebook',
    name: 'Dot-grid notebook',
    description: 'A5, 160 pages of dotted paper for sketches of the next protocol.',
    price: '0.80',
    art: '/products/notebook.svg',
  },
  {
    id: 'poster',
    name: 'Quasar poster',
    description: 'Risograph print, 50 × 70 cm, one colour on heavy paper.',
    price: '1.00',
    art: '/products/poster.svg',
  },
];

export const PLAN: Plan = {
  id: 'pro',
  name: 'Pro plan',
  description: 'Priority support and early builds while you build on TUWA.',
  perks: ['Priority support in one business day', 'Early builds of every release', 'A private channel with the team'],
  periods: [
    // A day is the shortest period, so a renewal can be watched on a testnet
    { interval: 'day', label: 'Daily (testnet)', price: '1.00', cycles: 30 },
    { interval: 'week', label: 'Weekly', price: '5.00', cycles: 12 },
    { interval: 'month', label: 'Monthly', price: '15.00', cycles: 12 },
  ],
};

/** The cart may hold at most this many of one product. */
export const MAX_QUANTITY = 10;

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export function findPeriod(interval: string): PlanPeriod | undefined {
  return PLAN.periods.find((period) => period.interval === interval);
}

/** Sums decimal prices exactly, in cents. */
export function sumPrices(lines: readonly { price: string; quantity: number }[]): string {
  const cents = lines.reduce((total, line) => total + Math.round(Number(line.price) * 100) * line.quantity, 0);
  return (cents / 100).toFixed(2);
}
