# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> primary navigation reaches core MVP routes
- Location: e2e/smoke.spec.ts:2:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /Good gear/i })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: /Good gear/i }) resolved to 3 elements:
    1) <h1 class="display mt-7 max-w-3xl text-6xl leading-[.9] text-forest sm:text-7xl lg:text-[88px]">…</h1> aka getByRole('heading', { name: 'Good gear. Another adventure.' })
    2) <h3 class="mt-3 font-black">Give good gear another life.</h3> aka getByRole('heading', { name: 'Give good gear another life.' })
    3) <h2 class="display mt-3 text-4xl leading-[.98] text-forest sm:text-5xl">Good gear, waiting for a second adventure.</h2> aka getByRole('heading', { name: 'Good gear, waiting for a' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /Good gear/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link "Tide & Trail home" [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Tide & Trail — Good Gear. Another Adventure." [ref=e6]
      - navigation [ref=e7]:
        - link "Shop Gear" [ref=e8] [cursor=pointer]:
          - /url: /shop
        - link "Rent" [ref=e9] [cursor=pointer]:
          - /url: /rent
        - link "Sell Gear" [ref=e10] [cursor=pointer]:
          - /url: /sell
        - link "Events" [ref=e11] [cursor=pointer]:
          - /url: /events
        - link "Nomads Café" [ref=e12] [cursor=pointer]:
          - /url: /nomads
        - link "Community" [ref=e13] [cursor=pointer]:
          - /url: /community
        - link "Fresh Drop" [ref=e14] [cursor=pointer]:
          - /url: /drop
      - link "Find gear" [ref=e16] [cursor=pointer]:
        - /url: /shop
  - main [ref=e20]:
    - generic [ref=e22]:
      - generic [ref=e23]:
        - text: Moncton · Bay of Fundy
        - heading "Good gear. Another adventure." [level=1] [ref=e24]: Good gear.Another adventure.
        - paragraph [ref=e25]: "Tide & Trail is an outdoor gear marketplace built around a simple idea: getting outside is better when you have the right gear — and someone to share it with."
        - generic [ref=e26]:
          - link "Find your next adventure" [ref=e27] [cursor=pointer]:
            - /url: /shop
          - link "Find your people" [ref=e30] [cursor=pointer]:
            - /url: /community
        - generic [ref=e31]:
          - generic [ref=e32]: Buy
          - generic [ref=e33]: Sell
          - generic [ref=e34]: Rent
          - generic [ref=e35]: Repair
          - generic [ref=e36]: Connect
      - generic [ref=e37]:
        - img "The Bay of Fundy coastline at golden hour" [ref=e38]
        - generic [ref=e41]:
          - generic [ref=e42]:
            - generic [ref=e43]: Bay of Fundy / NB
            - generic [ref=e44]: Go findyour people.
          - generic [ref=e45]:
            - generic [ref=e46]: Tide & Trail
            - generic [ref=e47]: Good gear. Another adventure.
    - generic [ref=e49]:
      - generic [ref=e50]:
        - heading "Give good gear another life." [level=3] [ref=e58]
        - paragraph [ref=e59]: Curated consignment keeps quality equipment moving instead of gathering dust.
      - generic [ref=e60]:
        - heading "Find your people." [level=3] [ref=e66]
        - paragraph [ref=e67]: Hikes, paddles, coffee and community for people who want to get outside together.
      - generic [ref=e68]:
        - heading "Don't replace it yet." [level=3] [ref=e71]
        - paragraph [ref=e72]: Our future repair studio will help you keep the gear you love going.
    - generic [ref=e73]:
      - generic [ref=e74]:
        - generic [ref=e75]:
          - generic [ref=e76]: The community layer
          - heading "The best part of the adventure might be who you meet." [level=2] [ref=e77]
          - paragraph [ref=e78]: "We're building the thing outdoor life has been missing: a local place to find a trail, a coffee, a paddle buddy, a campfire or simply someone to say hello to."
        - link "Explore community" [ref=e79] [cursor=pointer]:
          - /url: /community
      - generic [ref=e83]:
        - link "Hush Hush community coffee hike poster NOMADS CAFE Sunrise coffee hike Saturday · 7–10 AM · 36 spots The trailhead stays secret until you RSVP. We bring the coffee. You bring a mug. Explore" [ref=e84] [cursor=pointer]:
          - /url: /community
          - generic [ref=e85]:
            - img "Hush Hush community coffee hike poster" [ref=e86]
            - generic [ref=e88]: NOMADS CAFE
          - generic [ref=e89]:
            - generic [ref=e91]:
              - heading "Sunrise coffee hike" [level=3] [ref=e92]
              - generic [ref=e93]: Saturday · 7–10 AM · 36 spots
            - paragraph [ref=e97]: The trailhead stays secret until you RSVP. We bring the coffee. You bring a mug.
            - generic [ref=e98]: Explore
        - link "Hiker overlooking the Fundy coast FOOTPATH The 4-day kit Rent · 3–5 days · Moncton pickup A lightweight, trail-ready kit for people passing through to walk the Fundy Footpath. Explore" [ref=e102] [cursor=pointer]:
          - /url: /rent
          - generic [ref=e103]:
            - img "Hiker overlooking the Fundy coast" [ref=e104]
            - generic [ref=e106]: FOOTPATH
          - generic [ref=e107]:
            - generic [ref=e109]:
              - heading "The 4-day kit" [level=3] [ref=e110]
              - generic [ref=e111]: Rent · 3–5 days · Moncton pickup
            - paragraph [ref=e116]: A lightweight, trail-ready kit for people passing through to walk the Fundy Footpath.
            - generic [ref=e117]: Explore
        - link "Forest trail in Atlantic Canada FIND YOUR PEOPLE Adventure board Looking for company? Share a hike, find a paddle buddy, join a group or simply say hello. Explore" [ref=e121] [cursor=pointer]:
          - /url: /community#board
          - generic [ref=e122]:
            - img "Forest trail in Atlantic Canada" [ref=e123]
            - generic [ref=e125]: FIND YOUR PEOPLE
          - generic [ref=e126]:
            - generic [ref=e128]:
              - heading "Adventure board" [level=3] [ref=e129]
              - generic [ref=e130]: Looking for company?
            - paragraph [ref=e137]: Share a hike, find a paddle buddy, join a group or simply say hello.
            - generic [ref=e138]: Explore
    - generic [ref=e143]:
      - generic [ref=e144]:
        - text: Fresh Drop Tuesday
        - heading "The week's best gear gets its first shot live." [level=2] [ref=e145]
        - paragraph [ref=e146]: Monday is photography and listing day. Tuesday is the drop. Watch on Facebook or Whatnot, grab something before it reaches the site, then shop whatever remains online.
        - generic [ref=e147]:
          - link "See the next drop" [ref=e148] [cursor=pointer]:
            - /url: /drop
          - link "Put gear in the next one" [ref=e155] [cursor=pointer]:
            - /url: /sell
      - generic [ref=e156]:
        - img "Gear prepared for a Tide & Trail drop" [ref=e157]
        - generic [ref=e159]: One day. One drop. New stories.
    - generic [ref=e162]:
      - generic [ref=e163]:
        - generic [ref=e164]:
          - generic [ref=e165]: Just landed
          - heading "Good gear, waiting for a second adventure." [level=2] [ref=e166]
          - paragraph [ref=e167]: Every piece has a history. Every piece is inspected, priced honestly and ready to get back outside.
        - link "Shop all gear" [ref=e168] [cursor=pointer]:
          - /url: /shop
      - generic [ref=e172]:
        - text: The Gear Room is preparing the next collection.
        - link "Get the drop alert." [ref=e173] [cursor=pointer]:
          - /url: /newsletter
    - generic [ref=e176]:
      - generic [ref=e177]:
        - text: Fundy Footpath
        - heading "Walk in. We'll help you gear up." [level=2] [ref=e178]: Walk in.We'll help you gear up.
        - paragraph [ref=e179]: Passing through Moncton for the Fundy Footpath? Rent a lightweight kit for 3–5 days, pick it up here, and return it when your adventure is done.
        - link "See Footpath rentals" [ref=e180] [cursor=pointer]:
          - /url: /rent
      - generic [ref=e183]:
        - img "Hiker overlooking the Bay of Fundy" [ref=e184]
        - generic [ref=e186]: Moncton is your basecamp for the Bay of Fundy.
    - generic [ref=e188]:
      - generic [ref=e189]:
        - text: Hush Hush · $5
        - heading "Sometimes the best plans are the ones you don't know yet." [level=2] [ref=e190]
        - paragraph [ref=e191]: Secret trailheads. Pop-up coffee. A small group of strangers who might not be strangers by the end of the morning.
        - link "See the next secret adventure" [ref=e192] [cursor=pointer]:
          - /url: /community
      - img "Tide & Trail Hush Hush community event" [ref=e194]
    - generic [ref=e196]:
      - generic [ref=e197]:
        - heading "Send a picture." [level=3] [ref=e201]
        - paragraph [ref=e202]: We give you a recommended selling price before you haul anything anywhere.
        - link "Sell your gear" [ref=e203] [cursor=pointer]:
          - /url: /sell
      - generic [ref=e206]:
        - heading "Rent for the big trip." [level=3] [ref=e210]
        - paragraph [ref=e211]: Especially useful for visitors passing through for 3–5 days on the Footpath.
        - link "Build a kit" [ref=e212] [cursor=pointer]:
          - /url: /rent
      - generic [ref=e215]:
        - heading "Come for the people." [level=3] [ref=e221]
        - paragraph [ref=e222]: "The missing layer: events, trail knowledge and people who actually want to make plans."
        - link "Join the community" [ref=e223] [cursor=pointer]:
          - /url: /community
  - contentinfo [ref=e226]:
    - generic [ref=e227]:
      - generic [ref=e228]:
        - link "Tide & Trail home" [ref=e229] [cursor=pointer]:
          - /url: /
          - img "Tide & Trail — Good Gear. Another Adventure." [ref=e231]
        - paragraph [ref=e232]: A community-first outdoor marketplace for good gear, new adventures, and the people you meet along the way.
        - paragraph [ref=e233]: Moncton · Bay of Fundy · New Brunswick
      - generic [ref=e234]:
        - heading "Gear" [level=3] [ref=e235]
        - generic [ref=e236]:
          - link "Shop gear" [ref=e237] [cursor=pointer]:
            - /url: /shop
          - link "Fresh Drop Tuesday" [ref=e238] [cursor=pointer]:
            - /url: /drop
          - link "Footpath rentals" [ref=e239] [cursor=pointer]:
            - /url: /rent
          - link "Sell your gear" [ref=e240] [cursor=pointer]:
            - /url: /sell
          - link "How we grade gear" [ref=e241] [cursor=pointer]:
            - /url: /gear-conditions
      - generic [ref=e242]:
        - heading "Community" [level=3] [ref=e243]
        - generic [ref=e244]:
          - link "Events" [ref=e245] [cursor=pointer]:
            - /url: /events
          - link "Nomads Café" [ref=e246] [cursor=pointer]:
            - /url: /nomads
          - link "Adventure Board" [ref=e247] [cursor=pointer]:
            - /url: /community#board
          - link "Membership" [ref=e248] [cursor=pointer]:
            - /url: /membership
          - link "Newsletter" [ref=e249] [cursor=pointer]:
            - /url: /newsletter
      - generic [ref=e250]:
        - heading "Tide & Trail" [level=3] [ref=e251]
        - generic [ref=e252]:
          - link "About" [ref=e253] [cursor=pointer]:
            - /url: /about
          - link "Repair studio" [ref=e254] [cursor=pointer]:
            - /url: /repair
          - link "Privacy" [ref=e255] [cursor=pointer]:
            - /url: /privacy
          - link "Terms" [ref=e256] [cursor=pointer]:
            - /url: /terms
    - generic [ref=e258]:
      - generic [ref=e259]: © 2026 Tide & Trail. Good gear. Another adventure.
      - link "hello@tideandtrail.ca" [ref=e260] [cursor=pointer]:
        - /url: mailto:hello@tideandtrail.ca
```

# Test source

```ts
  1 | import { expect, test } from '@playwright/test'
> 2 | test('primary navigation reaches core MVP routes',async({page})=>{await page.goto('/');await expect(page.getByRole('heading',{name:/Good gear/i})).toBeVisible();for(const path of ['/shop','/sell','/rent','/events','/nomads','/community']){await page.goto(path);await expect(page.locator('h1')).toBeVisible();expect(await page.locator('body').evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true)}})
    |                                                                                                                                                    ^ Error: expect(locator).toBeVisible() failed
  3 | test('mobile menu exposes core navigation',async({page,isMobile})=>{test.skip(!isMobile);await page.goto('/');await page.getByRole('button',{name:'Menu'}).click();await expect(page.getByRole('link',{name:'Nomads Café'})).toBeVisible();await page.getByRole('link',{name:'Sell Gear'}).click();await expect(page).toHaveURL(/\/sell$/)})
  4 | test('rental CTA opens a working request form',async({page})=>{await page.goto('/rent');await page.getByRole('link',{name:'Reserve this kit'}).first().click();await expect(page.getByRole('heading',{name:'Reserve your trail kit.'})).toBeVisible();await expect(page.getByText('Footpath Essential',{exact:true})).toBeVisible()})
  5 | 
```