import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { priceId, type } = await request.json();
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }
    
    // Base URL for redirects
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://tarecoffeeroom.com' 
      : 'http://localhost:3000';
    
    const successUrl = `${baseUrl}/checkout/success?type=${type}`;
    const cancelUrl = `${baseUrl}/checkout/canceled?type=${type}`;
    
    // Verify environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY environment variable is missing');
      return NextResponse.json(
        { error: 'Stripe configuration error: Missing API key' },
        { status: 500 }
      );
    }
    
    // Log request details
    console.log('Checkout request:', { type, priceId });
    console.log('Environment check:', { 
      hasStripeKey: Boolean(process.env.STRIPE_SECRET_KEY),
      env: process.env.NODE_ENV
    });
    
    // Dynamically import the module to avoid build-time initialization
    const { createCheckoutSession } = await import('@/lib/stripe');
    
    const result = await createCheckoutSession({
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