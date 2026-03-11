import Airtable from "airtable";

/**
 * Event RSVPs (e.g. blind test). Can use its own base or the queue base.
 * Env: AIRTABLE_EVENTS_RSVP_BASE_ID (optional; else AIRTABLE_QUEUE_BASE_ID), AIRTABLE_EVENTS_RSVP_TABLE, AIRTABLE_PAT
 *
 * Airtable: Event Id, Guest Name, Phone Number, RSVP At, Message Log, Show on list (checkbox, optional; default true)
 */

export type EventRsvpRecord = {
  id: string;
  eventId: string | null;
  guestName: string | null;
  phoneNumber: string | null;
  rsvpAt: string | null;
  messageLog: string | null;
  showOnList: boolean;
};

const FIELDS = {
  eventId: "Event Id",
  guestName: "Guest Name",
  phoneNumber: "Phone Number",
  rsvpAt: "RSVP At",
  messageLog: "Message Log",
  showOnList: "Show on list",
} as const;

/** First name + last initial only; never show phone numbers. */
export function formatDisplayName(guestName: string | null): string {
  if (!guestName || !guestName.trim()) return "Guest";
  const parts = guestName.trim().split(/\s+/);
  const first = parts[0];
  const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
  return lastInitial ? `${first} ${lastInitial}` : first;
}

function getTable() {
  const baseId =
    process.env.AIRTABLE_EVENTS_RSVP_BASE_ID || process.env.AIRTABLE_QUEUE_BASE_ID;
  const tableIdOrName = process.env.AIRTABLE_EVENTS_RSVP_TABLE;
  const pat = process.env.AIRTABLE_PAT || process.env.NEXT_PUBLIC_AIRTABLE_PAT;
  if (!baseId || !tableIdOrName || !pat) {
    throw new Error(
      "Missing Airtable events RSVP env: AIRTABLE_EVENTS_RSVP_BASE_ID or AIRTABLE_QUEUE_BASE_ID, AIRTABLE_EVENTS_RSVP_TABLE, AIRTABLE_PAT"
    );
  }
  const base = new Airtable({ apiKey: pat }).base(baseId);
  return base(tableIdOrName);
}

export function getEventsRsvpTable() {
  return getTable();
}

function asString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function asBool(v: unknown): boolean {
  if (v === false || v === "false" || v === 0) return false;
  return true; // missing or true → show on list
}

function mapRecord(record: Airtable.Record<any>): EventRsvpRecord {
  const f = record.fields as Record<string, unknown>;
  return {
    id: record.id,
    eventId: asString(f[FIELDS.eventId]),
    guestName: asString(f[FIELDS.guestName]),
    phoneNumber: asString(f[FIELDS.phoneNumber]),
    rsvpAt: asString(f[FIELDS.rsvpAt]),
    messageLog: asString(f[FIELDS.messageLog]),
    showOnList: asBool(f[FIELDS.showOnList]),
  };
}

export function normalizePhoneDigits(phone: string): string {
  return (phone || "").replace(/\D/g, "");
}

export function formatPhoneForTwilio(phone: string): string {
  const cleaned = normalizePhoneDigits(phone);
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11 && cleaned.startsWith("1")) return `+${cleaned}`;
  return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
}

export async function listEventRsvps(eventId: string): Promise<EventRsvpRecord[]> {
  const table = getTable();
  const formula = `{${FIELDS.eventId}} = '${eventId.replace(/'/g, "''")}'`;
  const records = await table
    .select({
      filterByFormula: formula,
      sort: [{ field: FIELDS.rsvpAt, direction: "desc" }],
      pageSize: 100,
    })
    .all();
  return records.map(mapRecord);
}

export async function createEventRsvp(input: {
  eventId: string;
  guestName: string;
  phoneNumber: string;
}): Promise<EventRsvpRecord> {
  const table = getTable();
  const nowIso = new Date().toISOString();
  const fields: Record<string, unknown> = {
    [FIELDS.eventId]: input.eventId,
    [FIELDS.guestName]: input.guestName,
    [FIELDS.phoneNumber]: input.phoneNumber,
    [FIELDS.rsvpAt]: nowIso,
    [FIELDS.messageLog]: "",
  };
  // If your base has "Show on list" (checkbox), new RSVPs will show by default (missing = true in mapRecord)
  const created = await table.create([{ fields }]);
  return mapRecord(created[0] as any);
}

/** Public list: opted-in only, display names (first name + last initial). */
export async function listPublicAttendees(eventId: string): Promise<string[]> {
  const records = await listEventRsvps(eventId);
  return records
    .filter((r) => r.showOnList !== false)
    .map((r) => formatDisplayName(r.guestName))
    .filter(Boolean);
}

export async function appendMessageLog(recordId: string, message: string): Promise<void> {
  const table = getTable();
  const record = await table.find(recordId);
  const existing = (record.fields?.[FIELDS.messageLog] as string) || "";
  const line = `[${new Date().toISOString()}] ${message}`;
  const next = existing ? `${existing}\n${line}` : line;
  await table.update([{ id: recordId, fields: { [FIELDS.messageLog]: next } } as any]);
}

/** Remove RSVP by event + phone (identity). Deletes the record from Airtable. */
export async function removeEventRsvp(eventId: string, phoneDigits: string): Promise<boolean> {
  const records = await listEventRsvps(eventId);
  const match = records.find((r) => normalizePhoneDigits(r.phoneNumber || "") === phoneDigits);
  if (!match) return false;
  const table = getTable();
  await table.destroy(match.id);
  return true;
}

/** Update "Show on list" for a record (optional column in Airtable). */
export async function updateEventRsvpShowOnList(recordId: string, showOnList: boolean): Promise<void> {
  const table = getTable();
  await table.update([{ id: recordId, fields: { [FIELDS.showOnList]: showOnList } } as any]);
}

export const EventRsvpFields = FIELDS;
