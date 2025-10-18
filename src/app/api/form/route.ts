import { NextResponse } from 'next/server';
import Airtable from 'airtable';

interface GuestFormData {
  phoneNumber: string;
  preferredName: string;
  attendingWith: string;
  attendingWithWho: string;
  pronouns: string;
  coffeeRelationship: string;
  wellnessExperience: string;
  intentions: string;
  dietaryRestrictions: string;
  scentSensitivity: string;
  howHeard: string;
}

// Phone normalization utility
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1);
  }
  return cleaned;
}

export async function POST(request: Request) {
  console.log('Starting guest form API route handler');
  
  try {
    const formData: GuestFormData = await request.json();
    console.log('Received guest form data:', formData);

    // Submit to Airtable
    try {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_GUESTFORM_BASE_ID!);
      const normalizedPhone = normalizePhone(formData.phoneNumber || '');
      
      await base(process.env.AIRTABLE_GUESTFORM_TABLE_ID!).create([
        {
          fields: {
            'Phone Number': formData.phoneNumber || '',
            'Phone Normalized': normalizedPhone,
            'Preferred Name': formData.preferredName || '',
            'Attending With': formData.attendingWith || '',
            'Attending With Who': formData.attendingWithWho || '',
            'Pronouns': formData.pronouns || '',
            'Coffee Relationship': formData.coffeeRelationship || '',
            'Wellness Experience': formData.wellnessExperience || '',
            'Intentions': formData.intentions || '',
            'Dietary Restrictions': formData.dietaryRestrictions || '',
            'Scent Sensitivity': formData.scentSensitivity || '',
            'How Heard': formData.howHeard || '',
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