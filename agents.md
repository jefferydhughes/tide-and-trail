# Tide & Trail — Codex Project Instructions

## Project Overview

Tide & Trail is a community-first outdoor gear consignment marketplace
based in Moncton, New Brunswick, near the Bay of Fundy.

This is not intended to feel like a generic ecommerce website.

The brand combines:

1. Outdoor gear
2. Community
3. Environmental reuse
4. Local adventure

Core idea:

**Good Gear. Another Adventure.**

The website should feel emotional, adventurous, welcoming, local,
photographic, and community-driven.

---

## Technology

The current application uses:

- Next.js
- App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel
- GitHub

Supabase is the primary database and backend service.

Vercel deploys the production site from GitHub.

---

# IMPORTANT: PRESERVE EXISTING WORK

Before making changes:

1. Inspect the existing project.
2. Understand the current implementation.
3. Preserve working functionality.
4. Prefer modifying existing components over replacing entire pages.
5. Do not remove content simply to simplify a page.
6. Run the production build after significant changes.

Do NOT redesign the application from scratch unless explicitly instructed.

---

# Brand Rules

Preserve the existing Tide & Trail visual identity.

Use existing brand assets and photography from `/public` whenever possible.

Do NOT replace existing photography with generic illustrations,
gradient graphics, placeholder icons, or abstract hero artwork unless
explicitly requested.

Photography is an important part of the emotional appeal of the brand.

The site should feel connected to:

- Bay of Fundy
- Fundy National Park
- New Brunswick
- Hiking
- Camping
- Paddling
- Backpacking
- Coffee
- Community
- Used outdoor gear

---

# Core Brand Pillars

## COMMUNITY

Tide & Trail should help people find people to adventure with.

Important concepts include:

- Nomads Café
- Secret-location coffee hikes
- Adventure Board
- Community hikes
- Paddles
- Trail events
- Local outdoor community

Community is a core part of the business, not a secondary marketing feature.

---

## GEAR

Tide & Trail helps outdoor equipment continue its useful life.

Core functions:

- Buy used gear
- Sell/consign gear
- Rent gear
- Fresh Drop Tuesday
- Live selling
- Gear grading
- Gear stories
- Eventually repair gear

---

## ENVIRONMENT

The environmental message should focus on extending the useful life
of good equipment rather than preachy sustainability messaging.

Reuse.

Repair.

Rent.

Pass gear forward.

Keep good gear outside.

---

# Consignment

The Sell Your Gear flow is a critical part of the application.

Customers should be able to submit:

- Name
- Email
- Phone
- Postal code
- Gear/item
- Brand
- Category
- Condition
- Purchase information
- Description
- Photos
- Cash/store-credit preference
- Adventure story

The adventure story is important.

Prompt:

**What adventures has this gear been on?**

Examples:

- Completed the Dobson in a Day
- Climbed Mount Carleton
- Ran a marathon
- Hiked the Fundy Footpath
- Camped throughout Fundy National Park

Gear should feel like it has a history rather than simply being "used."

---

# Gear Conditions

Preserve the gear-condition system.

Current intended grades include:

- Pristine
- Excellent
- Good
- Worn & Ready
- Repair / Project

There should be a customer-facing explanation of these grades.

Condition descriptions should be honest and transparent.

---

# Gear Room

The Gear Room is the internal operating system for consignment.

Desired workflow:

NEW
↓
REVIEWING
↓
ACCEPTED
↓
DROP-OFF
↓
PHOTOGRAPHY
↓
GRADED
↓
PRICED
↓
READY FOR TUESDAY
↓
LIVE / ONLINE
↓
SOLD
↓
PAID

The Gear Room should eventually allow Tide & Trail staff to manage
a consignment through its entire lifecycle.

---

# Consignor Communication

The system should support simple responses such as:

- Submission received
- Could you send more pictures?
- Things look great
- Arrange drop-off
- Item accepted
- Item declined
- Item listed
- Item sold
- Payout ready

For now, preserve the existing message/queue architecture.

Do not introduce paid services without explicit approval.

The business is currently being launched with a very lean budget.

---

# Fresh Drop Tuesday

Fresh Drop Tuesday is a central merchandising and marketing concept.

Typical operating rhythm:

MONDAY
- Intake
- Inspect
- Clean
- Grade
- Photograph
- Price
- Prepare listings

TUESDAY
- Preview
- Live selling
- Fresh Drop
- Remaining inventory goes online

Fresh Drop Tuesday should feel like an event rather than simply
"new products."

---

# Nomads Café

Nomads Café is Tide & Trail's outdoor/community coffee concept.

Events may include secret-location hikes where participants receive
trailhead coordinates before the event.

Core concept:

**Bring your mug. We'll bring the coffee.**

Nomads Café should feel slightly irreverent, adventurous, retro,
welcoming and fun.

---

# Adventure Board

Do not remove the Adventure Board.

The Adventure Board allows people to:

- Post an adventure
- Find companions
- Join hikes
- Find paddling partners
- Organize local adventures

The underlying purpose is:

**Find your people.**

---

# Fundy Footpath Rentals

Tide & Trail intends to rent equipment to visitors completing the
Fundy Footpath and other regional adventures.

Typical rental period:

3–5 days.

Potential rental categories include:

- Tents
- Backpacks
- Sleeping bags
- Sleeping pads
- Trekking poles
- Cooking equipment

This should eventually support packages rather than requiring
customers to rent every item individually.

---

# Future Repair Desk

Tide & Trail may eventually offer gear repair.

Core positioning:

**Not done adventuring yet?**

Repair should extend the life of equipment before replacement.

Do not build major repair functionality unless explicitly requested.

---

# Supabase Rules

Supabase is production infrastructure.

Before changing database-related code:

1. Inspect the existing schema.
2. Inspect existing API routes.
3. Check for dependencies.
4. Preserve existing data compatibility.

Never expose:

`SUPABASE_SERVICE_ROLE_KEY`

to browser/client code.

It must remain server-side.

Variables beginning with `NEXT_PUBLIC_` may be exposed to the browser.

Do not place secrets directly in source files.

---

# Database Changes

Do not casually modify production tables.

When database changes are necessary:

1. Explain the required schema change.
2. Create SQL migration/update code.
3. Preserve existing rows whenever possible.
4. Prefer `ADD COLUMN IF NOT EXISTS` and other safe migrations where appropriate.
5. Identify any manual Supabase step required.

Do not delete production data without explicit approval.

---

# Ecommerce

The ecommerce experience should eventually support:

- Product catalog
- Shop by adventure
- Product details
- Cart
- Checkout
- Inventory
- Fresh Drops
- Consignment inventory

NextMerce or similar ecommerce implementations may be used as
technical references.

Do NOT replace the Tide & Trail brand experience with a generic
ecommerce template.

Commerce functionality should be integrated underneath the existing
Tide & Trail experience.

---

# Content Preservation

Important existing content includes:

- Tide & Trail photography
- Community content
- Nomads Café
- Adventure Board
- Events
- Fundy Footpath
- Gear Conditions
- Fresh Drop Tuesday
- Sell Your Gear
- Membership
- Newsletter
- Rentals
- Gear Room

Do not remove these when improving another part of the site.

---

# Development Workflow

Before significant work:

1. Inspect relevant files.
2. Explain briefly what will change.
3. Make focused changes.
4. Avoid unrelated refactors.
5. Run:

`npm run build`

6. Fix TypeScript/Next.js build errors introduced by the change.
7. Summarize changed files.

Do not claim a feature works unless it has actually been tested
or clearly state what remains untested.

---

# Current Priority

The immediate goal is to complete the Tide & Trail MVP.

Prioritize:

1. Working consignment intake
2. Gear Room
3. Consignor communication
4. Product/inventory workflow
5. Fresh Drop Tuesday
6. Ecommerce/catalog
7. Events and Nomads Café registration
8. Membership/newsletter
9. Rentals
10. Adventure Board

Avoid building speculative features before the core operating
workflow works.

---

# Guiding Principle

When choosing between:

A polished generic ecommerce experience

and

A slightly unconventional experience that feels unmistakably
Tide & Trail

choose Tide & Trail.

**Community. Gear. Environment.**

**Good Gear. Another Adventure.**