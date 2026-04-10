export type ShopProduct = {
  slug: string;
  name: string;
  category: string;
  sizeLabel: string;
  priceLabel: string;
  priceIdEnvVar: string;
};

export const SHOP_PRODUCT: ShopProduct = {
  slug: "tare-lineup-01-4x100g",
  name: 'TARE SET 01 · "NOISE" · 400g total',
  category: "sealed edition",
  sizeLabel: "4 × (50g resealable + 50g vacuum)",
  priceLabel: "$108",
  priceIdEnvVar: "STRIPE_LINEUP_4X100G_PRICE_ID",
};
