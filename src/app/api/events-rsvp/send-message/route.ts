import { NextResponse } from "next/server";
import twilio from "twilio";
import { requireQueueTeamAccess } from "@/app/api/queue/_auth";
import {
  formatPhoneForTwilio,
  appendMessageLog,
  getEventsRsvpTable,
} from "@/lib/airtable-events-rsvp";

export async function POST(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const recordId = String(body?.recordId ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!recordId || !message) {
      return NextResponse.json(
        { error: "recordId and message are required" },
        { status: 400 }
      );
    }

    const table = getEventsRsvpTable();
    const record = await table.find(recordId);
    const fields = record.fields as Record<string, unknown>;
    const phoneNumber = String(fields?.["Phone Number"] ?? "").trim();
    const guestName = String(fields?.["Guest Name"] ?? "").trim() || "there";

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "No phone number for this RSVP" },
        { status: 400 }
      );
    }

    const personalized = message.replace(/{name}/g, guestName);
    const to = formatPhoneForTwilio(phoneNumber);

    if (
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_PHONE_NUMBER
    ) {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await client.messages.create({
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: personalized,
      });
    }

    await appendMessageLog(recordId, `CUSTOM -> ${to}: ${personalized}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Events RSVP send-message error:", err);
    return NextResponse.json(
      { error: "Failed to send message", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
