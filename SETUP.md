# TARE Website — Full Setup Guide

This guide covers everything needed to run the site: Airtable, environment variables, Twilio, Stripe, and team login.

---

## 1. Environment variables

Create a `.env.local` in the project root (and add the same vars in Vercel/hosting for production).

### Airtable (shared PAT)

```env
# Personal Access Token — create at https://airtable.com/create/tokens
# Use scope: data.records:read, data.records:write, schema.bases:read
AIRTABLE_PAT=patxxxxxxxxxxxx
NEXT_PUBLIC_AIRTABLE_PAT=patxxxxxxxxxxxx
```

### Airtable bases and tables

```env
# STUDIO — paid session bookings (homepage, Stripe webhooks)
NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID=appxxxxxxxxxxxx
NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE=tblxxxxxxxxxxxx

# WAITLIST — email signup
NEXT_PUBLIC_AIRTABLE_WAITLIST_BASE_ID=appxxxxxxxxxxxx
NEXT_PUBLIC_AIRTABLE_WAITLIST_TABLE=tblxxxxxxxxxxxx

# FEEDBACK — post-experience form
AIRTABLE_FEEDBACK_BASE_ID=appxxxxxxxxxxxx
AIRTABLE_FEEDBACK_TABLE_ID=tblxxxxxxxxxxxx

# QUEUE — in-person tasting queue (join, notify, list)
AIRTABLE_QUEUE_BASE_ID=appxxxxxxxxxxxx
AIRTABLE_QUEUE_TABLE=YourQueueTableNameOrId

# EVENT RSVPs — Blind Test RSVPs (own base or same as Queue)
AIRTABLE_EVENTS_RSVP_BASE_ID=appxxxxxxxxxxxx
AIRTABLE_EVENTS_RSVP_TABLE=RSVPs
# If AIRTABLE_EVENTS_RSVP_BASE_ID is unset, the app uses AIRTABLE_QUEUE_BASE_ID.
```

Optional / other:

```env
NEXT_PUBLIC_AIRTABLE_BASE_ID=appxxxxxxxxxxxx
NEXT_PUBLIC_AIRTABLE_TABLE=tblxxxxxxxxxxxx
AIRTABLE_SETTINGS_TABLE=Settings
AIRTABLE_GUESTFORM_BASE_ID=appxxxxxxxxxxxx
AIRTABLE_GUESTFORM_TABLE_ID=tblxxxxxxxxxxxx
AIRTABLE_BASE_ID=...
AIRTABLE_TABLE_NAME=...
```

### Stripe

```env
STRIPE_SECRET_KEY=sk_live_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxx
```

### Twilio (SMS)

Used for: queue join confirmation, queue notify, Blind Test confirmation, admin send confirmation, form confirmation.

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
```

Optional message overrides:

```env
QUEUE_JOIN_CONFIRMATION_MESSAGE=You're in the tasting queue, {name}. Spot: {position}. We'll text you when it's your turn.
QUEUE_NOTIFY_MESSAGE=Hi {name}! Your guided tasting is ready. Please return to the tasting station within 5 minutes.
```

### Admin (optional)

```env
ADMIN_PASSWORD=your_admin_password
ADMIN_SESSION_SECRET=random_string_for_cookie_signing
```

### App

```env
NODE_ENV=development
VERCEL_ENV=production
```

---

## 2. Airtable setup

### Base 1: STUDIO (bookings)

- **Base ID**: from Airtable URL or API.
- **Table**: one table for paid session bookings.

**Fields (required):**

| Field name   | Type   | Notes                    |
|-------------|--------|--------------------------|
| Name        | text   |                          |
| Phone       | phone/text |                      |
| Email       | email  |                          |
| Amount Paid | number |                          |
| Promo Code  | text   | optional                  |
| Booking Type| text   | optional                  |
| **Event Date** | text | **Required.** Format `YYYY-MM-DD` (e.g. `2026-02-01`). Used for seat counts and display. |

Used by: homepage booking, Stripe webhook (writes here), availability/seat logic.

---

### Base 2: WAITLIST

- **Base ID** / **Table**: from Airtable.

**Fields:** e.g. First Name, Last Name, Phone, Email, Why, Date Submitted, Instagram (adjust to match `src/app/api/submit/route.ts` if you change the form).

Used by: `/waitlist` submit.

---

### Base 3: FEEDBACK

- **Base ID** / **Table ID**: from Airtable.

**Fields:** Phone, Name, Stood Out, Different, Improve, Recommend Score (number), Testimonial (single select or long text).

Used by: `/feedback` (or equivalent) form.

---

### Base 4: QUEUE (in-person tasting queue)

- **Base ID**: `AIRTABLE_QUEUE_BASE_ID`
- **Table name/ID**: `AIRTABLE_QUEUE_TABLE`

**Fields (match exactly for queue features):**

| Field name            | Type    | Notes        |
|-----------------------|---------|-------------|
| Guest Name            | text    |             |
| Phone Number          | phone/text |          |
| Party Size            | number  |             |
| Notes                 | long text | optional  |
| Special Requests      | long text | optional  |
| Text/Call Preference  | single select | e.g. text, call |
| Status                | single select | waiting, notified, in_service, served, skipped, no_show, removed, error |
| Check-in Timestamp    | date/time or text (ISO) | |
| Served Timestamp      | date/time or text | optional |
| Last Notified At      | date/time or text | optional |
| Claimed At            | text    | optional     |
| Claimed By            | text    | optional     |
| Attempt Counter       | number  | optional     |
| Call/Text Log         | long text | optional  |
| Priority Flag (VIP)   | checkbox | optional  |
| Re-added to Queue     | checkbox | optional  |
| Skip Reason           | text    | optional     |
| No-show Reason        | text    | optional     |
| Sort Order            | number  | optional     |

Used by: `/queue` (join), `/team/queue` (list, update, notify, reorder).

---

### Event RSVPs (Blind Test) — same base as Queue

Create a **second table** in the **same base** as the Queue table.

- **Table name**: e.g. `Event RSVPs` (or any name; set `AIRTABLE_EVENTS_RSVP_TABLE` to that name or the table ID).

**Fields (exact names):**

| Field name    | Type        | Notes                    |
|---------------|-------------|--------------------------|
| **Event Id**  | text        | e.g. `2026-03-13`        |
| **Guest Name**| text        |                           |
| **Phone Number** | phone/text |                        |
| **RSVP At**   | date/time or text (ISO) |    |
| **Message Log** | long text | Append-only log of SMS sent. |

Used by: `/taste` RSVP (writes row + sends SMS), `/team/taste` (list, send custom message).

---

## 3. Twilio

1. Sign up at [twilio.com](https://www.twilio.com).
2. Get **Account SID**, **Auth Token**, and a **Phone Number**.
3. Add to `.env.local`:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER` (e.g. `+15551234567`)

SMS is used for:

- **Queue**: join confirmation and “your turn” notify.
- **Blind Test**: RSVP confirmation (date, time, address).
- **Team**: custom messages from `/team/taste` and admin send-confirmation (if used).

---

## 4. Stripe

1. Create a Stripe account and get **Secret key** and **Publishable key**.
2. Create a **Product** (e.g. “TARE Studio Session”) and a **Price** (one-time). Copy the **Price ID** (e.g. `price_xxxx`).
3. In the code, set the studio **Price ID** where checkout is created (e.g. `src/app/page.tsx` or `src/app/api/checkout/route.ts` — search for `price_` or `STUDIO_PRICE_ID`).
4. **Webhook** (production):
   - Stripe Dashboard → Developers → Webhooks → Add endpoint.
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`
   - Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

Webhook writes to the STUDIO Airtable table with the selected **Event Date** from checkout metadata.

---

## 5. Team login (queue + blind test dashboard)

- **URL**: `/team/queue` is the only login screen (single team entry).
- **Password**: Any string that **contains `tare`** in any case (e.g. `tare`, `TARE`, `mytare`, `Tare123`). Check: `src/app/api/queue/_auth.ts`.
- **Storage**: PIN is stored in `localStorage` and sent in the `x-queue-pin` header. No kick-out on 401; users stay “logged in” with the stored PIN.
- From `/team/queue` you can open **TASTE DASHBOARD** to manage Blind Test RSVPs; from `/team/taste` you can go back via **QUEUE DASHBOARD**.

---

## 6. Blind Test event (config)

- **Config file**: `src/config/blind-taste.ts`
- **Title**: “Blind Test” (sensory: coffee, aromatics, etc.)
- **First event**: Friday March 13, 2026, 4:00 PM – 8:00 PM (edit date/time/labels there).
- **Passcode**: Any non-empty string is accepted for RSVP (no real check in code).
- **SMS**: Confirmation message is built in that file (uses `{name}`, `{date}`, `{time}`, `{address}`). Twilio must be configured for SMS to send.

---

## 7. Checklist

- [ ] Airtable PAT created and added to env.
- [ ] All Airtable bases and tables created; field names match (especially **Event Date** on STUDIO, and **Event Id**, **Guest Name**, **Phone Number**, **RSVP At**, **Message Log** on Event RSVPs).
- [ ] `AIRTABLE_QUEUE_BASE_ID`, `AIRTABLE_QUEUE_TABLE`, and `AIRTABLE_EVENTS_RSVP_TABLE` set (Event RSVPs table in same base as Queue).
- [ ] Twilio SID, token, and number in env; SMS tested (e.g. join queue or submit Blind Test RSVP).
- [ ] Stripe keys and webhook secret in env; Price ID set in code; webhook tested (do a test checkout and confirm a row in STUDIO with correct Event Date).
- [ ] Team PIN: use a password that contains `tare`; log in at `/team/queue` and open TASTE DASHBOARD to confirm Event RSVPs and custom messages work.
- [ ] Optional: `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` for admin routes.

After that, the site is ready for studio bookings, waitlist, queue, Blind Test RSVPs, and team dashboards.
