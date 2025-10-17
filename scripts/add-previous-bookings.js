// Script to add previous booking records
// Run with: node scripts/add-previous-bookings.js

const { MongoClient } = require('mongodb');

async function addPreviousBookings() {
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
    
    // Update the event to reflect the 5 existing bookings
    const eventId = '2025-10-26';
    const totalSeats = 16;
    const bookedSeats = 5;
    const availableSeats = totalSeats - bookedSeats;
    
    await eventsCollection.updateOne(
      { eventId },
      { 
        $set: { 
          totalSeats,
          bookedSeats,
          availableSeats
        }
      }
    );
    
    console.log(`✅ Updated event ${eventId}: ${bookedSeats} booked, ${availableSeats} available`);
    
    // Add sample booking records for the 5 previous customers
    const previousBookings = [
      {
        eventId: eventId,
        stripeSessionId: 'cs_test_previous_001',
        customerEmail: 'customer1@example.com',
        amountPaid: 9000, // $90.00 in cents
        status: 'confirmed',
        createdAt: new Date('2025-10-15T10:00:00Z'),
        bookingType: 'studio'
      },
      {
        eventId: eventId,
        stripeSessionId: 'cs_test_previous_002',
        customerEmail: 'customer2@example.com',
        amountPaid: 9000,
        status: 'confirmed',
        createdAt: new Date('2025-10-16T14:30:00Z'),
        bookingType: 'studio'
      },
      {
        eventId: eventId,
        stripeSessionId: 'cs_test_previous_003',
        customerEmail: 'customer3@example.com',
        amountPaid: 9000,
        status: 'confirmed',
        createdAt: new Date('2025-10-17T09:15:00Z'),
        bookingType: 'studio'
      },
      {
        eventId: eventId,
        stripeSessionId: 'cs_test_previous_004',
        customerEmail: 'customer4@example.com',
        amountPaid: 9000,
        status: 'confirmed',
        createdAt: new Date('2025-10-18T16:45:00Z'),
        bookingType: 'studio'
      },
      {
        eventId: eventId,
        stripeSessionId: 'cs_test_previous_005',
        customerEmail: 'customer5@example.com',
        amountPaid: 9000,
        status: 'confirmed',
        createdAt: new Date('2025-10-19T11:20:00Z'),
        bookingType: 'studio'
      }
    ];
    
    // Check if bookings already exist
    const existingBookings = await bookingsCollection.find({ eventId }).toArray();
    if (existingBookings.length > 0) {
      console.log(`⚠️  Found ${existingBookings.length} existing bookings for ${eventId}`);
      console.log('   Skipping to avoid duplicates');
      return;
    }
    
    // Insert the booking records
    const result = await bookingsCollection.insertMany(previousBookings);
    console.log(`✅ Added ${result.insertedCount} previous booking records`);
    
    console.log('\n📊 Current status:');
    console.log(`   Event: ${eventId}`);
    console.log(`   Total seats: ${totalSeats}`);
    console.log(`   Booked: ${bookedSeats}`);
    console.log(`   Available: ${availableSeats}`);
    
  } catch (error) {
    console.error('❌ Error adding previous bookings:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

addPreviousBookings();
