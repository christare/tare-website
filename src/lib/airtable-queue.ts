import Airtable from "airtable";

export type QueueStatus =
  | "waiting"
  | "notified"
  | "in_service"
  | "served"
  | "skipped"
  | "no_show"
  | "removed"
  | "error";

export type TextCallPreference = "text" | "call";

export type QueueRecord = {
  id: string;
  guestName: string | null;
  phoneNumber: string | null;
  partySize: number | null;
  notes: string | null;
  specialRequests: string | null;
  textCallPreference: TextCallPreference | null;
  status: QueueStatus | null;
  checkInTimestamp: string | null;
  servedTimestamp: string | null;
  lastNotifiedAt: string | null;
  claimedAt: string | null;
  claimedBy: string | null;
  attemptCounter: number | null;
  callTextLog: string | null;
  priorityFlagVip: boolean;
  reAddedToQueue: boolean;
  skipReason: string | null;
  noShowReason: string | null;
  sortOrder: number | null;
};

const FIELDS = {
  guestName: "Guest Name",
  phoneNumber: "Phone Number",
  partySize: "Party Size",
  notes: "Notes",
  specialRequests: "Special Requests",
  textCallPreference: "Text/Call Preference",
  status: "Status",
  checkInTimestamp: "Check-in Timestamp",
  servedTimestamp: "Served Timestamp",
  lastNotifiedAt: "Last Notified At",
  claimedAt: "Claimed At",
  claimedBy: "Claimed By",
  attemptCounter: "Attempt Counter",
  callTextLog: "Call/Text Log",
  priorityFlagVip: "Priority Flag (VIP)",
  reAddedToQueue: "Re-added to Queue",
  skipReason: "Skip Reason",
  noShowReason: "No-show Reason",
  sortOrder: "Sort Order",
} as const;

function getQueueTable() {
  const baseId = process.env.AIRTABLE_QUEUE_BASE_ID;
  const tableIdOrName = process.env.AIRTABLE_QUEUE_TABLE;
  const airtablePAT =
    process.env.AIRTABLE_PAT || process.env.NEXT_PUBLIC_AIRTABLE_PAT;

  if (!baseId || !tableIdOrName || !airtablePAT) {
    throw new Error(
      "Missing Airtable queue env vars: AIRTABLE_QUEUE_BASE_ID, AIRTABLE_QUEUE_TABLE, AIRTABLE_PAT"
    );
  }

  const base = new Airtable({ apiKey: airtablePAT }).base(baseId);
  return base(tableIdOrName);
}

export function getQueueTableForServer() {
  return getQueueTable();
}

function asString(value: unknown): string | null {
  if (typeof value === "string") return value;
  return null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function mapRecord(record: Airtable.Record<any>): QueueRecord {
  const f = record.fields as Record<string, unknown>;

  return {
    id: record.id,
    guestName: asString(f[FIELDS.guestName]),
    phoneNumber: asString(f[FIELDS.phoneNumber]),
    partySize: asNumber(f[FIELDS.partySize]),
    notes: asString(f[FIELDS.notes]),
    specialRequests: asString(f[FIELDS.specialRequests]),
    textCallPreference: (asString(f[FIELDS.textCallPreference]) as
      | TextCallPreference
      | null),
    status: (asString(f[FIELDS.status]) as QueueStatus | null),
    checkInTimestamp: asString(f[FIELDS.checkInTimestamp]),
    servedTimestamp: asString(f[FIELDS.servedTimestamp]),
    lastNotifiedAt: asString(f[FIELDS.lastNotifiedAt]),
    claimedAt: asString(f[FIELDS.claimedAt]),
    claimedBy: asString(f[FIELDS.claimedBy]),
    attemptCounter: asNumber(f[FIELDS.attemptCounter]),
    callTextLog: asString(f[FIELDS.callTextLog]),
    priorityFlagVip: asBoolean(f[FIELDS.priorityFlagVip]),
    reAddedToQueue: asBoolean(f[FIELDS.reAddedToQueue]),
    skipReason: asString(f[FIELDS.skipReason]),
    noShowReason: asString(f[FIELDS.noShowReason]),
    sortOrder: asNumber(f[FIELDS.sortOrder]),
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

export async function listQueueRecords(options?: {
  includeArchive?: boolean;
}): Promise<QueueRecord[]> {
  const table = getQueueTable();

  const includeArchive = options?.includeArchive ?? false;
  const archiveFilter = includeArchive
    ? ""
    : `, NOT({${FIELDS.status}} = 'served'), NOT({${FIELDS.status}} = 'removed')`;

  const filterByFormula = `AND({${FIELDS.status}} != BLANK()${archiveFilter})`;

  const records = await table
    .select({
      filterByFormula,
      sort: [
        { field: FIELDS.sortOrder, direction: "asc" },
        { field: FIELDS.checkInTimestamp, direction: "asc" },
      ],
      pageSize: 100,
    })
    .all();

  return records.map(mapRecord);
}

export async function getNextSortOrder(): Promise<number> {
  const table = getQueueTable();
  const records = await table
    .select({
      sort: [{ field: FIELDS.sortOrder, direction: "desc" }],
      maxRecords: 1,
      pageSize: 1,
    })
    .all();

  const top = records[0];
  const currentMax =
    (top?.fields?.[FIELDS.sortOrder] as number | undefined) ?? 0;
  return (Number.isFinite(currentMax) ? currentMax : 0) + 1;
}

export async function createQueueRecord(input: {
  guestName: string;
  phoneNumber: string;
  partySize: number;
  notes?: string;
  specialRequests?: string;
  textCallPreference?: TextCallPreference;
}): Promise<QueueRecord> {
  const table = getQueueTable();
  const nowIso = new Date().toISOString();
  const sortOrder = await getNextSortOrder();

  const created = await table.create([
    {
      fields: {
        [FIELDS.guestName]: input.guestName,
        [FIELDS.phoneNumber]: input.phoneNumber,
        [FIELDS.partySize]: input.partySize,
        [FIELDS.notes]: input.notes || "",
        [FIELDS.specialRequests]: input.specialRequests || "",
        [FIELDS.textCallPreference]: input.textCallPreference || "text",
        [FIELDS.status]: "waiting",
        [FIELDS.checkInTimestamp]: nowIso,
        [FIELDS.sortOrder]: sortOrder,
      },
    },
  ]);

  return mapRecord(created[0] as any);
}

export async function updateQueueRecord(
  recordId: string,
  fields: Record<string, unknown>
): Promise<QueueRecord> {
  const table = getQueueTable();
  const updated = await table.update([{ id: recordId, fields } as any]);
  return mapRecord(updated[0] as any);
}

export async function batchUpdateQueueRecords(
  updates: Array<{ id: string; fields: Record<string, unknown> }>
) {
  const table = getQueueTable();
  const out: QueueRecord[] = [];
  for (let i = 0; i < updates.length; i += 10) {
    const batch = updates.slice(i, i + 10);
    const res = await table.update(batch as any);
    out.push(...(res as any[]).map(mapRecord));
  }
  return out;
}

export function buildLogLine(message: string) {
  const ts = new Date().toISOString();
  return `[${ts}] ${message}`.trim();
}

export async function appendQueueLog(recordId: string, message: string) {
  const table = getQueueTable();
  const line = buildLogLine(message);

  const record = await table.find(recordId);
  const existing = (record.fields?.[FIELDS.callTextLog] as string | undefined) || "";
  const next = existing ? `${existing}\n${line}` : line;

  const updated = await table.update([{ id: recordId, fields: { [FIELDS.callTextLog]: next } } as any]);
  return mapRecord(updated[0] as any);
}

export const QueueFields = FIELDS;

