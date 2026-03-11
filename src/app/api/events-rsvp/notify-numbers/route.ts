import { NextResponse } from "next/server";
import { requireQueueTeamAccess } from "@/app/api/queue/_auth";

/** Format for display: (415) 707-9319 */
function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return raw || "—";
}

/**
 * GET — Team only. Returns the list of numbers that receive RSVP notifications.
 * Set RSVP_NOTIFY_PHONE in env: single number or comma-separated (e.g. "4157079319,5551234567").
 */
export async function GET(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  const raw = process.env.RSVP_NOTIFY_PHONE || "4157079319";
  const numbers = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(formatPhoneDisplay);

  return NextResponse.json({ numbers });
}
