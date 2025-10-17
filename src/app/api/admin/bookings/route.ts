import { NextResponse } from 'next/server';
import { getEventBookings } from '@/lib/seats';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId required' },
        { status: 400 }
      );
    }
    
    const bookings = await getEventBookings(eventId);
    
    return NextResponse.json({ 
      eventId,
      bookings,
      totalBookings: bookings.length
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
