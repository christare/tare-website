// Debug script to see what's in Airtable
// Run with: node scripts/debug-airtable.js

const Airtable = require('airtable');

async function debugAirtable() {
  const airtablePAT = process.env.NEXT_PUBLIC_AIRTABLE_PAT;
  const airtableBaseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const airtableTableName = process.env.AIRTABLE_TABLE_NAME || process.env.NEXT_PUBLIC_AIRTABLE_TABLE;
  
  console.log('Environment variables:');
  console.log('PAT:', airtablePAT ? airtablePAT.substring(0, 10) + '...' : 'not set');
  console.log('Base ID:', airtableBaseId);
  console.log('Table:', airtableTableName);
  
  if (!airtablePAT || !airtableBaseId || !airtableTableName) {
    console.error('❌ Missing environment variables');
    return;
  }

  const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
  
  try {
    console.log('\n✅ Connected to Airtable');
    
    // Get first few records to see the structure
    const records = await base(airtableTableName)
      .select({
        maxRecords: 3
      })
      .all();
    
    console.log(`\n📋 Found ${records.length} records (showing first 3):`);
    
    records.forEach((record, index) => {
      console.log(`\nRecord ${index + 1}:`);
      console.log('  ID:', record.id);
      console.log('  Fields:', Object.keys(record.fields));
      
      // Show some key fields
      const fields = record.fields;
      if (fields['Stripe ID']) console.log('  Stripe ID:', fields['Stripe ID']);
      if (fields['Name']) console.log('  Name:', fields['Name']);
      if (fields['Created']) console.log('  Created:', fields['Created']);
      if (fields['Event Date']) console.log('  Event Date:', fields['Event Date']);
    });
    
  } catch (error) {
    console.error('❌ Error accessing Airtable:', error);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

debugAirtable();
