// Test script to manually trigger the webhook with a simulated event
// Run with: node scripts/test-webhook.js

const { MongoClient } = require('mongodb');

async function testWebhook() {
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
    const eventsCollection = db.collection('events');
    const bookingsCollection = db.collection('bookings');
    
    // Get current state
    const event = await eventsCollection.findOne({ eventId: '2025-10-26' });
    console.log('\n📊 Before test:');
    console.log(`   Available seats: ${event.availableSeats}`);
    console.log(`   Booked seats: ${event.bookedSeats}`);
    
    // Simulate the webhook logic
    console.log('\n🧪 Simulating webhook...');
    
    // Reserve a seat (using direct MongoDB operations for testing)
    const result = await eventsCollection.findOneAndUpdate(
      { 
        eventId: '2025-10-26',
        availableSeats: { $gt: 0 }
      },
      {
        $inc: { 
          availableSeats: -1,
          bookedSeats: 1 
        }
      },
      { returnDocument: 'after' }
    );
    
    const reserved = result !== null;
    
    if (reserved) {
      console.log('✅ Seat reserved successfully');
      
      // Record the booking
      await bookingsCollection.insertOne({
        eventId: '2025-10-26',
        stripeSessionId: 'cs_test_manual_' + Date.now(),
        customerEmail: 'test@example.com',
        amountPaid: 9000,
        bookingType: 'studio',
        status: 'confirmed',
        createdAt: new Date(),
      });
      
      console.log('✅ Booking recorded successfully');
    } else {
      console.log('❌ Failed to reserve seat');
    }
    
    // Check final state
    const finalEvent = await eventsCollection.findOne({ eventId: '2025-10-26' });
    console.log('\n📊 After test:');
    console.log(`   Available seats: ${finalEvent.availableSeats}`);
    console.log(`   Booked seats: ${finalEvent.bookedSeats}`);
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testWebhook();
