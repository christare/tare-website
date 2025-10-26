# Airtable Configuration Guide

## 📊 Your Airtable Setup

You have **THREE separate Airtable bases** for different purposes:

### 1. **STUDIO Bookings Base** (Seat Tracking with Event Date)
- **Base ID**: `app2NBRGBM2U6uuKO`
- **Table ID**: `tblB2i9J37It1akPf`
- **Fields**: Name, Phone, Email, Amount Paid, Promo Code, Booking Type, **Event Date**
- **Used by**: Main homepage (`/`), Studio bookings, Stripe webhooks, Admin dashboard

### 2. **Waitlist Base** (General Submissions)
- **Base ID**: `app8dactae5SQZLqH`
- **Table ID**: `tbl9pXSdHRIG47ad2`
- **Fields**: First Name, Last Name, Phone, Email, Why, Date Submitted, Instagram
- **Used by**: Waitlist page (`/waitlist`)

### 3. **Feedback Base** (Post-Experience Feedback)
- **Base Name**: `Feedback`
- **Base ID**: `appFFpFNdqtVIvka9`
- **Table Name**: `Feedback Table 1`
- **Table ID**: `tblp5vDDAqvlGaEVc`
- **Fields**: Phone, Name, Stood Out, Different, Improve, Recommend Score, Testimonial
- **Used by**: Feedback page (`/feedback`)

---

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```env
# Airtable API Key (shared across all bases)
NEXT_PUBLIC_AIRTABLE_PAT=your_airtable_personal_access_token

# STUDIO Bookings (for seat tracking with Event Date)
NEXT_PUBLIC_AIRTABLE_STUDIO_BASE_ID=app2NBRGBM2U6uuKO
NEXT_PUBLIC_AIRTABLE_STUDIO_TABLE=tblB2i9J37It1akPf

# Waitlist Submissions (separate base)
NEXT_PUBLIC_AIRTABLE_WAITLIST_BASE_ID=app8dactae5SQZLqH
NEXT_PUBLIC_AIRTABLE_WAITLIST_TABLE=tbl9pXSdHRIG47ad2

# Feedback Form (post-experience feedback)
AIRTABLE_FEEDBACK_BASE_ID=appFFpFNdqtVIvka9
AIRTABLE_FEEDBACK_TABLE_ID=tblp5vDDAqvlGaEVc

# Legacy variables (kept for backwards compatibility)
NEXT_PUBLIC_AIRTABLE_BASE_ID=app2NBRGBM2U6uuKO
NEXT_PUBLIC_AIRTABLE_TABLE=tblB2i9J37It1akPf

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

---

## 🎯 How It Works

### **Home Page (STUDIO Bookings)**
1. User purchases ticket → Stripe checkout
2. Webhook fires → Saves to **STUDIO table** with `Event Date`
3. Availability API → Counts bookings where `Event Date = '2025-10-26'`
4. Frontend → Shows: `16 - (bookings count) = available seats`

### **Waitlist Page**
1. User submits form → Saves to **WAITLIST table**
2. No seat counting needed
3. Just collects First Name, Last Name, Email, etc.

### **Feedback Page**
1. User submits feedback after experience → Saves to **FEEDBACK table**
2. Collects Phone (required), Name (optional), experience feedback, recommendations
3. Single-select testimonial permission field

---

## 📝 What's Been Updated

### Files Modified:
1. `src/lib/airtable-seats.ts` - Now uses `getStudioBookingsTable()` function
2. `src/app/api/webhooks/stripe/route.ts` - Uses STUDIO-specific env vars
3. `src/app/api/availability/route.ts` - Queries STUDIO table
4. `src/app/api/admin/bookings/route.ts` - Displays STUDIO bookings
5. `src/app/feedback/page.tsx` - NEW: Feedback form page
6. `src/app/api/feedback/route.ts` - NEW: Feedback form API handler

### Files Still Using Old Env Vars:
- `src/app/waitlist/page.tsx` - Still uses `NEXT_PUBLIC_AIRTABLE_BASE_ID` and `NEXT_PUBLIC_AIRTABLE_TABLE`
- **This is intentional!** The waitlist should continue using the general variables.

---

## ✅ Next Steps

1. **Update your `.env.local` file** with the values above
2. **Restart your dev server**: `npm run dev`
3. **Test the homepage** - it should now query the correct STUDIO table
4. **Test the waitlist** - it should continue working with the WAITLIST base
5. **Test the feedback form** - navigate to `/feedback` to test post-experience feedback

---

## 🚨 Important Notes

- The code has **fallback logic**: If STUDIO-specific vars aren't set, it uses the general ones
- Waitlist functionality won't break - it uses separate variables
- All three bases can have different fields and structures
- The STUDIO table MUST have an `Event Date` field for seat tracking to work
- The FEEDBACK table requires: Phone, Name, Stood Out, Different, Improve, Recommend Score (number), Testimonial (single select)

