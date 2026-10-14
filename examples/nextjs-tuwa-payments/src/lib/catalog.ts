// What the shop sells. Prices are in USD; the buyer pays the price in the token of the method they choose, at the
// rate Quasar locks for the quote. Small amounts keep testnet faucets enough for many payments.

export type Product = {
  id: string;
  name: string;
  description: string;
  /** Price in USD, as a decimal string. */
  price: string;
};

export type Plan = Product & {
  /** How often the plan bills. A day is the shortest period, so a renewal can be watched on a testnet. */
  interval: 'day' | 'week' | 'month' | 'year';
  /** How many periods it bills, then ends. */
  cycles: number;
};

export const CURRENCY = 'USD';

export const PRODUCTS: readonly Product[] = [
  { id: 'stickers', name: 'Sticker pack', description: 'Ten vinyl stickers with the planets of TUWA.', price: '0.50' },
  {
    id: 'hoodie',
    name: 'Cosmos hoodie',
    description: 'Heavy cotton, embroidered logo, ships worldwide.',
    price: '2.00',
  },
];

export const PLAN: Plan = {
  id: 'pro',
  name: 'Pro plan',
  description: 'Priority support and early builds, billed every day while you test.',
  price: '1.00',
  interval: 'day',
  cycles: 30,
};

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}
