// Simple script to create a new event in MongoDB
// Run with: node scripts/create-event.js

const { MongoClient } = require('mongodb');

async function createEvent() {
  // You'll need to set MONGODB_URI in your .env.local file
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ Please set MONGODB_URI in your .env.local file');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('tare');
    const collection = db.collection('events');
    
    // Configuration for your new event
    const eventId = '2025-10-26'; // Change this date for each new event
    const totalSeats = 16; // Change if you want different capacity
    
    const newEvent = {
      eventId: eventId,
      totalSeats: totalSeats,
      availableSeats: totalSeats,
      bookedSeats: 5,
    };
    
    // Check if event already exists
    const existingEvent = await collection.findOne({ eventId });
    if (existingEvent) {
      console.log(`⚠️  Event ${eventId} already exists with ${existingEvent.availableSeats} available seats`);
      console.log('   If you want to reset it, delete it first in MongoDB Atlas');
      return;
    }
    
    // Create the event
    await collection.insertOne(newEvent);
    console.log(`🎉 Created new event: ${eventId} with ${totalSeats} seats`);
    
    // Update your frontend code
    console.log(`\n📝 Don't forget to update your frontend code:`);
    console.log(`   Change CURRENT_EVENT_ID to '${eventId}' in src/app/page.tsx`);
    console.log(`   Update the event date display on the page`);
    
  } catch (error) {
    console.error('❌ Error creating event:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

createEvent();
