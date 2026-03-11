/**
 * Blind test event — sensory testing (coffee, aromatics, etc.), Partiful-style RSVP.
 * First event: Friday March 13, 2026, 4pm–8pm.
 * Passcode accepts anything for now.
 */

export const BLIND_TASTE_EVENT = {
  eventId: "2026-03-13",
  title: "Blind Test",
  dateLabel: "Friday, March 13, 2026",
  timeRange: "4:00 PM – 8:00 PM",
  // Passcode: any non-empty string for now
  passcode: "",
  /** SMS sent after RSVP */
  confirmationMessage: `You're confirmed for TARE Blind Test

Friday, March 13
4:00–8:00 PM

Sven Apartments
2959 Northern Blvd
Long Island City, NY 11101

Check in at the front desk and ask for
Chris Jereza - 49D

Questions, changes, or bringing a +1?
Text Chris at 415-707-9319

See you there.
TARE team`,
  /** Full address (for reference; not used in confirmation message above) */
  address: "2959 Northern Blvd 49D, Long Island City, NY 11101",
  /** SMS sent to verify phone before confirming RSVP */
  verificationMessage: (code: string) =>
    `Your TARE Blind Test verification code is: ${code}. It expires in 10 minutes.`,
} as const;
