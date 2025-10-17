import { NextResponse } from 'next/server';
import { getEventBookings } from '@/lib/airtable-seats';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventDate = searchParams.get('eventId');

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
