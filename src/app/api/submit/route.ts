import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable with Personal Access Token
const base = new Airtable({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_PAT
}).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

// Validation functions
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string) => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  // Check if it's a valid US phone number (10 digits)
  return digitsOnly.length === 10;
};

const formatPhone = (phone: string) => {
  const digitsOnly = phone.replace(/\D/g, '');
  return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate email
    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate and format phone
    if (!isValidPhone(data.phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit phone number' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhone(data.phone);
    
    console.log('Submitting to Airtable with:', {
      baseId: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID,
      table: process.env.NEXT_PUBLIC_AIRTABLE_TABLE,
      data: {
        ...data,
        phone: formattedPhone
      }
    });
    
    // Create record in Airtable
    const record = await base(process.env.NEXT_PUBLIC_AIRTABLE_TABLE!).create([
      {
        fields: {
          'First Name': data.firstName,
          'Last Name': data.lastName,
          'Phone': formattedPhone,
          'Email': data.email,
          'Instagram': data.instagram || '',
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