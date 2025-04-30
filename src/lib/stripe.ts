import { Stripe } from 'stripe';

// Create a getter function for the Stripe instance to avoid initialization during build
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  // Make sure we don't initialize during build
  if (typeof process.env.STRIPE_SECRET_KEY !== 'string') {
    console.error('STRIPE_SECRET_KEY environment variable is not properly set');
    throw new Error('STRIPE_SECRET_KEY is not defined');
  }
  
  if (stripeInstance) {
    return stripeInstance;
  }
  
  try {
    // Remove any trailing % character and trim whitespace
    const stripeKey = process.env.STRIPE_SECRET_KEY.replace('%', '').trim();
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