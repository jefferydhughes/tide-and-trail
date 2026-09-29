'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

type Card = {
  attach: (element: HTMLElement) => Promise<void>
  tokenize: (details: { amount: string; currencyCode: string; intent: 'CHARGE'; customerInitiated: true; sellerKeyedIn: false }) => Promise<{ status: string; token?: string; errors?: { type?: string; code?: string; field?: string }[] }>
  destroy: () => Promise<void>
}
type SquareWindow = Window & {
  Square?: { payments: (applicationId: string, locationId: string) => { card: () => Promise<Card> } }
}

const choices = [0, 5, 10, 20]

export default function NomadsRegistrationForm({
  applicationId, locationId, environment,
}: { applicationId?: string; locationId?: string; environment?: string }) {
  const [amount, setAmount] = useState(5)
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState('')
  const inFlight = useRef(false)
  const details = useRef<Record<string, unknown> | null>(null)
  const [custom, setCustom] = useState('')
  const [ready, setReady] = useState(false)
  const [cardReady, setCardReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')
  const card = useRef<Card | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const key = useRef<string | null>(null)
  const paymentToken = useRef<string | null>(null)

  const dollars = amount === -1 ? Number(custom) : amount
  const cents = Math.round(dollars * 100)
  const validAmount = amount === 0 || Number.isFinite(dollars) && Number.isInteger(cents) && cents >= 100 && cents <= 50000 &&
    (amount !== -1 || /^\d{1,3}(?:\.\d{1,2})?$/.test(custom))
  const configured = !!(applicationId && locationId && ['sandbox', 'production'].includes(environment || ''))

  const showCard = amount !== 0 && !complete

  useEffect(() => {
    if (!configured || !ready || !showCard || !container.current) return
    let cancelled = false
    let instance: Card | undefined
    const target = container.current
    setCardReady(false)
    async function mount() {
      try {
        const square = (window as SquareWindow).Square
        if (!square) throw new Error('Square is unavailable')
        instance = await square.payments(applicationId!, locationId!).card()
        if (cancelled) { await instance.destroy(); return }
        await instance.attach(target)
        if (cancelled) { await instance.destroy(); return }
        card.current = instance
        setCardReady(true)
      } catch {
        if (cancelled) return
        setError('The card form could not load. Please try again later.')
      }
    }
    void mount()
    return () => {
      cancelled = true
      if (instance && card.current === instance) void instance.destroy()
      card.current = null
    }
  }, [configured, ready, showCard, applicationId, locationId])

  async function pay(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!configured || !validAmount || (amount !== 0 && !card.current) || inFlight.current) return
    const form = new FormData(event.currentTarget)
    const registration = details.current || {
      name: form.get('name'), email: form.get('email'), phone: form.get('phone'),
      guests: Number(form.get('guests')), notes: form.get('notes'), marketingOptIn: form.get('marketing') === 'on',
    }
    inFlight.current = true
    setLoading(true)
    setError('')
    try {
      if (amount !== 0 && !paymentToken.current) {
        const token = await card.current!.tokenize({
          amount: dollars.toFixed(2), currencyCode: 'CAD', intent: 'CHARGE',
          customerInitiated: true, sellerKeyedIn: false,
        })
        if (token.status !== 'OK' || !token.token) {
          const fields = [...new Set((token.errors || []).map(error => ({
            cardnumber: 'card number', expirationdate: 'expiry date', cvv: 'security code', postalcode: 'postal code',
          }[(error.field || '').replace(/[^a-z]/gi, '').toLowerCase()])).filter(Boolean))]
          const codes = (token.errors || []).map(error => error.type || error.code).filter(code => code && /^[a-zA-Z_]{1,80}$/.test(code))
          throw new Error(fields.length
            ? `Please check your ${fields.join(', ')}.`
            : `Card verification failed${codes.length ? ` (${codes.join(', ')})` : ''}. Please try again. Your registration has not been submitted.`)
        }
        paymentToken.current = token.token
      }
      key.current ||= crypto.randomUUID()
      details.current = registration
      setSubmitted(true)
      const response = await fetch('/api/nomads/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...registration, amountCents: cents, sourceId: paymentToken.current, idempotencyKey: key.current }),
      })
      const result = await response.json()
      if (!response.ok || !result.ok) {
        if (result.cardDeclined) paymentToken.current = null
        if (result.canEdit) {
          details.current = null
          key.current = null
          paymentToken.current = null
          setSubmitted(false)
        }
        throw new Error(result.error || 'Registration could not be confirmed. Retry here with the same details.')
      }
      setOrderId(result.orderId)
      setComplete(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Registration could not be confirmed. Retry here with the same details.')
    } finally {
      inFlight.current = false
      setLoading(false)
    }
  }

  if (complete) return <div role="status" className="rounded-3xl bg-sage p-8 text-forest">
    <p className="text-xs font-black uppercase tracking-widest text-rust">You’re in</p>
    <h3 className="mt-2 text-3xl font-black">Adventure incoming.</h3>
    <p className="mt-3">Your registration is confirmed.{amount !== 0 ? ` Thank you for your $${dollars.toFixed(2)} CAD contribution!` : ' We’ll see you on the trail.'}</p>
    <p className="mt-3">Bring your mug. Watch your email for the trailhead details before the hike.</p>
    <p className="mt-3 text-sm">Registration reference: {orderId}</p>
  </div>

  return (
    <form onSubmit={pay} aria-label="Nomads registration" className="rounded-[2rem] border border-[#0C2A3A]/15 bg-[#F4E7C7] p-5 shadow-sm md:p-8">
      {environment === 'sandbox' && <p className="mb-4 rounded-xl bg-sand p-3 text-sm font-bold">Sandbox test — no real charge or live hike registration.</p>}
      <fieldset disabled={loading || submitted} className="grid gap-4">
        <legend className="mb-4 text-xl font-black uppercase">Your trail crew</legend>
        <label className="grid gap-2 font-bold">Name<input name="name" required maxLength={120} autoComplete="name" placeholder="Your name" className="rounded-2xl border border-black/10 bg-[#F4F0E6] px-4 py-3.5" /></label>
        <label className="grid gap-2 font-bold">Email<input name="email" required type="email" maxLength={254} autoComplete="email" placeholder="you@example.com" className="rounded-2xl border border-black/10 bg-[#F4F0E6] px-4 py-3.5" /></label>
        <label className="grid gap-2 font-bold">Phone (optional)<input name="phone" type="tel" maxLength={40} autoComplete="tel" className="rounded-2xl border border-black/10 bg-[#F4F0E6] px-4 py-3.5" /></label>
        <label className="grid gap-2 font-bold">Number of guests<select name="guests" className="rounded-2xl border border-black/10 bg-[#F4F0E6] px-4 py-3.5">{[1,2,3,4].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}</select></label>
        <label className="grid gap-2 font-bold">Anything we should know? (optional)<textarea name="notes" maxLength={1500} className="min-h-28 rounded-2xl border border-black/10 bg-[#F4F0E6] px-4 py-3.5" /></label>
        <label className="flex gap-2 text-sm"><input name="marketing" type="checkbox" />Send me Tide &amp; Trail news, drops, and events.</label>
      </fieldset>
      <p className="mt-4 text-sm">We use Square to securely save your registration and process any contribution. <a href="/privacy" className="underline">Privacy policy</a></p>
      <p className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-[#E9552D]">Optional contribution · $5 suggested</p>
      <h3 className="mt-2 text-2xl font-black uppercase">Help keep the coffee brewing.</h3>
      <p className="mt-3 text-[#0C2A3A]/75">The hike is free. If you would like to chip in for coffee and future meetups, choose an amount. No donation is needed to join.</p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Donation amount">
        {choices.map(value => (
          <button key={value} type="button" disabled={loading || submitted} onClick={() => { setAmount(value); setError(''); key.current = null; paymentToken.current = null }}
            aria-pressed={amount === value}
            className={`rounded-full border-2 px-4 py-3 font-black transition ${amount === value ? 'border-[#E9552D] bg-[#E9552D] text-white' : 'border-[#0C2A3A]/20 hover:border-[#E9552D]'}`}>
            {value === 0 ? 'Not Now' : `$${value}`}
          </button>
        ))}
      </div>
      <button type="button" disabled={loading || submitted} onClick={() => { setAmount(-1); setError(''); key.current = null; paymentToken.current = null }}
        aria-pressed={amount === -1} className={`mt-3 rounded-full border-2 px-5 py-2 font-bold ${amount === -1 ? 'border-[#E9552D] bg-[#E9552D] text-white' : 'border-[#0C2A3A]/20'}`}>Other amount</button>
      {amount === -1 && <label className="mt-4 block font-bold">Your amount in CAD (minimum $1)
        <input type="text" disabled={loading || submitted} inputMode="decimal" value={custom} onChange={event => { setCustom(event.target.value); key.current = null; paymentToken.current = null }}
          placeholder="e.g. 7.50" className="mt-2 block w-full max-w-xs rounded-xl border border-[#0C2A3A]/30 bg-white px-4 py-3" />
      </label>}
      {amount === 0 && <p className="mt-5 font-semibold">Your registration is free. No card needed.</p>}
      {!configured && <p className="mt-5 font-semibold">Registration is temporarily unavailable. Please try again later.</p>}
      {amount !== 0 && configured && !complete && <>
        <Script src={environment === 'production' ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js'}
          strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setError('The secure card form could not load.')} />
        <div ref={container} className="mt-5 min-h-20" aria-label="Secure card details" />
      </>}
      {error && <p role="alert" className="mt-3 font-semibold text-red-700">{error}</p>}
      {submitted && error && <p className="mt-2 text-sm">Your details are held for this retry to avoid duplicate registrations or charges.</p>}
      <button type="submit" disabled={!configured || !validAmount || (amount !== 0 && !cardReady) || loading}
        className="mt-5 w-full rounded-full bg-[#0C2A3A] px-7 py-3 font-black uppercase text-white disabled:opacity-50">
        {loading ? 'Confirming…' : submitted ? 'Retry registration' : amount === 0 ? 'Complete free registration' : validAmount ? `Register & contribute $${dollars.toFixed(2)} CAD` : 'Enter an amount'}
      </button>
      <p className="mt-3 text-sm text-[#0C2A3A]/65">One checkout. Your spot is confirmed when registration is complete.</p>
    </form>
  )
}
