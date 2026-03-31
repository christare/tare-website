import { NextResponse } from "next/server";
import { SHOP_PRODUCT } from "@/config/shop";
import { resolveStripeShopSource } from "@/lib/shop-stripe";
import type { Stripe } from "stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const item = String(body?.item ?? "").trim();
    const stripeSource = await resolveStripeShopSource();
    if (!stripeSource.enabled || !stripeSource.priceId) {
      return NextResponse.json(
        {
          error: "Coffee checkout is not connected yet.",
          details:
            "Set STRIPE_LINEUP_PRODUCT_ID to a Stripe product with a default_price.",
        },
        { status: 503 }
      );
    }

    if (item && item !== stripeSource.checkoutItem && item !== SHOP_PRODUCT.slug) {
      return NextResponse.json({ error: "Unknown product" }, { status: 400 });
    }

    const baseUrl =
      process.env.VERCEL_ENV === "production"
        ? "https://tarestudionyc.com"
        : "http://localhost:3000";

    const successUrl = `${baseUrl}/checkout/success?type=lineup&product=${encodeURIComponent(
      SHOP_PRODUCT.slug
    )}`;
    const cancelUrl = `${baseUrl}/shop?from=canceled`;

    const stripeModule = await import("@/lib/stripe");
    const result = await stripeModule.createCheckoutSession({
      priceId: stripeSource.priceId,
      successUrl,
      cancelUrl,
      automaticTax: true,
      shippingAddressCountries: ["US"],
      shippingOptions: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 800, currency: "usd" },
            display_name: "Standard",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1400, currency: "usd" },
            display_name: "Fast",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 2 },
            },
          },
        },
      ] satisfies Stripe.Checkout.SessionCreateParams.ShippingOption[],
      metadata: {
        type: "lineup",
        product: stripeSource.productId || SHOP_PRODUCT.slug,
      },
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Failed to create checkout session",
          details: {
            message: result.errorMessage,
            type: result.errorType,
            code: result.errorCode,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
