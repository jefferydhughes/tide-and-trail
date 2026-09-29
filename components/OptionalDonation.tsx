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

export default function OptionalDonation({
  applicationId, locationId, environment,
}: { applicationId?: string; locationId?: string; environment?: string }) {
  const [amount, setAmount] = useState(0)
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
  const validAmount = Number.isFinite(dollars) && Number.isInteger(cents) && cents >= 100 && cents <= 50000 &&
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

  async function pay() {
    if (!validAmount || !card.current || loading) return
    setLoading(true)
    setError('')
    try {
      if (!paymentToken.current) {
        const token = await card.current.tokenize({
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
            : `Card verification failed${codes.length ? ` (${codes.join(', ')})` : ''}. Please try again. Your free registration is unaffected.`)
        }
        paymentToken.current = token.token
      }
      key.current ||= crypto.randomUUID()
      const response = await fetch('/api/donations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents: cents, sourceId: paymentToken.current, idempotencyKey: key.current }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Payment could not be completed.')
      setComplete(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Payment could not be completed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[2rem] border border-[#0C2A3A]/15 bg-white/75 p-6 shadow-sm md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E9552D]">Optional contribution</p>
      <h3 className="mt-2 text-2xl font-black uppercase">Help keep the coffee brewing.</h3>
      <p className="mt-3 text-[#0C2A3A]/75">The hike is free. If you would like to chip in for coffee and future meetups, choose an amount. No donation is needed to join.</p>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Donation amount">
        {choices.map(value => (
          <button key={value} type="button" disabled={loading || complete} onClick={() => { setAmount(value); setError(''); key.current = null; paymentToken.current = null }}
            aria-pressed={amount === value}
            className={`rounded-full border-2 px-4 py-3 font-black transition ${amount === value ? 'border-[#E9552D] bg-[#E9552D] text-white' : 'border-[#0C2A3A]/20 hover:border-[#E9552D]'}`}>
            {value === 0 ? 'No thanks' : `$${value}`}
          </button>
        ))}
      </div>
      <button type="button" disabled={loading || complete} onClick={() => { setAmount(-1); setError(''); key.current = null; paymentToken.current = null }}
        aria-pressed={amount === -1} className={`mt-3 rounded-full border-2 px-5 py-2 font-bold ${amount === -1 ? 'border-[#E9552D] bg-[#E9552D] text-white' : 'border-[#0C2A3A]/20'}`}>Other amount</button>
      {amount === -1 && <label className="mt-4 block font-bold">Your amount in CAD (minimum $1)
        <input type="text" disabled={loading || complete} inputMode="decimal" value={custom} onChange={event => { setCustom(event.target.value); key.current = null; paymentToken.current = null }}
          placeholder="e.g. 7.50" className="mt-2 block w-full max-w-xs rounded-xl border border-[#0C2A3A]/30 bg-white px-4 py-3" />
      </label>}
      {amount === 0 && <p className="mt-5 font-semibold">Perfect. We will see you on the trail.</p>}
      {amount !== 0 && !configured && <p className="mt-5 font-semibold">Online donations will open soon. You can still join for free.</p>}
      {amount !== 0 && configured && !complete && <>
        <Script src={environment === 'production' ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js'}
          strategy="afterInteractive" onReady={() => setReady(true)} onError={() => setError('The secure card form could not load.')} />
        <div ref={container} className="mt-5 min-h-20" aria-label="Secure card details" />
        {error && <p role="alert" className="mt-3 font-semibold text-red-700">{error}</p>}
        <button type="button" onClick={pay} disabled={!validAmount || !cardReady || loading}
          className="mt-4 rounded-full bg-[#0C2A3A] px-7 py-3 font-black uppercase text-white disabled:opacity-50">
          {loading ? 'Processing…' : validAmount ? `Contribute $${dollars.toFixed(2)} CAD` : 'Enter an amount'}
        </button>
        <p className="mt-2 text-sm text-[#0C2A3A]/65">Payment is optional and separate from your free spot.</p>
      </>}
      {complete && <p role="status" className="mt-5 font-bold">Thank you! Your contribution went through.</p>}
    </div>
  )
}
