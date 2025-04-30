import { Stripe } from 'stripe';

// Lazy loaded Stripe instance
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  // Make sure we don't initialize during build
  if (typeof process.env.STRIPE_SECRET_KEY !== 'string') {
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  
  if (stripeInstance) {
    return stripeInstance;
  }
  
  const stripeKey = process.env.STRIPE_SECRET_KEY.replace('%', '');
  stripeInstance = new Stripe(stripeKey, {
    apiVersion: '2023-10-16' as any,
  });
  
  return stripeInstance;
};

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
    // This will only run on the server during request time, not during build
    const stripe = getStripe();
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