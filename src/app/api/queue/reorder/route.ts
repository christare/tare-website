import { NextResponse } from "next/server";
import { batchUpdateQueueRecords, QueueFields } from "@/lib/airtable-queue";
import { requireQueueTeamAccess } from "../_auth";

export async function POST(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const orderedIds: string[] = Array.isArray(body?.orderedIds)
      ? body.orderedIds.map((x: any) => String(x))
      : [];

    if (!orderedIds.length) {
      return NextResponse.json(
        { error: "orderedIds required" },
        { status: 400 }
      );
    }

    const updates = orderedIds.map((id, idx) => ({
      id,
      fields: { [QueueFields.sortOrder]: idx + 1 },
    }));

    const records = await batchUpdateQueueRecords(updates);
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error("Queue reorder error:", error);
    return NextResponse.json(
      {
        error: "Failed to reorder queue",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

