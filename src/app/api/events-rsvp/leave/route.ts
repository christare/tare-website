import { NextResponse } from "next/server";
import { removeEventRsvp, normalizePhoneDigits } from "@/lib/airtable-events-rsvp";
import { BLIND_TASTE_EVENT } from "@/config/blind-taste";

/**
 * POST { "eventId": "optional", "phoneNumber": "5551234567" }
 * Removes the RSVP for this phone (identity). Idempotent: 200 even if not found.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const eventId = (body?.eventId || BLIND_TASTE_EVENT.eventId) as string;
    const phoneRaw = String(body?.phoneNumber ?? "").trim();

    const digits = normalizePhoneDigits(phoneRaw);
    if (digits.length < 10) {
      return NextResponse.json(
        { error: "Valid phone number required" },
        { status: 400 }
      );
    }

    const removed = await removeEventRsvp(eventId, digits);
    return NextResponse.json({ success: true, removed });
  } catch (err: any) {
    console.error("Events RSVP leave error:", err);
    return NextResponse.json(
      { error: "Failed to remove RSVP", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
