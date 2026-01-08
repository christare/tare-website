import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import twilio from 'twilio';
import { CURRENT_EVENT_ID } from '@/config/events';

interface GuestFormData {
  phoneNumber: string;
  preferredName: string;
  attendingWith: string;
  pronouns: string;
  coffeeRelationship: string;
  wellnessExperience: string;
  intentions: string;
  dietaryRestrictions: string;
  scentSensitivity: string;
  howHeard: string;
}

// Phone normalization utility for Airtable
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return cleaned.substring(1);
  }
  return cleaned;
}

// Format phone for Twilio (needs +1 prefix for US numbers)
function formatPhoneForTwilio(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  // If it's 10 digits, add +1
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  // If it's 11 digits starting with 1, add +
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  // Otherwise return as is with + if not there
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

function getStudioBookingsTable() {
  const airtableBaseId =
    process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID ||
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const airtableTableName =
    process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE ||
    process.env.NEXT_PUBLIC_AIRTABLE_TABLE;
  const airtablePAT = process.env.AIRTABLE_PAT || process.env.NEXT_PUBLIC_AIRTABLE_PAT;

  if (!airtableBaseId || !airtableTableName || !airtablePAT) {
    throw new Error('Missing Airtable STUDIO environment variables');
  }

  const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
  return base(airtableTableName);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
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

      // Best-effort: if this guest has a booking for the current event, copy Preferred Name into the booking's Name field.
      // This ensures the admin portal "Name" column (and confirmations) can use the preferred name even without joining tables.
      try {
        const preferredName = (formData.preferredName || '').trim();
        if (preferredName && normalizedPhone) {
          const studioTable = getStudioBookingsTable();
          // Match any record whose Phone, when stripped to digits, ends in the normalized 10 digits.
          // Update ALL matching bookings (across event dates), per admin preference.
          const filterByFormula =
            `RIGHT(REGEX_REPLACE({Phone}, '\\\\D', ''), 10) = '${normalizedPhone}'`;

          const matches = await studioTable.select({ filterByFormula }).all();
          if (!matches.length) return;

          const updates = matches.map((r) => ({
            id: r.id,
            fields: { Name: preferredName }
          }));

          for (const batch of chunk(updates, 10)) {
            await studioTable.update(batch as any);
          }

          console.log(`✅ Updated ${matches.length} STUDIO booking Name value(s) for phone ${normalizedPhone}`);
        }
      } catch (bookingUpdateError: any) {
        // Non-critical: do not fail guest form submission if we can't update the booking record.
        console.error('Failed to update STUDIO booking name (non-critical):', bookingUpdateError?.message || bookingUpdateError);
      }
      
      console.log('Successfully submitted guest form data to Airtable');
      
      // Send confirmation SMS via Twilio
      try {
        const twilioClient = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        const phoneForSMS = formatPhoneForTwilio(formData.phoneNumber);
        const name = formData.preferredName || 'there';
        
        await twilioClient.messages.create({
          to: phoneForSMS,
          from: process.env.TWILIO_PHONE_NUMBER,
          body: `Hi ${name}! Thanks for completing your TARE pre-event form. We're excited to see you soon! 🌿☕`
        });
        
        console.log('Successfully sent confirmation SMS to:', phoneForSMS);
      } catch (smsError: any) {
        // Log SMS error but don't fail the request
        console.error('Failed to send SMS (non-critical):', smsError);
      }
      
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