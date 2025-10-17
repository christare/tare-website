// Add a manual booking for testing
// Run with: node scripts/add-manual-booking.js

const { MongoClient } = require('mongodb');

async function addManualBooking() {
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
    
    const eventId = '2025-10-26';
    
    // Add your booking
    await bookingsCollection.insertOne({
      eventId: eventId,
      stripeSessionId: 'cs_test_your_purchase_' + Date.now(),
      customerEmail: 'your-email@example.com', // Replace with your actual email
      amountPaid: 0, // Free with promo code
      bookingType: 'studio',
      status: 'confirmed',
      createdAt: new Date(),
    });
    
    // Update seat count
    await eventsCollection.updateOne(
      { eventId },
      { 
        $inc: { 
          availableSeats: -1,
          bookedSeats: 1 
        }
      }
    );
    
    console.log('✅ Added your booking manually');
    
    // Check final state
    const finalEvent = await eventsCollection.findOne({ eventId });
    const totalBookings = await bookingsCollection.countDocuments({ eventId });
    
    console.log('\n📊 Updated status:');
    console.log(`   Event: ${eventId}`);
    console.log(`   Available seats: ${finalEvent.availableSeats}`);
    console.log(`   Booked seats: ${finalEvent.bookedSeats}`);
    console.log(`   Total bookings: ${totalBookings}`);
    
  } catch (error) {
    console.error('❌ Error adding manual booking:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

addManualBooking();
