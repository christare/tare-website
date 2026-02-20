import { NextResponse } from "next/server";
import {
  QueueFields,
  QueueStatus,
  TextCallPreference,
  updateQueueRecord,
  appendQueueLog,
} from "@/lib/airtable-queue";
import { requireQueueTeamAccess } from "../_auth";

function isQueueStatus(value: unknown): value is QueueStatus {
  return (
    value === "waiting" ||
    value === "notified" ||
    value === "in_service" ||
    value === "served" ||
    value === "skipped" ||
    value === "no_show" ||
    value === "removed" ||
    value === "error"
  );
}

function isTextCallPreference(value: unknown): value is TextCallPreference {
  return value === "text" || value === "call";
}

export async function POST(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const recordId = String(body?.recordId || "").trim();
    if (!recordId) {
      return NextResponse.json({ error: "recordId required" }, { status: 400 });
    }

    const fields: Record<string, unknown> = {};

    if (isQueueStatus(body?.status)) fields[QueueFields.status] = body.status;
    if (typeof body?.claimedBy === "string")
      fields[QueueFields.claimedBy] = body.claimedBy;
    if (typeof body?.claimedAt === "string")
      fields[QueueFields.claimedAt] = body.claimedAt;
    if (typeof body?.lastNotifiedAt === "string")
      fields[QueueFields.lastNotifiedAt] = body.lastNotifiedAt;
    if (typeof body?.servedTimestamp === "string")
      fields[QueueFields.servedTimestamp] = body.servedTimestamp;
    if (typeof body?.checkInTimestamp === "string")
      fields[QueueFields.checkInTimestamp] = body.checkInTimestamp;
    if (typeof body?.notes === "string") fields[QueueFields.notes] = body.notes;
    if (typeof body?.specialRequests === "string")
      fields[QueueFields.specialRequests] = body.specialRequests;
    if (isTextCallPreference(body?.textCallPreference))
      fields[QueueFields.textCallPreference] = body.textCallPreference;
    if (typeof body?.attemptCounter === "number")
      fields[QueueFields.attemptCounter] = Math.max(0, Math.round(body.attemptCounter));
    if (typeof body?.priorityFlagVip === "boolean")
      fields[QueueFields.priorityFlagVip] = body.priorityFlagVip;
    if (typeof body?.reAddedToQueue === "boolean")
      fields[QueueFields.reAddedToQueue] = body.reAddedToQueue;
    if (typeof body?.skipReason === "string")
      fields[QueueFields.skipReason] = body.skipReason;
    if (typeof body?.noShowReason === "string")
      fields[QueueFields.noShowReason] = body.noShowReason;
    if (typeof body?.sortOrder === "number")
      fields[QueueFields.sortOrder] = Math.round(body.sortOrder);

    if (Object.keys(fields).length) {
      const record = await updateQueueRecord(recordId, fields);
      if (typeof body?.appendLog === "string" && body.appendLog.trim()) {
        await appendQueueLog(recordId, body.appendLog.trim());
      }
      return NextResponse.json({ success: true, record });
    }

    if (typeof body?.appendLog === "string" && body.appendLog.trim()) {
      const record = await appendQueueLog(recordId, body.appendLog.trim());
      return NextResponse.json({ success: true, record });
    }

    return NextResponse.json(
      { error: "No updatable fields provided" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Queue update error:", error);
    return NextResponse.json(
      { error: "Failed to update queue", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

