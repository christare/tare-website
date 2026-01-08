import { NextResponse } from 'next/server';
import { requireAdmin } from '../../_auth';
import { getStudioBookingsTable } from '@/lib/airtable-studio';

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { bookingId } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });
    }

    const table = getStudioBookingsTable();
    await table.update([{ id: bookingId, fields: { Status: 'Cancelled' } }]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

