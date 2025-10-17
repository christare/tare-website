import { NextResponse } from 'next/server';
import { getAvailableSeats } from '@/lib/airtable-seats';

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
