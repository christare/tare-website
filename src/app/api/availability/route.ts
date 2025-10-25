import { NextResponse } from 'next/server';
import { getAvailableSeats } from '@/lib/airtable-seats';
import { CURRENT_EVENT_CONFIG } from '@/config/events';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventDate = searchParams.get('eventId'); // eventId is actually the date
    
    if (!eventDate) {
      return NextResponse.json(
        { error: 'eventId (event date) required' },
        { status: 400 }
      );
    }
    
    // If bookings are closed, return 0 seats available
    if (CURRENT_EVENT_CONFIG.bookingsClosed) {
      return NextResponse.json({ 
        available: 0,
        soldOut: true
      });
    }
    
    const availableSeats = await getAvailableSeats(eventDate);
    
    return NextResponse.json({ 
      available: availableSeats,
      soldOut: availableSeats <= 0
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
