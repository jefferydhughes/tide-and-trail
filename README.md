# Tide & Trail V3 — Community + Consignment + Supabase

This version preserves the restored visual/emotional Tide & Trail site and adds real MVP data capture through Supabase.

## New working flows

### Sell Your Equipment
`/sell`
- Customer details
- Item / brand / category / condition
- Original purchase price
- Cash vs Tide & Trail credit preference
- Postal code for pickup
- Description
- Up to 6 photos
- Server route uploads photos to the private `consignment-photos` Supabase Storage bucket
- Submission is saved to `consignment_submissions`

### Memberships
`/membership`
- Community (free)
- Trail Member ($5/month)
- Founding Member ($10/month)
- Saves member signup to Supabase
- Payment is deliberately not connected yet; Stripe can be added after the membership proposition is validated.

### Newsletter
`/newsletter`
- Saves subscribers to `newsletter_subscribers`
- Ready to connect to an email provider later

### Events
`/events`
- Reads published events from Supabase
- `/events/[slug]` provides event details + signup
- Capacity checking is handled server-side
- Registrations save to `event_signups`

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local`.
4. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Never expose the service role key to the browser or prefix it with `NEXT_PUBLIC_`.

## Install / run

npm install
npm run dev

## Deploy to Vercel

Add the same two Supabase environment variables to the Vercel project. `NEXT_PUBLIC_SITE_URL` is optional for this MVP.

## Next logical integrations

1. Supabase Auth for customer accounts.
2. Stripe for paid memberships and Hush Hush/event payments.
3. Admin dashboard for reviewing consignment submissions.
4. Supabase Storage image gallery for products.
5. Product/catalog tables and inventory states.
6. Automated email/SMS confirmations.
