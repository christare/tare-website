import Airtable from 'airtable';

export function getStudioBookingsTable() {
  const airtableBaseId =
    process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID ||
    process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const airtableTableName =
    process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE ||
    process.env.NEXT_PUBLIC_AIRTABLE_TABLE;
  const airtablePAT = process.env.AIRTABLE_PAT || process.env.NEXT_PUBLIC_AIRTABLE_PAT;

  if (!airtableBaseId || !airtableTableName || !airtablePAT) {
    throw new Error('Missing Airtable STUDIO environment variables');
  }

  const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
  return base(airtableTableName);
}

