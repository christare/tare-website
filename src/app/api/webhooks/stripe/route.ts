import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Airtable from 'airtable';
import { CURRENT_EVENT_ID } from '@/config/events';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
// Use STUDIO-specific variables with fallback to general ones
const airtableBaseId = process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID || process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!;
const airtableTableName = process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE || process.env.NEXT_PUBLIC_AIRTABLE_TABLE!;
const airtablePAT = process.env.NEXT_PUBLIC_AIRTABLE_PAT!;

export async function POST(req: Request) {
  let event: Stripe.Event;
  try {
    // Stripe requires the raw body to verify the signature
    // Next.js edge API routes don't support req.body as a buffer, so we use req.arrayBuffer()
    const rawBody = await req.arrayBuffer();
    const sig = req.headers.get('stripe-signature')!;
    
    event = stripe.webhooks.constructEvent(Buffer.from(rawBody), sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    
    // Always use the current event from central config - don't rely on Stripe metadata
    const eventDate = CURRENT_EVENT_ID;
    
    // Safety check - make sure we have a valid event date
    if (!eventDate) {
      console.error('❌ CRITICAL: CURRENT_EVENT_ID is undefined! Event Date will not be saved.');
    }
    
    // Log successful payment/booking (including free ones)
    console.log('🎫 Checkout completed:', {
      sessionId: session.id,
      email: session.customer_details?.email,
      amount: session.amount_total,
      isFree: session.amount_total === 0,
      eventDate: eventDate,
      eventDateType: typeof eventDate,
      eventDateValue: JSON.stringify(eventDate)
    });
    
    try {
      // Connect to Airtable
      const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
      
      // Extract booking type from metadata or default to 'TARE STUDIO'
      const bookingType = metadata.bookingType || 'TARE STUDIO';
      
      // Get promo code info if available
      let promoInfo = '';
      if (session.total_details?.amount_discount && session.total_details.amount_discount > 0) {
        promoInfo = 'Promo code applied';
      }
      
      const fieldsToSave = {
        'Name': session.customer_details?.name || metadata.guestName || '',
        'Phone': session.customer_details?.phone || '',
        'Email': session.customer_details?.email || '',
        'Amount Paid': `$${session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00'}`,
        'Coupon Used': promoInfo,
        'Event': bookingType,
        'Event Date': eventDate,
      };
      
      console.log('📝 Attempting to save to Airtable with fields:', fieldsToSave);
      
      const airtableRecord = await base(airtableTableName).create([
        {
          fields: fieldsToSave
        }
      ]);
      
      console.log('✅ Successfully saved to Airtable:', {
        recordId: airtableRecord[0].id,
        eventDate: eventDate,
        email: session.customer_details?.email,
        actualFieldsSaved: airtableRecord[0].fields
      });
      
      return NextResponse.json({ received: true });
    } catch (err) {
      console.error('Airtable error:', err);
      return NextResponse.json({ error: 'Airtable error', details: err }, { status: 500 });
    }
  }

  // Return a 200 for all other event types
  return NextResponse.json({ received: true });
} 