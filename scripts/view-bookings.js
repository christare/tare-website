// Script to view bookings for an event
// Run with: node scripts/view-bookings.js

const { MongoClient } = require('mongodb');

async function viewBookings() {
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
    const bookingsCollection = db.collection('bookings');
    const eventsCollection = db.collection('events');
    
    // Get all events
    const events = await eventsCollection.find({}).toArray();
    console.log('\n📅 Events:');
    events.forEach(event => {
      console.log(`   ${event.eventId}: ${event.bookedSeats}/${event.totalSeats} seats (${event.availableSeats} available)`);
    });
    
    // Get all bookings
    const bookings = await bookingsCollection.find({}).sort({ createdAt: -1 }).toArray();
    console.log(`\n📋 All Bookings (${bookings.length} total):`);
    console.log('─'.repeat(80));
    
    bookings.forEach((booking, index) => {
      const date = booking.createdAt.toLocaleDateString();
      const time = booking.createdAt.toLocaleTimeString();
      const amount = (booking.amountPaid / 100).toFixed(2);
      
      console.log(`${index + 1}. ${booking.customerEmail}`);
      console.log(`   Event: ${booking.eventId}`);
      console.log(`   Amount: $${amount}`);
      console.log(`   Booked: ${date} at ${time}`);
      console.log(`   Session: ${booking.stripeSessionId}`);
      console.log(`   Status: ${booking.status}`);
      console.log('');
    });
    
    if (bookings.length === 0) {
      console.log('   No bookings found');
    }
    
  } catch (error) {
    console.error('❌ Error viewing bookings:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

viewBookings();
