import { NextResponse } from 'next/server';

// Helper function to verify environment variables
function checkEnvironmentVariables() {
  // Try multiple possible variable names
  const possibleVarNames = [
    'STRIPE_SECRET_KEY',
    'STRIPE_KEY',
    'STRIPE_API_KEY',
  ];
  
  // Check all environment variables for debugging
  const envVars = Object.keys(process.env)
    .filter(key => key.includes('STRIPE') || key.includes('VERCEL') || key.includes('NODE'))
    .reduce((obj, key) => {
      // Don't show full values for secret keys
      const value = process.env[key];
      if (key.includes('SECRET') || key.includes('KEY')) {
        obj[key] = value ? `${value.substring(0, 7)}...` : 'not set';
      } else {
        obj[key] = value;
      }
      return obj;
    }, {} as Record<string, string | undefined>);
  
  console.log('All relevant environment variables:', envVars);
  
  // Check for secret key in any of the possible names
  let hasSecretKey = false;
  let secretKeyName = '';
  
  for (const name of possibleVarNames) {
    if (process.env[name]) {
      hasSecretKey = true;
      secretKeyName = name;
      break;
    }
  }
  
  if (!hasSecretKey) {
    throw new Error(`Stripe secret key not found in any of: ${possibleVarNames.join(', ')}`);
  }
  
  return { secretKeyName };
}

export async function POST(request: Request) {
  console.log('Starting checkout API route handler');
  
  try {
    // First, check environment variables
    let secretKeyInfo;
    try {
      secretKeyInfo = checkEnvironmentVariables();
      console.log('Environment variables check passed:', secretKeyInfo);
    } catch (envError: any) {
      console.error('Environment variable error:', envError);
      return NextResponse.json(
        { error: 'Stripe configuration error: Missing API key', details: envError.message },
        { status: 500 }
      );
    }
    
    const { priceId, type, eventId } = await request.json();
    console.log('Received checkout request with:', { priceId, type, eventId });
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check seat availability using Airtable
    const seatsModule = await import('@/lib/airtable-seats');
    const availableSeats = await seatsModule.getAvailableSeats(eventId);

    if (availableSeats <= 0) {
      return NextResponse.json(
        { error: 'Sorry, this event is sold out' },
        { status: 400 }
      );
    }
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }
    
    // Base URL for redirects
    const baseUrl = process.env.VERCEL_ENV === 'production'
      ? 'https://tarecoffeeroom.com' 
      : 'http://localhost:3001'; // Use 3001 since dev server is on 3001
    
    const successUrl = `${baseUrl}/checkout/success?type=${type}`;
    const cancelUrl = `${baseUrl}/?from=canceled`;
    
    // Log request details
    console.log('Creating checkout session with:', { 
      type, 
      priceId,
      successUrl,
      cancelUrl,
      environment: process.env.VERCEL_ENV || process.env.NODE_ENV
    });
    
    // Dynamically import the module to avoid build-time initialization
    try {
      console.log('Importing stripe module...');
      const stripeModule = await import('@/lib/stripe');
      console.log('Stripe module imported successfully');
      
      // Verify the module loaded properly
      if (!stripeModule.createCheckoutSession) {
        console.error('Failed to load Stripe module correctly');
        return NextResponse.json(
          { error: 'Internal server error: Stripe module not available' },
          { status: 500 }
        );
      }
      
      console.log('Creating checkout session...');
      const result = await stripeModule.createCheckoutSession({
        priceId,
        successUrl,
        cancelUrl,
        metadata: { eventId }
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
      
      console.log('Checkout session created successfully!');
      return NextResponse.json({ url: result.url });
    } catch (importError: any) {
      console.error('Error importing or using Stripe module:', importError);
      return NextResponse.json(
        { 
          error: 'Stripe module error',
          details: importError.message || 'Unknown import error'
        },
        { status: 500 }
      );
    }
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