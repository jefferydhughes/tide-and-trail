import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nomads Café | Secret Coffee Hike | Tide & Trail",
  description:
    "A secret-location coffee hike by Tide & Trail. September 26 at 8:00 AM. Bring your mug, we bring the coffee. Only 40 spots.",
  openGraph: {
    title: "Nomads Café | Secret Coffee Hike",
    description:
      "A coffee shop with no address. Secret trail. Great coffee. 40 spots. September 26 at 8:00 AM.",
    images: ["/assets/logos/Nomads-cafe-logo.jpg"],
  },
};

const CHECKOUT_URL =
  "https://checkout.square.site/merchant/MLJZME1095G4W/checkout/EZHJOIOQ2USAD7ZHQ653FTQC";

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Nomads Café — Secret Coffee Hike",
  description:
    "A secret-location coffee hike hosted by Tide & Trail. Bring your mug; we bring the coffee. Trailhead coordinates are sent 24 hours before the event.",
  startDate: "2026-09-26T08:00:00-03:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Secret trail location — coordinates sent 24 hours before",
    address: {
      "@type": "PostalAddress",
      addressRegion: "New Brunswick",
      addressCountry: "CA",
    },
  },
  organizer: {
    "@type": "Organization",
    name: "Tide & Trail",
    url: "https://www.tide-and-trail.com",
  },
  offers: {
    "@type": "Offer",
    price: "5.00",
    priceCurrency: "CAD",
    availability: "https://schema.org/LimitedAvailability",
    url: CHECKOUT_URL,
  },
};

export default function NomadsCafeSunriseCoffeeHikePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <main className="min-h-screen bg-[#F4E7C7] text-[#0C2A3A]">
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-[#0C2A3A]/15">
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #0C2A3A 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-10 md:grid-cols-2 md:items-center md:px-8 md:py-16 lg:px-12">
            <div className="order-2 md:order-1">
              <p className="mb-4 inline-flex rounded-full border border-[#0C2A3A]/25 bg-white/40 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                Tide & Trail presents
              </p>

              <h1 className="max-w-3xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                A coffee shop
                <span className="block text-[#E9552D]">with no address.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed md:text-xl">
                Join the first <strong>Nomads Café</strong>: a secret-location
                morning hike with hot coffee, a beautiful trail, and a small
                crew of people who would rather spend their morning outside.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm font-black uppercase tracking-wide">
                <span className="rounded-full bg-[#0C2A3A] px-4 py-2 text-[#F4E7C7]">
                  Sept 26
                </span>
                <span className="rounded-full bg-[#0C2A3A] px-4 py-2 text-[#F4E7C7]">
                  8:00 AM
                </span>
                <span className="rounded-full bg-[#0C2A3A] px-4 py-2 text-[#F4E7C7]">
                  $5
                </span>
                <span className="rounded-full bg-[#E9552D] px-4 py-2 text-white">
                  Only 40 spots
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={CHECKOUT_URL}
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#E9552D] px-7 text-base font-black uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4421]"
                >
                  Buy Tickets — $5
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[#0C2A3A] px-7 text-base font-black uppercase tracking-wide transition hover:bg-[#0C2A3A] hover:text-[#F4E7C7]"
                >
                  How it works
                </a>
              </div>

              <p className="mt-4 text-sm font-semibold text-[#0C2A3A]/70">
                Trailhead coordinates are emailed to ticket holders 24 hours
                before the hike.
              </p>
            </div>

            <div className="order-1 md:order-2">
              <div className="mx-auto max-w-xl">
                <Image
                  src="/assets/logos/Nomads-cafe-logo.jpg"
                  alt="Nomads Café — Good Coffee. Better Stories."
                  width={1536}
                  height={1024}
                  priority
                  className="h-auto w-full drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* VALUE STRIP */}
        <section className="bg-[#0C2A3A] text-[#F4E7C7]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 md:grid-cols-4">
            {[
              ["☕", "Coffee provided"],
              ["🥾", "Easygoing group hike"],
              ["📍", "Secret trailhead"],
              ["🌲", "40 people max"],
            ].map(([icon, label]) => (
              <div
                key={label}
                className="flex items-center justify-center gap-3 bg-[#0C2A3A] px-4 py-5 text-center text-sm font-black uppercase tracking-wide"
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#E9552D]">
                The plan
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.03em] md:text-5xl">
                Good coffee.
                <br />
                Better stories.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#0C2A3A]/80">
                Nomads Café is part coffee pop-up, part trail meetup. No polished
                café. No complicated agenda. Just a reason to get outside, meet
                a few good humans, and start the day somewhere worth remembering.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  n: "01",
                  title: "Grab a ticket",
                  text: "Your $5 ticket reserves one of only 40 places.",
                },
                {
                  n: "02",
                  title: "Watch your inbox",
                  text: "We send the secret trailhead coordinates 24 hours before.",
                },
                {
                  n: "03",
                  title: "Bring your mug",
                  text: "Pack your favourite coffee mug, trail shoes, water, and whatever you need for the weather.",
                },
                {
                  n: "04",
                  title: "We bring the coffee",
                  text: "Meet us at 8:00 AM, meet people, and head out together, drink coffee, leave when you need to.",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  className="rounded-3xl border border-[#0C2A3A]/15 bg-white/35 p-6"
                >
                  <div className="text-sm font-black tracking-[0.2em] text-[#E9552D]">
                    {item.n}
                  </div>
                  <h3 className="mt-3 text-xl font-black uppercase">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-[#0C2A3A]/75">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT TO EXPECT */}
        <section className="border-y border-[#0C2A3A]/15 bg-[#E8D6AD]">
          <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#E9552D]">
                What to expect
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.03em] md:text-5xl">
                This is for people who want more outside in their life.
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-[#0C2A3A]/80">
                Come with friends or come solo. Nomads Café is designed to make
                it easy to meet people without forcing the awkward networking
                thing. Trail first. Hike second. Stories tend to happen on
                their own.
              </p>
            </div>

            <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
              {[
                ["Come solo", "You will not be the only one."],
                ["Bring a friend", "Adventure is better shared."],
                ["Come curious", "The location stays secret until the day before."],
              ].map(([title, text]) => (
                <div
                  key={title}
                  className="rounded-3xl bg-[#F4E7C7] p-6 text-center shadow-sm"
                >
                  <h3 className="text-xl font-black uppercase">{title}</h3>
                  <p className="mt-2 text-[#0C2A3A]/70">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DETAILS */}
        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 lg:px-12">
          <div className="grid gap-10 rounded-[2rem] bg-[#0C2A3A] p-7 text-[#F4E7C7] md:grid-cols-2 md:p-10 lg:p-12">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F4A62A]">
                The details
              </p>
              <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.03em]">
                Nomads Café
                <br />
                 Secret Coffee Hike
              </h2>

              <dl className="mt-8 space-y-4 text-base">
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
                  <dt className="font-bold text-white/60">Date</dt>
                  <dd className="text-right font-black">September 26</dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
                  <dt className="font-bold text-white/60">Start</dt>
                  <dd className="text-right font-black">8:00 AM</dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
                  <dt className="font-bold text-white/60">Location</dt>
                  <dd className="max-w-xs text-right font-black">
                    Secret — coordinates sent 24 hours before
                  </dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
                  <dt className="font-bold text-white/60">Price</dt>
                  <dd className="text-right font-black">$5 CAD</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="font-bold text-white/60">Capacity</dt>
                  <dd className="text-right font-black">40 people</dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-col justify-center rounded-3xl bg-[#F4E7C7] p-7 text-[#0C2A3A]">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#E9552D]">
                Bring
              </p>
              <ul className="mt-5 space-y-3 text-lg font-bold">
                <li>✓ Your favourite mug</li>
                <li>✓ Trail-appropriate footwear</li>
                <li>✓ Water</li>
                <li>✓ Layers for the morning weather</li>
                <li>✓ A willingness to meet someone new</li>
              </ul>

              <p className="mt-7 rounded-2xl bg-[#E8D6AD] p-4 text-sm font-semibold leading-relaxed">
                We&apos;ll send final trail information and any weather-specific
                notes to ticket holders before the event.
              </p>
            </div>
          </div>
        </section>

        {/* BRAND / TRUST */}
        <section className="border-t border-[#0C2A3A]/15 bg-white/30">
          <div className="mx-auto max-w-4xl px-5 py-14 text-center md:px-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#E9552D]">
              Hosted by Tide & Trail
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-[-0.03em] md:text-4xl">
              More community. More adventure. More reasons to get outside.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#0C2A3A]/75">
              Tide & Trail is a New Brunswick outdoor community and marketplace
              built around a simple idea: good gear deserves another adventure,
              and so do we.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex font-black uppercase tracking-wide underline decoration-[#E9552D] decoration-2 underline-offset-4"
            >
              Learn more about Tide & Trail
            </Link>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-[#E9552D] px-5 py-14 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/75">
              September 26 · 8:00 AM
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.03em] md:text-5xl">
              Forty mugs. One secret trail.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-semibold text-white/90">
              Reserve your place now. We&apos;ll send the coordinates 24 hours
              before the hike.
            </p>
            <a
              href={CHECKOUT_URL}
              className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#0C2A3A] px-8 text-base font-black uppercase tracking-wide text-[#F4E7C7] shadow-lg transition hover:-translate-y-0.5"
            >
              Buy Tickets — $5
            </a>
          </div>
        </section>

        {/* MOBILE STICKY CTA */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#F4E7C7]/95 p-3 backdrop-blur md:hidden">
          <a
            href={CHECKOUT_URL}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#E9552D] px-5 font-black uppercase tracking-wide text-white shadow-lg"
          >
            Buy Tickets — $5
          </a>
        </div>
      </main>
    </>
  );
}
