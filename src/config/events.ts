/**
 * ═══════════════════════════════════════════════════════════════
 * 🎯 CENTRAL EVENT CONFIGURATION
 * ═══════════════════════════════════════════════════════════════
 * 
 * ⚠️  TO CHANGE THE EVENT DATE FOR A NEW EVENT:
 * 
 * 1. Update `eventId` below to the new date (format: YYYY-MM-DD)
 * 2. Update `totalSeats` if capacity changes
 * 3. Save this file
 * 4. That's it! All pages will automatically use the new date:
 *    - Homepage seat counting
 *    - Admin dashboard
 *    - Stripe checkout metadata
 *    - Airtable queries
 * 
 * ═══════════════════════════════════════════════════════════════
 */

export const CURRENT_EVENT_CONFIG = {
  // Event Date in YYYY-MM-DD format (CHANGE THIS FOR NEW EVENTS!)
  eventId: '2025-10-26',
  
  // Total seats available for this event
  totalSeats: 16,
  
  // Event display name (optional)
  displayName: 'TARE STUDIO - October 26, 2025',
  
  // Event time details for confirmation messages
  eventTime: '11:00 AM - 1:00 PM',
  doorsOpen: '10:45 AM', // 15 mins before start
  
  // Location details
  address: '231 West 29th St, New York, NY 10001',
  buzzer: '1207',
  contactPhone: '4157079319',
  contactName: 'Chris',
  
  // 🔒 TOGGLE: Set to true to close bookings and redirect to waitlist
  bookingsClosed: true
};

// Export individual values for convenience
export const CURRENT_EVENT_ID = CURRENT_EVENT_CONFIG.eventId;
export const TOTAL_SEATS = CURRENT_EVENT_CONFIG.totalSeats;

