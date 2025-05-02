import { NextResponse } from 'next/server';
import { reserveSeat, getAvailableSeats } from '@/lib/seats';

// This would ideally be tied to a Stripe webhook to confirm payment
export async function POST(request: Request) {
  try {
    const { type, secret } = await request.json();
    
    // Simple API key check - in production use a proper authentication system
    if (secret !== process.env.BOOKING_API_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    if (!type || type !== 'studio') {
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }
    
    // Check if seats are available
    const availableSeats = await getAvailableSeats();
    if (availableSeats <= 0) {
      return NextResponse.json(
        { error: 'No seats available' },
        { status: 400 }
      );
    }
    
    // Reserve a seat
    const success = await reserveSeat();
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to reserve seat' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error confirming booking:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
} 