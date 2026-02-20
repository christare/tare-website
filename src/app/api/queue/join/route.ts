import { NextResponse } from "next/server";
import { createQueueRecord, normalizePhoneDigits } from "@/lib/airtable-queue";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const guestName = String(body?.guestName || "").trim();
    const phoneNumberRaw = String(body?.phoneNumber || "").trim();
    const partySize = Number(body?.partySize);
    const notes = typeof body?.notes === "string" ? body.notes : "";
    const specialRequests =
      typeof body?.specialRequests === "string" ? body.specialRequests : "";
    const textCallPreference =
      body?.textCallPreference === "call" ? "call" : "text";

    if (!guestName) {
      return NextResponse.json(
        { error: "Guest Name is required" },
        { status: 400 }
      );
    }

    const digits = normalizePhoneDigits(phoneNumberRaw);
    if (digits.length < 10) {
      return NextResponse.json(
        { error: "Phone Number looks invalid" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(partySize) || partySize < 1 || partySize > 12) {
      return NextResponse.json(
        { error: "Party Size must be between 1 and 12" },
        { status: 400 }
      );
    }

    const record = await createQueueRecord({
      guestName,
      phoneNumber: phoneNumberRaw,
      partySize: Math.round(partySize),
      notes,
      specialRequests,
      textCallPreference,
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error("Queue join error:", error);
    return NextResponse.json(
      { error: "Failed to join queue", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

