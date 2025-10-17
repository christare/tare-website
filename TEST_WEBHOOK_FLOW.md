# Testing Webhook Flow

## The Complete Flow:
1. Customer clicks "RESERVE YOUR SEAT" on homepage
2. `/api/checkout` creates Stripe checkout session
3. Customer completes payment (or uses promo code for $0)
4. **Stripe sends webhook** to `https://your-domain.com/api/webhooks/stripe`
5. **Your webhook code** receives the event and saves to Airtable

## Is Your Webhook Even Running?

### Check Stripe Dashboard:
1. Go to https://dashboard.stripe.com/webhooks
2. Look for your production webhook endpoint
3. Check if it's sending events to the correct URL
4. Look at the "Events" tab to see if webhooks are firing

### Check Production Logs:
After making a booking, look for these logs:
- `🎫 Checkout completed:` - Webhook received the event
- `📝 Attempting to save to Airtable with fields:` - About to save
- `✅ Successfully saved to Airtable:` - Saved successfully

### If You DON'T See These Logs:
**The webhook isn't firing!** Possible reasons:
- Webhook URL in Stripe is wrong
- Using test mode in Stripe but production on your site (or vice versa)
- Webhook secret is wrong
- 100% promo codes bypass webhooks entirely

### Quick Test:
Make a **PAID** booking (not comp) and check if:
- Booking appears in Airtable ✓
- Event Date is filled in ✓

If paid bookings work but comp bookings don't, that confirms comp tickets bypass webhooks.

