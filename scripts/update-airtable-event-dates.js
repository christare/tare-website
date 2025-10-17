// Script to add Event Date field to existing Airtable records
// Run with: node scripts/update-airtable-event-dates.js

const Airtable = require('airtable');

async function updateAirtableEventDates() {
  const airtablePAT = process.env.AIRTABLE_PAT;
  const airtableBaseId = process.env.AIRTABLE_BASE_ID;
  const airtableTableName = process.env.AIRTABLE_TABLE_NAME;
  
  if (!airtablePAT || !airtableBaseId || !airtableTableName) {
    console.error('❌ Please set AIRTABLE_PAT, AIRTABLE_BASE_ID, and AIRTABLE_TABLE_NAME in .env.local');
    process.exit(1);
  }

  const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
  
  try {
    console.log('✅ Connected to Airtable');
    
    // Get all records that don't have Event Date set
    const records = await base(airtableTableName)
      .select({
        filterByFormula: "AND({Stripe ID} != '', {Event Date} = '')"
      })
      .all();
    
    console.log(`📋 Found ${records.length} records without Event Date`);
    
    if (records.length === 0) {
      console.log('✅ All records already have Event Date set');
      return;
    }
    
    // Update each record with the event date
    const updates = records.map(record => ({
      id: record.id,
      fields: {
        'Event Date': '2025-10-26' // Set to your current event date
      }
    }));
    
    // Update in batches of 10 (Airtable limit)
    const batchSize = 10;
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize);
      
      await base(airtableTableName).update(batch);
      console.log(`✅ Updated batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(updates.length/batchSize)}`);
    }
    
    console.log(`🎉 Successfully updated ${updates.length} records with Event Date`);
    
    // Verify the update
    const updatedRecords = await base(airtableTableName)
      .select({
        filterByFormula: "AND({Stripe ID} != '', {Event Date} = '2025-10-26')"
      })
      .all();
    
    console.log(`📊 Verification: ${updatedRecords.length} records now have Event Date = 2025-10-26`);
    
  } catch (error) {
    console.error('❌ Error updating Airtable:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

updateAirtableEventDates();
