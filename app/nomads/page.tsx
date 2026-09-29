import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NomadsRegistrationForm from "@/components/NomadsRegistrationForm";
import { squareConfig, nomadsSquareReady } from "@/lib/squareConfig";
import { NOMADS_EVENT_ID, nomadsRegistrationOpen } from "@/lib/nomadsEvent";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nomads Café | Secret Coffee Hike | Tide & Trail",
  description:
    "Nomads Café secret coffee hike, October 24 at 9:00 AM. Free registration, with a suggested $5 donation. Bring your mug; we bring the coffee.",
  openGraph: {
    title: "Nomads Café | Secret Coffee Hike",
    description:
      "A coffee shop with no address. October 24 at 9:00 AM. Free to join; suggested $5 donation.",
    images: ["/assets/logos/Nomads-cafe-logo.jpg"],
  },
};

export default async function NomadsCafeSunriseCoffeeHikePage() {
  const registrationReady = nomadsSquareReady();
  const registrationClosed = !nomadsRegistrationOpen();
  const eventId = registrationReady && !registrationClosed ? NOMADS_EVENT_ID : undefined;
  const registrationLabel = eventId ? "Sign up for the hike" : registrationClosed ? "Registration closed" : "Registration details";
  const square = squareConfig();
  return (
    <>
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
                Join <strong>Nomads Café</strong>: a secret-location
                morning hike with hot coffee, a beautiful trail, and a small
                crew of people who would rather spend their morning outside.
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm font-black uppercase tracking-wide">
                <span className="rounded-full bg-[#0C2A3A] px-4 py-2 text-[#F4E7C7]">
                  Saturday, October 24
                </span>
                <span className="rounded-full bg-[#0C2A3A] px-4 py-2 text-[#F4E7C7]">
                  9:00 AM
                </span>
                <span className="rounded-full bg-[#0C2A3A] px-4 py-2 text-[#F4E7C7]">
                  Free · $5 suggested donation
                </span>
                <span className="rounded-full bg-[#E9552D] px-4 py-2 text-white">
                  40 spots
                </span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#register"
                  className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#E9552D] px-7 text-base font-black uppercase tracking-wide text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#cf4421]"
                >
                  {registrationLabel}
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-[#0C2A3A] px-7 text-base font-black uppercase tracking-wide transition hover:bg-[#0C2A3A] hover:text-[#F4E7C7]"
                >
                  How it works
                </a>
              </div>

              <p className="mt-4 text-sm font-semibold text-[#0C2A3A]/70">
                {eventId ? "Registration is free. A donation is entirely optional. " : registrationClosed ? "Registration has closed. " : "Registration will open once the event is ready. "}
                Registration closes Friday, October 23 at 8:00 PM ADT. Registered hikers receive the trailhead coordinates 24 hours before the hike.
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
                  title: eventId ? "Reserve your free spot" : "Watch for registration",
                  text: eventId ? "Register below at no cost. A suggested $5 donation is optional." : "The hike is free, with a suggested $5 donation. Registration opens once the event is ready and closes Friday, October 23 at 8 PM ADT.",
                },
                {
                  n: "02",
                  title: "Watch your inbox",
                  text: "Registered hikers receive the secret trailhead coordinates 24 hours before.",
                },
                {
                  n: "03",
                  title: "Bring your mug",
                  text: "Pack your favourite coffee mug, trail shoes, water, and whatever you need for the weather.",
                },
                {
                  n: "04",
                  title: "We bring the coffee",
                  text: "Meet the group at the announced start time, head out together, and enjoy coffee after the hike.",
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

        {/* FREE REGISTRATION AND OPTIONAL CONTRIBUTION */}
        <section id="register" className="mx-auto max-w-7xl px-5 pb-16 md:px-8 lg:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-[2rem] bg-[#0C2A3A] p-6 text-[#F4E7C7] md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F4A62A]">Free registration</p>
              <h2 className="mt-2 text-3xl font-black uppercase">Come hike with us.</h2>
              {eventId ? (
                <>
                  <p className="my-5 text-[#F4E7C7]/85">Reserve your spot and choose an optional contribution in one checkout. Bring your mug. We’ll bring the coffee.</p>
                  <div className="text-[#0C2A3A]">
                    <NomadsRegistrationForm applicationId={square.applicationId} locationId={square.locationId} environment={square.environment} />
                  </div>
                </>
              ) : (
                <>
                  <p className="my-5 text-[#F4E7C7]/85">{registrationClosed ? "Registration for this hike has closed." : "Registration is temporarily unavailable. Join the newsletter for updates."}</p>
                  {!registrationClosed && <Link href="/newsletter" className="inline-flex rounded-full bg-[#E9552D] px-6 py-3 font-black uppercase text-white">Get registration updates</Link>}
                </>
              )}
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
                thing. Hike first. Coffee second. Stories tend to happen on
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
                  <dd className="text-right font-black">Saturday, October 24</dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
                  <dt className="font-bold text-white/60">Start</dt>
                  <dd className="text-right font-black">9:00 AM ADT</dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
                  <dt className="font-bold text-white/60">Location</dt>
                  <dd className="max-w-xs text-right font-black">
                    Secret — coordinates sent 24 hours before
                  </dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
                  <dt className="font-bold text-white/60">Cost</dt>
                  <dd className="text-right font-black">Free · suggested $5 donation</dd>
                </div>
                <div className="flex justify-between gap-6 border-b border-white/15 pb-4">
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
                notes to registered hikers before the event.
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
              Saturday, October 24 · 9:00 AM
            </p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-[-0.03em] md:text-5xl">
Forty mugs. One secret trail.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-semibold text-white/90">
{eventId ? "Sign up for a free place today." : registrationClosed ? "Registration for this hike is closed." : "Registration for this hike is being prepared."} The hike is free;
              a $5 donation is welcome but never required.
            </p>
            <Link
              href="#register"
              className="mt-7 inline-flex min-h-14 items-center justify-center rounded-full bg-[#0C2A3A] px-8 text-base font-black uppercase tracking-wide text-[#F4E7C7] shadow-lg transition hover:-translate-y-0.5"
            >
              {registrationLabel}
            </Link>
          </div>
        </section>

        {/* MOBILE STICKY CTA */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#F4E7C7]/95 p-3 backdrop-blur md:hidden">
          <Link
            href="#register"
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-[#E9552D] px-5 font-black uppercase tracking-wide text-white shadow-lg"
          >
            {registrationLabel}
          </Link>
        </div>
      </main>
    </>
  );
}
