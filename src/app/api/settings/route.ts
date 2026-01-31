import { NextResponse } from 'next/server';
import { getSalesSettings } from '@/lib/airtable-settings';

export async function GET() {
  try {
    const settings = await getSalesSettings();
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json(
      { salesOpen: true, message: null },
      { status: 200 }
    );
  }
}

