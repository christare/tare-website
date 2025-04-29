import { NextResponse } from 'next/server';

// Define the shape of the form data
interface CollabFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  experienceType: string;
  dateStart: string;
  dateEnd: string;
  preferredTime: string;
  guestCount: string;
  location: string;
  details: string;
  dateSubmitted: string;
}

export async function POST(request: Request) {
  try {
    // Get form data from request
    const formData: CollabFormData = await request.json();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare the record for Airtable
    const record = {
      fields: {
        "First Name": formData.firstName,
        "Last Name": formData.lastName,
        "Email": formData.email,
        "Phone": formData.phone,
        "Company/Brand Name": formData.company || '',
        "Experience Type": formData.experienceType,
        "Preferred Date (Start)": formData.dateStart,
        "Preferred Date (End)": formData.dateEnd || '',
        "Preferred Time": formData.preferredTime,
        "Guest Count": parseInt(formData.guestCount) || 0,
        "Location": formData.location,
        "Details": formData.details || '',
        "Date Submitted": formData.dateSubmitted
      }
    };

    // Get environment variables - specifically for the collab page
    const apiKey = process.env.NEXT_PUBLIC_AIRTABLE_PAT;
    const baseId = process.env.COLLAB_AIRTABLE_BASE_ID;
    const tableName = process.env.COLLAB_AIRTABLE_TABLE;
    
    if (!apiKey || !baseId || !tableName) {
      console.error('Missing Airtable configuration for collab form');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log(`Submitting collab form to Airtable table: ${tableName} in base: ${baseId}`);
    console.log('Field names:', Object.keys(record.fields).join(', '));

    // Send the data to Airtable
    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: [record] })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to submit to Airtable' },
        { status: 500 }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({ success: true, id: result.records[0].id });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 