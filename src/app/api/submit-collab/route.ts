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
    
    // Log API call for debugging
    console.log('Collaboration form submission initiated - v2');
    
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

    // Check for both NEXT_PUBLIC and regular environment variables
    // This provides more flexibility between local dev and production
    const apiKey = process.env.AIRTABLE_API_KEY || process.env.NEXT_PUBLIC_AIRTABLE_PAT;
    
    // Hardcoded values for simplicity and reliability
    const baseId = "app5FlzWXABXOwfXw"; // TARE PRIVATE Base ID
    const tableName = "TARE PRIVATE Inquiries"; // Table name
    
    console.log('Environment check:');
    console.log('- API Key exists:', !!apiKey);
    console.log('- Using Base ID:', baseId);
    console.log('- Using Table Name:', tableName);
    
    if (!apiKey) {
      console.error('Missing Airtable API key');
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }
    
    if (!baseId) {
      console.error('Missing Airtable Base ID');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Base ID' },
        { status: 500 }
      );
    }
    
    if (!tableName) {
      console.error('Missing Airtable Table name');
      return NextResponse.json(
        { error: 'Server configuration error: Missing Table name' },
        { status: 500 }
      );
    }

    console.log(`Submitting to Airtable: ${tableName} in base: ${baseId}`);
    console.log('Field names:', Object.keys(record.fields).join(', '));

    // Send the data to Airtable
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    console.log('Airtable API URL:', airtableUrl);
    
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ records: [record] })
    });

    // Log response status
    console.log('Airtable response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API error:', JSON.stringify(errorData));
      return NextResponse.json(
        { error: `Failed to submit to Airtable: ${errorData?.error?.message || response.status}` },
        { status: 500 }
      );
    }

    const result = await response.json();
    console.log('Success - record created with ID:', result.records[0].id);
    
    return NextResponse.json({ success: true, id: result.records[0].id });
  } catch (error) {
    console.error('Unhandled error in submit-collab API:', error);
    return NextResponse.json(
      { error: 'Failed to process request: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 