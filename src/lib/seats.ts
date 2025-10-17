import { connectToDatabase } from './mongodb';

const TOTAL_AVAILABLE_SEATS = 8;

interface Event {
  eventId: string;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
}

export const getAvailableSeats = async (eventId: string): Promise<number> => {
  const { db } = await connectToDatabase();
  const event = await db.collection<Event>('events').findOne({ eventId });
  
  if (!event) {
    // Auto-create event on first access
    await db.collection<Event>('events').insertOne({
      eventId,
      totalSeats: TOTAL_AVAILABLE_SEATS,
      availableSeats: TOTAL_AVAILABLE_SEATS,
      bookedSeats: 0,
    });
    return TOTAL_AVAILABLE_SEATS;
  }
  
  return event.availableSeats;
};

export const reserveSeat = async (eventId: string): Promise<boolean> => {
  const { db } = await connectToDatabase();
  
  const result = await db.collection<Event>('events').findOneAndUpdate(
    { 
      eventId,
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
  
  return result !== null;
};

export const releaseSeat = async (eventId: string): Promise<boolean> => {
  const { db } = await connectToDatabase();
  
  const result = await db.collection<Event>('events').findOneAndUpdate(
    { 
      eventId,
      bookedSeats: { $gt: 0 }
    },
    {
      $inc: { 
        availableSeats: 1,
        bookedSeats: -1 
      }
    },
    { returnDocument: 'after' }
  );
  
  return result !== null;
};

// Track individual bookings
export const recordBooking = async (bookingData: {
  eventId: string;
  stripeSessionId: string;
  customerEmail: string;
  amountPaid: number;
  bookingType?: string;
}): Promise<boolean> => {
  const { db } = await connectToDatabase();
  
  try {
    await db.collection('bookings').insertOne({
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error recording booking:', error);
    return false;
  }
};

// Get bookings for an event
export const getEventBookings = async (eventId: string) => {
  const { db } = await connectToDatabase();
  
  return await db.collection('bookings')
    .find({ eventId })
    .sort({ createdAt: -1 })
    .toArray();
}; 