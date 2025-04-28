import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable with Personal Access Token
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_PAT
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    console.log('Submitting to Airtable with:', {
      baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID,
      table: process.env.NEXT_PUBLIC_AIRTABLE_TABLE,
      data
    });
    
    // Create record in Airtable
    const record = await base(process.env.NEXT_PUBLIC_AIRTABLE_TABLE!).create([
      {
        fields: {
          'First Name': data.firstName,
          'Last Name': data.lastName,
          'Phone': data.phone,
          'Email': data.email,
          'Why': data.why || '',
        }
      }
    ]);

    return NextResponse.json({ success: true, record: record[0] });
  } catch (error) {
    console.error('Error submitting to Airtable:', error);
    return NextResponse.json(
      { error: 'Failed to submit form', details: error },
      { status: 500 }
    );
  }
}