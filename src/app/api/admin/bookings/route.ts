import { NextResponse } from 'next/server';
import { getAllBookings, getEventBookings } from '@/lib/airtable-seats';
import { CURRENT_EVENT_ID } from '@/config/events';
import { requireAdmin } from '../_auth';

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    // Always default to current event date from config
    const eventDate = searchParams.get('eventId') || CURRENT_EVENT_ID;
    const scope = searchParams.get('scope') || 'current';

    if (!eventDate && scope !== 'all') {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const bookings = scope === 'all' ? await getAllBookings() : await getEventBookings(eventDate);
    return NextResponse.json({ eventId: eventDate, bookings, totalBookings: bookings.length });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
