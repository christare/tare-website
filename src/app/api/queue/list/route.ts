import { NextResponse } from "next/server";
import { listQueueRecords } from "@/lib/airtable-queue";
import { requireQueueTeamAccess } from "../_auth";

export async function GET(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const includeArchive = searchParams.get("includeArchive") === "1";

    const records = await listQueueRecords({ includeArchive });
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error("Queue list error:", error);
    return NextResponse.json(
      { error: "Failed to list queue", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

