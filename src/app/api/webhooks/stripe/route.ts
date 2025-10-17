import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import Airtable from 'airtable';

// Disable Next.js body parsing for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const airtableBaseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!;
const airtableTableName = process.env.NEXT_PUBLIC_AIRTABLE_TABLE!;
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
    
    // Extract event date from metadata
    const eventId = metadata.eventId;
    const eventDate = eventId; // In our case, eventId is the date like '2025-10-26'
    
    try {
      // Connect to Airtable
      const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
      await base(airtableTableName).create([
        {
          fields: {
            'Name': metadata.guestName || '',
            'Coffee Relationship': metadata.coffeeRelationship || '',
            'Allergies': metadata.allergies || '',
            'What Brought You': metadata.referralSource || '',
            'Meaningful Details': metadata.meaningfulDetails || '',
            'Instagram': metadata.instagram || '',
            'Created': new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }),
            'Stripe Email': session.customer_details?.email || '',
            'Stripe ID': session.id,
            'Amount Paid': session.amount_total ? session.amount_total / 100 : '',
            'Currency': session.currency || '',
            'Event Date': eventDate, // Add the event date
          }
        }
      ]);
      return NextResponse.json({ received: true });
    } catch (err) {
      console.error('Airtable error:', err);
      return NextResponse.json({ error: 'Airtable error', details: err }, { status: 500 });
    }
  }

  // Return a 200 for all other event types
  return NextResponse.json({ received: true });
} 