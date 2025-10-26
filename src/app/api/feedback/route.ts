import { NextResponse } from 'next/server';
import Airtable from 'airtable';

interface FeedbackFormData {
  phone: string;
  name: string;
  stoodOut: string;
  different: string;
  improve: string;
  recommendScore: string;
  testimonial: string;
}

// Phone normalization utility for Airtable
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1);
  }
  return cleaned;
}

export async function POST(request: Request) {
  console.log('Starting feedback form API route handler');
  
  try {
    const formData: FeedbackFormData = await request.json();
    console.log('Received feedback form data:', formData);

    // Validate required field
    if (!formData.phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Submit to Airtable
    try {
      const base = new Airtable({ apiKey: process.env.AIRTABLE_PAT }).base(process.env.AIRTABLE_FEEDBACK_BASE_ID!);
      const normalizedPhone = normalizePhone(formData.phone || '');
      
      const fields: Record<string, any> = {
        'Phone': formData.phone || '',
        'Name': formData.name || '',
        'Stood Out': formData.stoodOut || '',
        'Different': formData.different || '',
        'Improve': formData.improve || '',
        'Testimonial': formData.testimonial || '',
      };

      // Only add Recommend Score if it has a value
      if (formData.recommendScore) {
        fields['Recommend Score'] = parseInt(formData.recommendScore);
      }

      await base(process.env.AIRTABLE_FEEDBACK_TABLE_ID!).create([
        {
          fields
        }
      ]);
      
      console.log('Successfully submitted feedback to Airtable');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Feedback submitted successfully' 
      });
      
    } catch (airtableError: any) {
      console.error('Airtable error (feedback form):', airtableError);
      return NextResponse.json(
        { 
          error: 'Failed to save feedback',
          details: airtableError.message || 'Airtable submission error'
        },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('Unexpected feedback form error:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

