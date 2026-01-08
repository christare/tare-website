import { NextResponse } from 'next/server';
import { requireAdmin } from '../../_auth';
import { getStudioBookingsTable } from '@/lib/airtable-studio';

const ALLOWED_FIELDS = new Set(['Name', 'Phone', 'Email', 'Event Date', 'Status', 'Notes']);

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { bookingId, fields } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'bookingId is required' }, { status: 400 });
    }
    if (!fields || typeof fields !== 'object') {
      return NextResponse.json({ error: 'fields object is required' }, { status: 400 });
    }

    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (ALLOWED_FIELDS.has(key)) {
        sanitized[key] = value;
      }
    }

    if (Object.keys(sanitized).length === 0) {
      return NextResponse.json({ error: 'No allowed fields provided' }, { status: 400 });
    }

    const table = getStudioBookingsTable();
    await table.update([{ id: bookingId, fields: sanitized }]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

