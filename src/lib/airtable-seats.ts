import Airtable from 'airtable';

const airtablePAT = process.env.NEXT_PUBLIC_AIRTABLE_PAT!;
const airtableBaseId = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!;
const airtableTableName = process.env.NEXT_PUBLIC_AIRTABLE_TABLE!;

const base = new Airtable({ apiKey: airtablePAT }).base(airtableBaseId);

const TOTAL_AVAILABLE_SEATS = 16; // Change this for each event

export const getAvailableSeats = async (eventDate: string): Promise<number> => {
  try {
    // For now, count all records with Stripe ID as current event bookings
    // This works until you add Event Date field to Airtable
    const records = await base(airtableTableName)
      .select({
        filterByFormula: "{Stripe ID} != ''"
      })
      .all();
    
    const bookedSeats = records.length;
    const availableSeats = Math.max(0, TOTAL_AVAILABLE_SEATS - bookedSeats);
    
    console.log(`Event ${eventDate}: ${bookedSeats} booked, ${availableSeats} available`);
    return availableSeats;
  } catch (error) {
    console.error('Error fetching availability from Airtable:', error);
    return TOTAL_AVAILABLE_SEATS; // Return full capacity on error
  }
};

export const isSoldOut = async (eventDate: string): Promise<boolean> => {
  const availableSeats = await getAvailableSeats(eventDate);
  return availableSeats <= 0;
};

export const getBookingsForEvent = async (eventDate: string) => {
  try {
    const records = await base(airtableTableName)
      .select({
        filterByFormula: `AND({Event Date} = '${eventDate}', {Stripe ID} != '')`,
        sort: [{ field: 'Created', direction: 'desc' }]
      })
      .all();
    
    return records.map(record => ({
      id: record.id,
      name: record.get('Name'),
      email: record.get('Stripe Email'),
      amountPaid: record.get('Amount Paid'),
      created: record.get('Created'),
      stripeId: record.get('Stripe ID')
    }));
  } catch (error) {
    console.error('Error fetching bookings from Airtable:', error);
    return [];
  }
};
