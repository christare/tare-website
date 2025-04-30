import { Stripe } from 'stripe';

// Lazy loaded Stripe instance
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  // Log environment variables availability (without showing full values)
  console.log('Environment check for Stripe:', {
    hasStripeSecretKey: typeof process.env.STRIPE_SECRET_KEY === 'string' && process.env.STRIPE_SECRET_KEY.length > 0,
    hasPublishableKey: typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === 'string',
    secretKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) : 'not set',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });
  
  // Make sure we don't initialize during build
  if (typeof process.env.STRIPE_SECRET_KEY !== 'string' || !process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY environment variable is not properly set or is empty');
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  
  if (stripeInstance) {
    return stripeInstance;
  }
  
  try {
    // Remove any trailing % character and trim whitespace
    const stripeKey = process.env.STRIPE_SECRET_KEY.replace('%', '').trim();
    
    if (!stripeKey.startsWith('sk_')) {
      console.error('STRIPE_SECRET_KEY does not start with expected prefix "sk_"');
      throw new Error('Invalid Stripe secret key format');
    }
    
    console.log('Initializing Stripe with key prefix:', stripeKey.substring(0, 7) + '...');
    
    stripeInstance = new Stripe(stripeKey, {
      apiVersion: '2025-03-31.basil',
    });
    
    return stripeInstance;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    throw error;
  }
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
    console.log('Creating checkout session with:', { priceId, successUrl, cancelUrl });
    
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
    
    console.log('Checkout session created successfully:', session.id);
    return { success: true, url: session.url };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    // Include more detailed error information
    return { 
      success: false, 
      error,
      errorMessage: error.message || 'Unknown error', 
      errorType: error.type || 'Unknown type',
      errorCode: error.statusCode || error.code || 'No code'
    };
  }
}; 