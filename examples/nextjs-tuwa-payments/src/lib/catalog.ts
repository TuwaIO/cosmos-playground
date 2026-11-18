// What the shop sells. Prices are in USD; the buyer pays the price in the token of the method they choose, at the
// rate Quasar locks for the quote. Small amounts keep testnet faucets enough for many payments.

export type Product = {
  id: string;
  name: string;
  /** The shelf of the product, shown over its card. */
  category: string;
  description: string;
  /** Price in USD, as a decimal string. */
  price: string;
  /** Facts of the product page: a name and a value. */
  facts: readonly (readonly [string, string])[];
};

export const CURRENCY = 'USD';

export const PRODUCTS: readonly Product[] = [
  {
    id: 'hoodie',
    name: 'Cosmos hoodie',
    category: 'Apparel',
    description: 'Heavy cotton, embroidered orbit on the chest, ships worldwide.',
    price: '2.00',
    facts: [
      ['Material', 'Heavy cotton'],
      ['Detail', 'Embroidered orbit'],
      ['Shipping', 'Worldwide'],
    ],
  },
  {
    id: 'stickers',
    name: 'Sticker pack',
    category: 'Stickers',
    description: 'Ten vinyl stickers with the planets of TUWA, for laptops and bottles.',
    price: '0.50',
    facts: [
      ['In the pack', 'Ten stickers'],
      ['Material', 'Vinyl'],
      ['For', 'Laptops and bottles'],
    ],
  },
  {
    id: 'mug',
    name: 'Orbit mug',
    category: 'Drinkware',
    description: 'Stoneware, 350 ml, keeps the coffee warm through a long deploy.',
    price: '1.20',
    facts: [
      ['Material', 'Stoneware'],
      ['Volume', '350 ml'],
    ],
  },
  {
    id: 'cap',
    name: 'Satellite cap',
    category: 'Apparel',
    description: 'Six panels, a curved brim and a small satellite on the side.',
    price: '1.50',
    facts: [
      ['Cut', 'Six panels'],
      ['Brim', 'Curved'],
      ['Detail', 'A satellite on the side'],
    ],
  },
  {
    id: 'notebook',
    name: 'Dot-grid notebook',
    category: 'Stationery',
    description: 'A5, 160 pages of dotted paper for sketches of the next protocol.',
    price: '0.80',
    facts: [
      ['Format', 'A5'],
      ['Pages', '160, dotted'],
    ],
  },
  {
    id: 'poster',
    name: 'Quasar poster',
    category: 'Print',
    description: 'Risograph print, 50 × 70 cm, one colour on heavy paper.',
    price: '1.00',
    facts: [
      ['Print', 'Risograph, one colour'],
      ['Size', '50 × 70 cm'],
    ],
  },
];

/**
 * The membership of Cosmos Club: one payment, like any order. It has no period and no next invoice; the shop treats
 * the browser whose order of it is paid as a member.
 */
export const CLUB = {
  id: 'club',
  name: 'Cosmos Club membership',
  description: 'One payment. No renewals.',
  price: '5.00',
  perks: [
    { title: 'Early builds of every release', text: 'Try a release before it is published.' },
    { title: 'A private channel with the team', text: 'Ask the people who write the code.' },
    { title: 'Priority support', text: 'An answer in one business day.' },
  ],
} as const;

/** The cart may hold at most this many of one product. */
export const MAX_QUANTITY = 10;

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

/** Sums decimal prices exactly, in cents. */
export function sumPrices(lines: readonly { price: string; quantity: number }[]): string {
  const cents = lines.reduce((total, line) => total + Math.round(Number(line.price) * 100) * line.quantity, 0);
  return (cents / 100).toFixed(2);
}
