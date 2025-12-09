import { NextResponse } from 'next/server';
import { getEventBookings } from '@/lib/airtable-seats';
import { CURRENT_EVENT_ID } from '@/config/events';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // Always default to current event date from config
    const eventDate = searchParams.get('eventId') || CURRENT_EVENT_ID;

    if (!eventDate) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const bookings = await getEventBookings(eventDate);
    return NextResponse.json({ eventId: eventDate, bookings, totalBookings: bookings.length });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
