import { NextResponse } from "next/server";
import { SHOP_PRODUCT } from "@/config/shop";
import { resolveStripeShopSource } from "@/lib/shop-stripe";

export async function GET() {
  let enabled = false;
  let displayPrice = SHOP_PRODUCT.priceLabel;
  let checkoutItem = SHOP_PRODUCT.slug;
  let productName = SHOP_PRODUCT.name;
  let productId = "";
  let priceId = "";

  try {
    const stripeSource = await resolveStripeShopSource();
    enabled = stripeSource.enabled;
    displayPrice = stripeSource.displayPrice || SHOP_PRODUCT.priceLabel;
    checkoutItem = stripeSource.checkoutItem;
    productName = stripeSource.productName || SHOP_PRODUCT.name;
    productId = stripeSource.productId;
    priceId = stripeSource.priceId;
  } catch {
    // Keep fallback values for display; checkout remains disabled.
  }

  return NextResponse.json({
    enabled,
    displayPrice,
    checkoutItem,
    productName,
    productId,
    priceId,
    product: SHOP_PRODUCT,
    setupHint: "Set STRIPE_LINEUP_PRODUCT_ID with a Stripe product that has default_price.",
  });
}
