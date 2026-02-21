import { NextResponse } from "next/server";
import twilio from "twilio";
import {
  QueueFields,
  appendQueueLog,
  formatPhoneForTwilio,
  getQueueTableForServer,
  updateQueueRecord,
} from "@/lib/airtable-queue";
import { requireQueueTeamAccess } from "../_auth";

function getNotifyTemplate() {
  return (
    process.env.QUEUE_NOTIFY_MESSAGE ||
    "Hi {name}! Your guided tasting is ready. Please return to the tasting station within 5 minutes."
  );
}

export async function POST(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const recordId = String(body?.recordId || "").trim();

    if (!recordId) {
      return NextResponse.json(
        { error: "recordId required" },
        { status: 400 }
      );
    }

    // Enforce max SMS count server-side (join confirmation + one notify).
    const table = getQueueTableForServer();
    const record = await table.find(recordId);
    const fields = record.fields as any;
    const phoneNumber = String(fields?.["Phone Number"] || "").trim();
    const guestName = String(fields?.["Guest Name"] || "").trim() || "there";
    const currentAttempts = Number(fields?.["Attempt Counter"] || 0) || 0;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "No phone number found for this record" },
        { status: 400 }
      );
    }

    if (currentAttempts >= 2) {
      return NextResponse.json(
        { error: "Max texts already sent for this guest" },
        { status: 409 }
      );
    }

    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const to = formatPhoneForTwilio(phoneNumber);
    const template = getNotifyTemplate();
    const message = template.replaceAll("{name}", guestName);

    await twilioClient.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: message,
    });

    const now = new Date().toISOString();
    await updateQueueRecord(recordId, {
      [QueueFields.status]: "notified",
      [QueueFields.lastNotifiedAt]: now,
      [QueueFields.attemptCounter]: currentAttempts + 1,
    });

    await appendQueueLog(recordId, `NOTIFY -> SMS to ${to}: ${message}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Queue notify error:", error);
    return NextResponse.json(
      {
        error: "Failed to notify guest",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

