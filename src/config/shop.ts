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
  name: "TARE Lineup 01",
  category: "curated lineup",
  sizeLabel: "4 x 100g",
  priceLabel: "$108",
  priceIdEnvVar: "STRIPE_LINEUP_4X100G_PRICE_ID",
};
