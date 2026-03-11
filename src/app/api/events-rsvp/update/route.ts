import { NextResponse } from "next/server";
import { updateEventRsvpShowOnList } from "@/lib/airtable-events-rsvp";
import { requireQueueTeamAccess } from "@/app/api/queue/_auth";

/**
 * PATCH { "recordId": "recXXX", "showOnList": true | false }
 * Team only. Updates whether the guest appears on the public "Who's Coming" list.
 */
export async function PATCH(request: Request) {
  const unauthorized = requireQueueTeamAccess(request);
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json().catch(() => ({}));
    const recordId = String(body?.recordId ?? "").trim();
    const showOnList = body?.showOnList;

    if (!recordId) {
      return NextResponse.json({ error: "recordId required" }, { status: 400 });
    }
    if (typeof showOnList !== "boolean") {
      return NextResponse.json({ error: "showOnList must be true or false" }, { status: 400 });
    }

    await updateEventRsvpShowOnList(recordId, showOnList);
    return NextResponse.json({ success: true, showOnList });
  } catch (err: any) {
    const isUnknownField =
      err?.error === "UNKNOWN_FIELD_NAME" ||
      err?.message?.includes("Unknown field name");
    if (isUnknownField) {
      return NextResponse.json(
        {
          error:
            "Your Airtable Event RSVPs table doesn't have a 'Show on list' column. Add a checkbox field named exactly 'Show on list' to enable hide/show.",
        },
        { status: 400 }
      );
    }
    console.error("Events RSVP update error:", err);
    return NextResponse.json(
      { error: "Failed to update", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
