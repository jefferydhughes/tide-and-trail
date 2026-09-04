'use client'
import { useState } from 'react'
const field='rounded-2xl border border-black/10 bg-[#F4F0E6] px-4 py-3.5'
export default function ConsignmentForm(){
 const[done,setDone]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(false)
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError('');try{const r=await fetch('/api/consignment',{method:'POST',body:new FormData(e.currentTarget)});const j=await r.json();if(!r.ok){setError(j.error||'Please try again.');return}setDone(true)}catch{setError('Network error. Please try again.')}finally{setLoading(false)}}
 if(done)return <div role="status" className="py-16 text-center"><div className="text-xs font-black uppercase tracking-widest text-rust">Submission received</div><h2 className="mt-3 text-4xl font-black text-forest">Adventure incoming.</h2><p className="mt-3 text-black/60">We’ll review your gear and contact you with the next step.</p></div>
 return <form onSubmit={submit} className="grid gap-5">
  <div className="grid gap-5 sm:grid-cols-2"><input aria-label="Your name" name="name" required maxLength={120} placeholder="Your name" className={field}/><input aria-label="Email" name="email" required type="email" maxLength={254} placeholder="Email" className={field}/></div>
  <div className="grid gap-5 sm:grid-cols-2"><input aria-label="Phone" name="phone" maxLength={40} placeholder="Phone" className={field}/><input aria-label="Postal code" name="postalCode" maxLength={12} placeholder="Postal code" className={field}/></div>
  <input aria-label="Item name" name="itemName" required maxLength={180} placeholder="What are you selling? e.g. MSR Hubba Hubba 2" className={field}/>
  <div className="grid gap-5 sm:grid-cols-2"><input aria-label="Brand" name="brand" maxLength={100} placeholder="Brand" className={field}/><select aria-label="Category" name="category" className={field}><option>Hiking &amp; Backpacking</option><option>Camping</option><option>Paddling</option><option>Cycling</option><option>Winter</option><option>Family</option></select></div>
  <div className="grid gap-5 sm:grid-cols-2"><select aria-label="Condition" name="condition" className={field}><option>Pristine</option><option>Excellent</option><option>Good</option><option>Worn &amp; Ready</option><option>Repair / Project</option></select><select aria-label="Payout preference" name="payout" className={field}><option value="cash">Cash — 60%</option><option value="credit">Tide &amp; Trail credit — 70%</option></select></div>
  <input aria-label="Original purchase price" name="purchasePrice" type="number" min="0" max="100000" placeholder="What did you originally pay? (optional)" className={field}/>
  <textarea aria-label="Adventure story" name="adventureStory" maxLength={3000} placeholder="What adventures has this gear been on?" className={`${field} min-h-32`}/><p className="-mt-3 px-1 text-xs leading-5 text-black/45">Every piece of gear has a story. This is optional, but it helps create a better listing.</p>
  <textarea aria-label="Item details" name="description" maxLength={3000} placeholder="Age, model, wear, repairs, and included accessories…" className={`${field} min-h-28`}/>
  <label className="rounded-2xl border-2 border-dashed border-forest/15 bg-fog p-7 text-center"><span className="font-bold text-forest">Add 1–6 photos</span><span className="mt-1 block text-xs text-black/50">Gear, labels, model number, and wear. JPG, PNG, WebP, or HEIC; max 8MB each.</span><input required name="photos" type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" multiple className="mt-4 w-full text-sm"/></label>
  <label className="flex gap-2 text-sm text-black/60"><input required type="checkbox"/> I confirm this is my gear and agree to Tide &amp; Trail assessing it for consignment.</label>
  {error&&<p role="alert" className="text-sm font-bold text-red-700">{error}</p>}<button disabled={loading} className="rounded-full bg-rust px-6 py-3 font-black text-white disabled:opacity-50">{loading?'Sending…':'Start my consignment →'}</button>
 </form>
}
