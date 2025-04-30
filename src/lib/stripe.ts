import { Stripe } from 'stripe';

// Initialize Stripe with the secret key (clean up any trailing % characters)
const stripeKey = process.env.STRIPE_SECRET_KEY?.replace('%', '') || '';

// Initialize Stripe client
export const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16' as any,
});

export const createCheckoutSession = async ({
  priceId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    });
    
    return { success: true, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { success: false, error };
  }
}; 