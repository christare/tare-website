import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Phone normalization utility
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1);
  }
  return cleaned;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phoneNumber = searchParams.get('phone');

    const base = new Airtable({ 
      apiKey: process.env.AIRTABLE_PAT 
    }).base(process.env.AIRTABLE_GUESTFORM_BASE_ID!);
    
    let records;
    
    if (phoneNumber) {
      // Fetch specific guest form by normalized phone
      const normalizedPhone = normalizePhone(phoneNumber);
      records = await base(process.env.AIRTABLE_GUESTFORM_TABLE_ID!)
        .select({
          filterByFormula: `{Phone Normalized} = '${normalizedPhone}'`
        })
        .all();
    } else {
      // Fetch all guest forms
      records = await base(process.env.AIRTABLE_GUESTFORM_TABLE_ID!)
        .select()
        .all();
    }

    const guestForms = records.map(record => ({
      id: record.id,
      fields: record.fields
    }));

    return NextResponse.json({ 
      guestForms,
      total: guestForms.length 
    });
  } catch (error) {
    console.error('Error fetching guest forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch guest forms' },
      { status: 500 }
    );
  }
}

