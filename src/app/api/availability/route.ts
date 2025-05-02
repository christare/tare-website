import { NextResponse } from 'next/server';
import { getAvailableSeats } from '@/lib/seats';

export async function GET(request: Request) {
  try {
    // Get event type from query string
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    if (!type || type !== 'studio') {
      return NextResponse.json(
        { available: true }, // Default to available for non-studio events
        { status: 200 }
      );
    }
    
    // Check availability for studio
    const availableSeats = await getAvailableSeats();
    
    // Only return boolean availability, not the count
    return NextResponse.json(
      { available: availableSeats > 0 },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Error checking availability' },
      { status: 500 }
    );
  }
} 