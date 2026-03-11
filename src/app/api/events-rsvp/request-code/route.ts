import { NextResponse } from "next/server";
import twilio from "twilio";
import { BLIND_TASTE_EVENT } from "@/config/blind-taste";
import {
  formatPhoneForTwilio,
  normalizePhoneDigits,
} from "@/lib/airtable-events-rsvp";
import { setPending } from "@/lib/rsvp-verify-store";

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

    const code = setPending(digits, guestName);

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
        body: BLIND_TASTE_EVENT.verificationMessage(code),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Events RSVP request-code error:", err);
    return NextResponse.json(
      { error: "Failed to send code", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
