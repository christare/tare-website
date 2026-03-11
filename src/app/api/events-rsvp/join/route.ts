import { NextResponse } from "next/server";
import twilio from "twilio";
import { BLIND_TASTE_EVENT } from "@/config/blind-taste";
import {
  createEventRsvp,
  listEventRsvps,
  formatPhoneForTwilio,
  normalizePhoneDigits,
  appendMessageLog,
} from "@/lib/airtable-events-rsvp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const guestName = String(body?.guestName ?? "").trim();
    const phoneNumberRaw = String(body?.phoneNumber ?? "").trim();

    if (!guestName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const digits = normalizePhoneDigits(phoneNumberRaw);
    if (digits.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid phone number" },
        { status: 400 }
      );
    }

    // Phone is the identity gate: if already RSVP'd, idempotent success (no duplicate)
    const existing = await listEventRsvps(BLIND_TASTE_EVENT.eventId);
    const alreadyRsvpd = existing.some(
      (r) => normalizePhoneDigits(r.phoneNumber || "") === digits
    );
    if (alreadyRsvpd) {
      return NextResponse.json({ success: true, alreadyRegistered: true });
    }

    const record = await createEventRsvp({
      eventId: BLIND_TASTE_EVENT.eventId,
      guestName,
      phoneNumber: phoneNumberRaw,
    });

    const message = BLIND_TASTE_EVENT.confirmationMessage
      .replace(/{name}/g, guestName)
      .replace(/{date}/g, BLIND_TASTE_EVENT.dateLabel)
      .replace(/{time}/g, BLIND_TASTE_EVENT.timeRange)
      .replace(/{address}/g, BLIND_TASTE_EVENT.address);

    try {
      if (
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_PHONE_NUMBER
      ) {
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
        await appendMessageLog(record.id, `CONFIRMATION SMS -> ${to}: ${message}`);

        // Notify staff on every new RSVP. RSVP_NOTIFY_PHONE = one number or comma-separated (e.g. "4157079319,5551234567")
        const notifyPhonesRaw = process.env.RSVP_NOTIFY_PHONE || "4157079319";
        const notifyPhones = notifyPhonesRaw.split(",").map((s) => s.trim()).filter(Boolean);
        const notifyBody = `TARE RSVP: ${guestName} just RSVP'd for ${BLIND_TASTE_EVENT.title}.`;
        for (const phone of notifyPhones) {
          await client.messages.create({
            to: formatPhoneForTwilio(phone),
            from: process.env.TWILIO_PHONE_NUMBER,
            body: notifyBody,
          });
        }
      }
    } catch (smsErr: any) {
      console.error("Blind test confirmation SMS failed (non-critical):", smsErr);
    }

    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    console.error("Events RSVP join error:", err);
    return NextResponse.json(
      { error: "Failed to RSVP", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
