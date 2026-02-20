import { NextResponse } from "next/server";
import { isAdminSessionValidFromRequest } from "@/lib/admin-session";

export function requireQueueTeamAccess(request: Request): NextResponse | null {
  if (isAdminSessionValidFromRequest(request)) return null;

  const providedPin = request.headers.get("x-queue-pin") || "";
  if (!/tare/i.test(providedPin)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

