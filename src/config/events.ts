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
  eventId: '2026-01-10',
  
  // Total seats available for this event
  totalSeats: 16,
  
  // Event display name (optional)
  displayName: 'TARE STUDIO - January 10, 2026',
  
  // Event time details for confirmation messages
  eventTime: '2:00 PM - 3:30 PM',
  doorsOpen: '1:45 PM', // 15 mins before start
  
  // Location details
  // Keep Suite number consistent everywhere (website, SMS, calendar, etc.)
  address: '45 W 29th St, Suite 301, New York, NY 10001',
  addressLine1: '45 W 29th St, Suite 301',
  addressLine2: 'New York, NY 10001',
  buzzer: '1207',
  contactPhone: '4157079319',
  contactName: 'Chris'
};

// Export individual values for convenience
export const CURRENT_EVENT_ID = CURRENT_EVENT_CONFIG.eventId;
export const TOTAL_SEATS = CURRENT_EVENT_CONFIG.totalSeats;

