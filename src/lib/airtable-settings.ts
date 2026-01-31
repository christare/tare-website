import Airtable from 'airtable';

export type SalesSettings = {
  salesOpen: boolean;
  message?: string | null;
};

function getAirtableConnection() {
  const airtableBaseId =
    process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID ||
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const airtablePAT = process.env.AIRTABLE_PAT || process.env.NEXT_PUBLIC_AIRTABLE_PAT;
  const settingsTableName = process.env.AIRTABLE_SETTINGS_TABLE || 'Settings';

  if (!airtableBaseId || !airtablePAT) {
    throw new Error('Missing Airtable configuration');
  }

  const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
  return { base, settingsTableName };
}

export async function getSalesSettings(): Promise<SalesSettings> {
  // Fail-open by default (don’t accidentally block sales due to config issues)
  try {
    const { base, settingsTableName } = getAirtableConnection();
    const records = await base(settingsTableName).select({ maxRecords: 1 }).firstPage();
    const record = records?.[0];
    const fields = (record?.fields || {}) as any;

    // Airtable checkbox comes through as boolean when checked; blank otherwise.
    const salesOpenRaw = fields['Sales Open'];
    const salesOpen = salesOpenRaw === undefined || salesOpenRaw === null ? true : Boolean(salesOpenRaw);
    const message = (fields['Sales Closed Message'] || '').toString().trim() || null;

    return { salesOpen, message };
  } catch (err) {
    console.error('Failed to read sales settings (fail-open):', err);
    return { salesOpen: true, message: null };
  }
}

export async function updateSalesSettings(input: SalesSettings): Promise<void> {
  const { base, settingsTableName } = getAirtableConnection();

  const records = await base(settingsTableName).select({ maxRecords: 1 }).firstPage();
  const existing = records?.[0];

  const fields = {
    'Sales Open': Boolean(input.salesOpen),
    'Sales Closed Message': (input.message || '').toString(),
  };

  if (existing) {
    await base(settingsTableName).update([{ id: existing.id, fields }]);
  } else {
    await base(settingsTableName).create([{ fields }]);
  }
}

