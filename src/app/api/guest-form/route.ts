import { NextResponse } from 'next/server';
import Airtable from 'airtable';

interface GuestFormData {
  preferredName: string;
  allergies: string;
  coffeeRelationship: string;
  excitement: string;
  meaningfulDetails: string;
  joiningTogether: string;
  photoConsent: string;
}

export async function POST(request: Request) {
  console.log('Starting guest form API route handler');
  
  try {
    const formData: GuestFormData = await request.json();
    console.log('Received guest form data:', formData);

    // Submit to Airtable
    try {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_GUESTFORM_BASE_ID!);
      
      await base(process.env.AIRTABLE_GUESTFORM_TABLE_ID!).create([
        {
          fields: {
            'Preferred Name': formData.preferredName || '',
            'Allergies and Dietary': formData.allergies || '',
            'Coffee Relationship': formData.coffeeRelationship || '',
            'Excited or Curious': formData.excitement || '',
            'How to Make It Meaningful': formData.meaningfulDetails || '',
            'Attending With': formData.joiningTogether || '',
            'Comfortable with Photos': formData.photoConsent || '',
          }
        }
      ]);
      
      console.log('Successfully submitted guest form data to Airtable');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Guest preferences submitted successfully' 
      });
      
    } catch (airtableError: any) {
      console.error('Airtable error (guest form):', airtableError);
      return NextResponse.json(
        { 
          error: 'Failed to save preferences',
          details: airtableError.message || 'Airtable submission error'
        },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Unexpected guest form error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}