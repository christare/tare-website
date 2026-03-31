import { getStripe } from "@/lib/stripe";

const DEFAULT_LINEUP_PRODUCT_ID = "prod_UFcllGsM79YoRp";

function formatStripePrice(unitAmount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: unitAmount % 100 === 0 ? 0 : 2,
  }).format(unitAmount / 100);
}

export type StripeShopSource = {
  productId: string;
  productName: string;
  priceId: string;
  displayPrice: string;
  enabled: boolean;
  checkoutItem: string;
};

export async function resolveStripeShopSource(): Promise<StripeShopSource> {
  const stripe = getStripe();
  const productId =
    process.env.STRIPE_LINEUP_PRODUCT_ID?.trim() || DEFAULT_LINEUP_PRODUCT_ID;

  const product = await stripe.products.retrieve(productId, {
    expand: ["default_price"],
  });

  const productName = "name" in product ? product.name : "TARE Lineup 01";

  let resolvedPrice: any = null;
  if (product.default_price) {
    if (typeof product.default_price === "string") {
      resolvedPrice = await stripe.prices.retrieve(product.default_price);
    } else {
      resolvedPrice = product.default_price;
    }
  }

  // Temporary compatibility fallback while default_price is being wired in Stripe.
  if (!resolvedPrice) {
    const fallbackPriceId =
      process.env.STRIPE_LINEUP_4X100G_PRICE_ID?.trim() ||
      process.env.STRIPE_BEANS_120G_PRICE_ID?.trim() ||
      "";
    if (fallbackPriceId) {
      resolvedPrice = await stripe.prices.retrieve(fallbackPriceId);
    }
  }

  const hasPrice =
    Boolean(resolvedPrice?.id) && typeof resolvedPrice?.unit_amount === "number";

  return {
    productId,
    productName,
    priceId: resolvedPrice?.id || "",
    displayPrice: hasPrice
      ? formatStripePrice(resolvedPrice.unit_amount, resolvedPrice.currency)
      : "",
    enabled: hasPrice,
    checkoutItem: productId,
  };
}
