import { NextResponse } from "next/server";
import {
  listEventRsvps,
  listPublicAttendees,
  normalizePhoneDigits,
} from "@/lib/airtable-events-rsvp";
import { BLIND_TASTE_EVENT } from "@/config/blind-taste";

/**
 * GET ?eventId=xxx
 *   Public list: returns { attendees: string[] } (first name + last initial, opted-in only).
 *
 * GET ?eventId=xxx&phone=5551234567
 *   Identity lookup: returns { found: boolean, attendees: string[] } — other guests (display names).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || BLIND_TASTE_EVENT.eventId;
    const phoneRaw = searchParams.get("phone")?.trim() || "";

    // Public list (no phone): Who's Coming for social proof
    if (!phoneRaw || normalizePhoneDigits(phoneRaw).length < 10) {
      const attendees = await listPublicAttendees(eventId);
      return NextResponse.json({ attendees });
    }

    const digits = normalizePhoneDigits(phoneRaw);
    const records = await listEventRsvps(eventId);
    const match = records.find(
      (r) => normalizePhoneDigits(r.phoneNumber || "") === digits
    );

    if (!match) {
      return NextResponse.json({ found: false, attendees: [] });
    }

    // Return full public list so "You're on the list" can show everyone (including this guest)
    const attendees = await listPublicAttendees(eventId);
    return NextResponse.json({ found: true, attendees });
  } catch (err: any) {
    console.error("Events RSVP attendees error:", err);
    return NextResponse.json(
      { error: "Failed to load attendees", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
