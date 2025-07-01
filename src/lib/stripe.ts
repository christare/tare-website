import { Stripe } from 'stripe';

// Lazy loaded Stripe instance
let stripeInstance: Stripe | null = null;

export const getStripe = (): Stripe => {
  // Try multiple possible environment variable names
  const possibleVarNames = [
    'STRIPE_SECRET_KEY',
    'STRIPE_KEY',
    'STRIPE_API_KEY',
  ];
  
  // Get the first available key
  let stripeKey = '';
  let usedVarName = '';
  
  for (const varName of possibleVarNames) {
    if (process.env[varName]) {
      stripeKey = process.env[varName] as string;
      usedVarName = varName;
      break;
    }
  }
  
  // Log environment variables for debugging
  console.log('Environment check for Stripe:', {
    envVarChecked: possibleVarNames,
    usedVarName,
    hasKey: Boolean(stripeKey),
    keyPrefix: stripeKey ? stripeKey.substring(0, 7) : 'not set',
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });
  
  // Make sure we found a key
  if (!stripeKey) {
    console.error('No Stripe secret key found in any of the checked environment variables');
    throw new Error('Stripe secret key not found');
  }
  
  if (stripeInstance) {
    return stripeInstance;
  }
  
  try {
    // Remove any trailing % character and trim whitespace
    stripeKey = stripeKey.replace('%', '').trim();
    
    if (!stripeKey.startsWith('sk_')) {
      console.error('Stripe key does not start with expected prefix "sk_"');
      throw new Error('Invalid Stripe secret key format');
    }
    
    console.log('Initializing Stripe with key prefix:', stripeKey.substring(0, 7) + '...');
    
    // Initialize Stripe with the API key from environment variables
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
  metadata,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
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
      phone_number_collection: {
        enabled: true,
      },
      ...(metadata && { metadata }),
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