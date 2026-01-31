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
  eventId: '2026-02-01',
  
  // Total seats available for this event
  totalSeats: 4,
  
  // Event display name (optional)
  displayName: 'TARE STUDIO - February 1, 2026',
  
  // Event time details for confirmation messages
  eventTime: '2:00 PM - 3:30 PM',
  doorsOpen: '1:50 PM', // 10 mins before start
  
  // Location details
  // Keep Suite number consistent everywhere (website, SMS, calendar, etc.)
  address: '2959 Northern Blvd 49D, Long Island City, NY 11101',
  addressLine1: '2959 Northern Blvd 49D',
  addressLine2: 'Long Island City, NY 11101',
  buzzer: '1207',
  contactPhone: '4157079319',
  contactName: 'Chris'
};

// Export individual values for convenience
export const CURRENT_EVENT_ID = CURRENT_EVENT_CONFIG.eventId;
export const TOTAL_SEATS = CURRENT_EVENT_CONFIG.totalSeats;

