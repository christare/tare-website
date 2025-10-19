import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import twilio from 'twilio';
import { CURRENT_EVENT_CONFIG } from '@/config/events';

// Format phone for Twilio (needs +1 prefix for US numbers)
function formatPhoneForTwilio(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
}

// Format date for message (e.g., "Sunday, October 26th")
function formatEventDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00'); // Add time to avoid timezone issues
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options);
}

// Generate confirmation message
function generateConfirmationMessage(name: string | null, eventDate: string): string {
  const formattedDate = formatEventDate(eventDate);
  const greeting = name ? `Hey ${name}` : 'Hey there';
  
  return `${greeting}, your spot at TARE on ${formattedDate} is confirmed.

Complete your pre-event form, which will help us tailor the experience to our group:
tarestudionyc.com/form

📍 ${CURRENT_EVENT_CONFIG.address}

🕐 ${CURRENT_EVENT_CONFIG.eventTime}
   Doors open: ${CURRENT_EVENT_CONFIG.doorsOpen}

When you arrive, buzz ${CURRENT_EVENT_CONFIG.buzzer} on the intercom or text ${CURRENT_EVENT_CONFIG.contactName} at ${CURRENT_EVENT_CONFIG.contactPhone}.`;
}

export async function POST(request: Request) {
  try {
    const { bookingId, customMessage } = await request.json();
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Get booking from Airtable - use STUDIO-specific variables with fallback
    const airtableBaseId = process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID || process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
    const airtableTableName = process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE || process.env.NEXT_PUBLIC_AIRTABLE_TABLE;
    const airtablePAT = process.env.AIRTABLE_PAT || process.env.NEXT_PUBLIC_AIRTABLE_PAT;

    if (!airtableBaseId || !airtableTableName || !airtablePAT) {
      return NextResponse.json(
        { error: 'Missing Airtable configuration' },
        { status: 500 }
      );
    }

    const base = new Airtable({ 
      apiKey: airtablePAT 
    }).base(airtableBaseId);

    const record = await base(airtableTableName).find(bookingId);
    
    if (!record) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const fields = record.fields as any;
    const phone = fields['Phone'];
    const name = fields['Name'] || null;
    const eventDate = fields['Event'] || CURRENT_EVENT_CONFIG.eventId;

    if (!phone) {
      return NextResponse.json(
        { error: 'No phone number found for this booking' },
        { status: 400 }
      );
    }

    // Use custom message if provided, otherwise generate default
    const message = customMessage || generateConfirmationMessage(name, eventDate);

    // Send SMS via Twilio
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const phoneForSMS = formatPhoneForTwilio(phone);
    
    await twilioClient.messages.create({
      to: phoneForSMS,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: message
    });

    console.log('Successfully sent confirmation SMS to:', phoneForSMS);

    // Update Airtable record
    await base(airtableTableName).update([
      {
        id: bookingId,
        fields: {
          'Confirmation Text Sent': true,
          'Confirmation Message': message,
          'Confirmation Sent At': new Date().toISOString()
        }
      }
    ]);

    return NextResponse.json({ 
      success: true,
      message: 'Confirmation SMS sent successfully',
      sentTo: phoneForSMS,
      messageContent: message
    });

  } catch (error: any) {
    console.error('Error sending confirmation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send confirmation',
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

