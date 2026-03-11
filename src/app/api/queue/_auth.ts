import { NextResponse } from "next/server";
import { isAdminSessionValidFromRequest } from "@/lib/admin-session";

export function requireQueueTeamAccess(request: Request): NextResponse | null {
  if (isAdminSessionValidFromRequest(request)) return null;

  // Accept any password that contains "tare" in any case (e.g. tare, TARE, mytare)
  const providedPin = request.headers.get("x-queue-pin") || "";
  if (!providedPin.toLowerCase().includes("tare")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

