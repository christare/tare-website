import { NextResponse } from "next/server";
import { listEventRsvps } from "@/lib/airtable-events-rsvp";
import { BLIND_TASTE_EVENT } from "@/config/blind-taste";
import { requireQueueTeamAccess } from "@/app/api/queue/_auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId") || BLIND_TASTE_EVENT.eventId;
    const records = await listEventRsvps(eventId);
    return NextResponse.json({ success: true, records, event: BLIND_TASTE_EVENT });
  } catch (err: any) {
    console.error("Events RSVP list error:", err);
    return NextResponse.json(
      { error: "Failed to list RSVPs", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
