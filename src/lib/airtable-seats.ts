import Airtable from 'airtable';
import { TOTAL_SEATS } from '@/config/events';

const TOTAL_AVAILABLE_SEATS = TOTAL_SEATS;

interface AirtableBooking {
  id: string;
  fields: {
    'Name'?: string;
    'Phone'?: string;
    'Email'?: string;
    'Amount Paid'?: string;
    'Coupon Used'?: string;
    'Event'?: string;
    'Event Date'?: string;
  };
}

// Initialize Airtable connection for STUDIO bookings (seat tracking)
const getStudioBookingsTable = () => {
  const airtableBaseId = process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID || process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;
  const airtablePAT = process.env.NEXT_PUBLIC_AIRTABLE_PAT;
  const airtableTableName = process.env.NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE || process.env.NEXT_PUBLIC_AIRTABLE_TABLE;

  if (!airtableBaseId || !airtablePAT || !airtableTableName) {
    throw new Error('Missing Airtable STUDIO environment variables');
  }

  console.log(`📊 Connecting to Airtable STUDIO table: ${airtableBaseId} / ${airtableTableName}`);

  const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);
  return base(airtableTableName);
};

export const getAvailableSeats = async (eventDate: string): Promise<number> => {
  try {
    const table = getStudioBookingsTable();
    
    console.log('🔍 Querying STUDIO bookings for event:', eventDate);
    
    // Query records filtered by Event Date
    const records = await table.select({
      filterByFormula: `{Event Date} = '${eventDate}'`
    }).all();

    console.log(`✅ Found ${records.length} bookings for ${eventDate}`);
    
    const bookedSeats = records.length;
    const availableSeats = TOTAL_AVAILABLE_SEATS - bookedSeats;
    
    return Math.max(0, availableSeats);
  } catch (error) {
    console.error('❌ Error fetching available seats from Airtable:', error);
    // Fallback: return full capacity if Airtable is unavailable
    return TOTAL_AVAILABLE_SEATS;
  }
};

export const checkSeatAvailability = async (eventDate: string): Promise<boolean> => {
  const availableSeats = await getAvailableSeats(eventDate);
  return availableSeats > 0;
};

export const getEventBookings = async (eventDate: string): Promise<AirtableBooking[]> => {
  try {
    const table = getStudioBookingsTable();
    
    const records = await table.select({
      filterByFormula: `{Event Date} = '${eventDate}'`,
      sort: [{ field: 'Event Date', direction: 'desc' }]
    }).all();

    return records.map(record => ({
      id: record.id,
      fields: record.fields
    }));
  } catch (error) {
    console.error('Error fetching event bookings from Airtable:', error);
    return [];
  }
};

export const getAllBookings = async (): Promise<AirtableBooking[]> => {
  try {
    const table = getStudioBookingsTable();
    
    const records = await table.select({
      sort: [{ field: 'Event Date', direction: 'desc' }]
    }).all();

    return records.map(record => ({
      id: record.id,
      fields: record.fields
    }));
  } catch (error) {
    console.error('Error fetching all bookings from Airtable:', error);
    return [];
  }
};