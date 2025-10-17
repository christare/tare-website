// Manual seat reservation API for testing
// POST /api/reserve-seat

import { NextResponse } from 'next/server';
import { reserveSeat, recordBooking } from '@/lib/seats';

export async function POST(request: Request) {
  try {
    const { eventId, customerEmail, amountPaid } = await request.json();
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId required' },
        { status: 400 }
      );
    }
    
    // Reserve the seat
    const reserved = await reserveSeat(eventId);
    
    if (!reserved) {
      return NextResponse.json(
        { error: 'No seats available' },
        { status: 400 }
      );
    }
    
    // Record the booking
    await recordBooking({
      eventId,
      stripeSessionId: 'manual_' + Date.now(),
      customerEmail: customerEmail || 'test@example.com',
      amountPaid: amountPaid || 9000,
      bookingType: 'studio'
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Seat reserved successfully'
    });
    
  } catch (error) {
    console.error('Error reserving seat:', error);
    return NextResponse.json(
      { error: 'Failed to reserve seat' },
      { status: 500 }
    );
  }
}
