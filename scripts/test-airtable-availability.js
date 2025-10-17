// Test the Airtable-based availability system
// Run with: node scripts/test-airtable-availability.js

const Airtable = require('airtable');

async function testAirtableAvailability() {
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
    
    // Count all records with Stripe ID (completed purchases)
    const allRecords = await base(airtableTableName)
      .select({
        filterByFormula: "{Stripe ID} != ''"
      })
      .all();
    
    console.log(`📊 Total completed purchases: ${allRecords.length}`);
    
    // Count records with Event Date = 2025-10-26
    const eventRecords = await base(airtableTableName)
      .select({
        filterByFormula: "AND({Stripe ID} != '', {Event Date} = '2025-10-26')"
      })
      .all();
    
    console.log(`📅 Records for 2025-10-26: ${eventRecords.length}`);
    
    // If no Event Date field exists, count all records as current event
    const currentEventCount = eventRecords.length > 0 ? eventRecords.length : allRecords.length;
    const totalSeats = 16;
    const availableSeats = Math.max(0, totalSeats - currentEventCount);
    
    console.log(`\n🎯 Current Event Status:`);
    console.log(`   Total seats: ${totalSeats}`);
    console.log(`   Booked: ${currentEventCount}`);
    console.log(`   Available: ${availableSeats}`);
    console.log(`   Sold out: ${availableSeats <= 0}`);
    
    if (eventRecords.length === 0) {
      console.log(`\n💡 Note: No records have Event Date field set yet.`);
      console.log(`   All ${allRecords.length} records are being counted as current event.`);
      console.log(`   Add "Event Date" field to Airtable and set values to get per-event tracking.`);
    }
    
  } catch (error) {
    console.error('❌ Error testing Airtable:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testAirtableAvailability();
