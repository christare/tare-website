# Instructions for Airtable Omni — Copy and paste this to Omni

Use this in Airtable’s Omni (AI) so it creates the right bases/tables and fields. **Field names and types must match exactly** or the TARE website will break.

---

## Option A: One base for everything (simplest)

**Say to Omni:**

```
I need one Airtable base for a coffee studio website. Create it with exactly these tables and fields. Use these exact field names and types — the app expects them precisely.

---

TABLE 1 — name: "Studio Bookings" (or "Bookings")
- Name — Single line text
- Phone — Phone number (or Single line text)
- Email — Email
- Amount Paid — Single line text (we store values like "$50.00")
- Coupon Used — Single line text
- Event — Single line text (e.g. "TARE STUDIO")
- Event Date — Single line text (format YYYY-MM-DD, e.g. 2026-02-01). Required for seat counting.

---

TABLE 2 — name: "Queue"
In-person tasting queue. Create these fields with exact names:
- Guest Name — Single line text
- Phone Number — Phone number (or Single line text)
- Party Size — Number (integer)
- Notes — Long text
- Special Requests — Long text
- Text/Call Preference — Single select: options "text", "call" (default "text")
- Status — Single select: options "waiting", "notified", "in_service", "served", "skipped", "no_show", "removed", "error"
- Check-in Timestamp — Date (include time) or Single line text for ISO datetime
- Served Timestamp — Date (include time) or Single line text
- Last Notified At — Date (include time) or Single line text
- Claimed At — Single line text
- Claimed By — Single line text
- Attempt Counter — Number (integer)
- Call/Text Log — Long text
- Priority Flag (VIP) — Checkbox
- Re-added to Queue — Checkbox
- Skip Reason — Single line text
- No-show Reason — Single line text
- Sort Order — Number (integer)

---

TABLE 3 — name: "Event RSVPs"
Blind Test RSVPs. Same base as Queue. Exact field names:
- Event Id — Single line text (e.g. 2026-03-13)
- Guest Name — Single line text
- Phone Number — Phone number (or Single line text)
- RSVP At — Date (include time) or Single line text (ISO datetime)
- Message Log — Long text (append-only log of SMS sent)
- Show on list — Checkbox (optional). Uncheck to hide this guest from the public "Who's Coming" list (opt-out). If the column is missing, all guests are shown.

---

Do not add extra fields or rename these. The app reads and writes using these exact names.
```

After Omni creates the base:

1. Copy the **Base ID** (from the base URL or base settings → API).
2. Copy each **Table name** (or Table ID from the API docs for that table).
3. Put them in your app’s `.env.local` as:
   - Same base for all three tables: use that one Base ID for both queue and event RSVPs.
   - `NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID` = that base ID  
   - `NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE` = "Studio Bookings" (or the exact table name)  
   - `AIRTABLE_QUEUE_BASE_ID` = same base ID  
   - `AIRTABLE_QUEUE_TABLE` = "Queue"  
   - `AIRTABLE_EVENTS_RSVP_TABLE` = "Event RSVPs"

---

## Option B: You already have separate bases

If you prefer **separate bases** (e.g. one for Studio, one for Queue + Event RSVPs), tell Omni:

**Base 1 — Studio**
```
Create one table in this base named "Studio Bookings" (or "Bookings") with exactly these fields:
- Name — Single line text
- Phone — Phone number or Single line text
- Email — Email
- Amount Paid — Single line text
- Coupon Used — Single line text
- Event — Single line text
- Event Date — Single line text (YYYY-MM-DD). Required.
Use these exact field names.
```

**Base 2 — Queue & Event RSVPs**
```
Create two tables in this base.

TABLE 1 — name: "Queue"
Fields (exact names): Guest Name, Phone Number, Party Size, Notes, Special Requests, Text/Call Preference (single select: text, call), Status (single select: waiting, notified, in_service, served, skipped, no_show, removed, error), Check-in Timestamp, Served Timestamp, Last Notified At, Claimed At, Claimed By, Attempt Counter (number), Call/Text Log (long text), Priority Flag (VIP) (checkbox), Re-added to Queue (checkbox), Skip Reason, No-show Reason, Sort Order (number).

TABLE 2 — name: "Event RSVPs"
Fields (exact names): Event Id (single line text), Guest Name, Phone Number, RSVP At (date/time or text), Message Log (long text). Optional: Show on list (checkbox; uncheck to hide guest from public "Who's Coming").
```

Then set env:
- Studio base/table → `NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID`, `NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE`
- Queue base → `AIRTABLE_QUEUE_BASE_ID`; table "Queue" → `AIRTABLE_QUEUE_TABLE`; table "Event RSVPs" → `AIRTABLE_EVENTS_RSVP_TABLE`

---

## Checklist after Omni runs

- [ ] **Studio Bookings**: Name, Phone, Email, Amount Paid, Coupon Used, Event, **Event Date** (exact spelling).
- [ ] **Queue**: **Guest Name**, **Phone Number**, **Party Size**, **Status**, **Check-in Timestamp**, **Sort Order**, and all other fields listed with exact names (including "Text/Call Preference", "Call/Text Log", "Priority Flag (VIP)", "Re-added to Queue", "No-show Reason").
- [ ] **Event RSVPs**: **Event Id**, **Guest Name**, **Phone Number**, **RSVP At**, **Message Log** (exact names). Optional: **Show on list** (checkbox) to hide guests from the public list when unchecked.
- [ ] `.env.local` has the correct base IDs and table names/IDs for the app.
- [ ] Restart the dev server and test: book a session (Stripe → Studio Bookings), join queue (Queue), RSVP Blind Test (Event RSVPs).

**Waitlist and Feedback:** If you use the waitlist or feedback forms, create those tables in the same or separate bases; see `SETUP.md` in the project root for their field names.
