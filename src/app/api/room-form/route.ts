import { NextResponse } from 'next/server';
import Airtable from 'airtable';

interface FormData {
  name: string;
  coffeeRelationship: string;
  allergies: string;
  referralSource: string;
  meaningfulDetails: string;
  instagram?: string;
}

export async function POST(request: Request) {
  console.log('Starting room form API route handler');
  
  try {
    const formData: FormData = await request.json();
    console.log('Received form data:', formData);
    
    // Validate required fields
    const requiredFields = ['name', 'coffeeRelationship', 'allergies', 'referralSource', 'meaningfulDetails'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]?.trim());
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: { missingFields } },
        { status: 400 }
      );
    }

    // --- Airtable submission (immediate) ---
    try {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_BASE_ID!);
      await base(process.env.AIRTABLE_TABLE_NAME!).create([
        {
          fields: {
            'Name': formData.name,
            'Coffee Relationship': formData.coffeeRelationship,
            'Allergies': formData.allergies,
            'What Brought You': formData.referralSource,
            'Meaningful Details': formData.meaningfulDetails,
            'Instagram': formData.instagram || '',
            'Created': new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
          }
        }
      ]);
    } catch (err) {
      console.error('Airtable error (room form immediate):', err);
      // Don't block checkout if Airtable fails, just log
    }
    // --- End Airtable submission ---
    
    // Base URL for redirects
    const baseUrl = process.env.VERCEL_ENV === 'production'
      ? 'https://tarestudionyc.com' 
      : 'http://localhost:3000';
    
    const successUrl = `${baseUrl}/checkout/success?type=room`;
    const cancelUrl = `${baseUrl}/?from=canceled`;
    
    // Create checkout session with form data
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
      
      console.log('Creating checkout session with form data...');
      const result = await stripeModule.createCheckoutSession({
        priceId: "price_1RflBgF5JUni5zIQrPmJVgQ1", // ROOM price ID
        successUrl,
        cancelUrl,
        metadata: {
          type: "room",
          guestName: formData.name,
          coffeeRelationship: formData.coffeeRelationship,
          allergies: formData.allergies,
          referralSource: formData.referralSource,
          meaningfulDetails: formData.meaningfulDetails,
          instagram: formData.instagram || "",
          formSubmittedAt: new Date().toISOString()
        }
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
      
      console.log('Checkout session created successfully with form data!');
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
    console.error('Unexpected room form error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 