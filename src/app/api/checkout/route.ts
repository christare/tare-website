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
    
    // Dynamically import the module to avoid build-time initialization
    const { createCheckoutSession } = await import('@/lib/stripe');
    
    const result = await createCheckoutSession({
      priceId,
      successUrl,
      cancelUrl
    });
    
    if (!result.success) {
      console.error('Checkout error:', result.error);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 