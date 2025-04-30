import { NextResponse } from 'next/server';

// Helper function to verify environment variables
function checkEnvironmentVariables() {
  const variables = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV
  };
  
  console.log('Environment variables check:', {
    hasStripeSecretKey: Boolean(variables.STRIPE_SECRET_KEY),
    hasPublishableKey: Boolean(variables.PUBLISHABLE_KEY),
    stripeKeyLength: variables.STRIPE_SECRET_KEY ? variables.STRIPE_SECRET_KEY.length : 0,
    stripeKeyPrefix: variables.STRIPE_SECRET_KEY ? variables.STRIPE_SECRET_KEY.substring(0, 7) : 'not set',
    nodeEnv: variables.NODE_ENV,
    vercelEnv: variables.VERCEL_ENV
  });
  
  if (!variables.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is missing');
  }
}

export async function POST(request: Request) {
  try {
    // First, check environment variables
    try {
      checkEnvironmentVariables();
    } catch (envError: any) {
      console.error('Environment variable error:', envError);
      return NextResponse.json(
        { error: 'Stripe configuration error: Missing API key', details: envError.message },
        { status: 500 }
      );
    }
    
    const { priceId, type } = await request.json();
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }
    
    // Base URL for redirects
    const baseUrl = process.env.VERCEL_ENV === 'production'
      ? 'https://tarecoffeeroom.com' 
      : 'http://localhost:3000';
    
    const successUrl = `${baseUrl}/checkout/success?type=${type}`;
    const cancelUrl = `${baseUrl}/checkout/canceled?type=${type}`;
    
    // Log request details
    console.log('Checkout request:', { 
      type, 
      priceId,
      successUrl,
      cancelUrl,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV
    });
    
    // Dynamically import the module to avoid build-time initialization
    const stripeModule = await import('@/lib/stripe');
    
    // Verify the module loaded properly
    if (!stripeModule.createCheckoutSession) {
      console.error('Failed to load Stripe module correctly');
      return NextResponse.json(
        { error: 'Internal server error: Stripe module not available' },
        { status: 500 }
      );
    }
    
    const result = await stripeModule.createCheckoutSession({
      priceId,
      successUrl,
      cancelUrl
    });
    
    if (!result.success) {
      console.error('Checkout error details:', result);
      return NextResponse.json(
        { 
          error: 'Failed to create checkout session',
          details: {
            message: result.errorMessage,
            type: result.errorType,
            code: result.errorCode
          }
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ url: result.url });
  } catch (error: any) {
    console.error('Unexpected checkout error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 