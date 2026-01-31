import { NextResponse } from 'next/server';
import { requireAdmin } from '../_auth';
import { getSalesSettings, updateSalesSettings } from '@/lib/airtable-settings';

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const settings = await getSalesSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    await updateSalesSettings({
      salesOpen: Boolean(body.salesOpen),
      message: body.message ?? null,
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update settings', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

