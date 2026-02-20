import { NextResponse } from "next/server";
import twilio from "twilio";
import {
  QueueFields,
  appendQueueLog,
  createQueueRecord,
  formatPhoneForTwilio,
  getQueueTableForServer,
  normalizePhoneDigits,
} from "@/lib/airtable-queue";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const guestName = String(body?.guestName || "").trim();
    const phoneNumberRaw = String(body?.phoneNumber || "").trim();
    const partySize = Number(body?.partySize);
    const notes = typeof body?.notes === "string" ? body.notes : "";
    const specialRequests =
      typeof body?.specialRequests === "string" ? body.specialRequests : "";

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
      textCallPreference: "text",
    });

    // Best-effort: send confirmation SMS with queue position
    try {
      if (
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
      ) {
        const table = getQueueTableForServer();
        const waitingRecords = await table
          .select({
            filterByFormula: `{${QueueFields.status}} = 'waiting'`,
            sort: [{ field: QueueFields.sortOrder, direction: "asc" }],
            pageSize: 200,
          })
          .all();

        const idx = waitingRecords.findIndex((r: any) => r.id === record.id);
        const position = idx >= 0 ? idx + 1 : null;

        const template =
          process.env.QUEUE_JOIN_CONFIRMATION_MESSAGE ||
          "You're in the tasting queue, {name}. Spot: {position}. We'll text you when it's your turn.";
        const message = template
          .replaceAll("{name}", guestName)
          .replaceAll("{position}", position ? String(position) : "—");

        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        const to = formatPhoneForTwilio(phoneNumberRaw);

        await client.messages.create({
          to,
          from: process.env.TWILIO_PHONE_NUMBER,
          body: message,
        });

        await appendQueueLog(record.id, `JOIN_CONFIRMATION -> SMS to ${to}: ${message}`);
      }
    } catch (smsError: any) {
      console.error("Queue join confirmation SMS failed (non-critical):", smsError);
    }

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    console.error("Queue join error:", error);
    return NextResponse.json(
      { error: "Failed to join queue", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

