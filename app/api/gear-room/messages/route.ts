import { NextResponse } from 'next/server'
import { gearRoomAuthorized } from '@/lib/gearRoomAuth'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { isUuid } from '@/lib/validation'

const templates: Record<string, { subject: string, body: string }> = {
  received: { subject: 'We received your gear', body: 'Hi {{name}},\n\nWe received your submission for {{item}}. We’ll review it and get back to you soon.\n\nTide & Trail' },
  more_photos: { subject: 'A few more gear photos', body: 'Hi {{name}},\n\nCould you send a few more pictures of {{item}}, especially its labels, model number, and any wear?\n\nTide & Trail' },
  accepted: { subject: 'Your gear looks like a fit', body: 'Hi {{name}},\n\nThings look great with {{item}}. We’d like to accept it and arrange drop-off.\n\nTide & Trail' },
  drop_off: { subject: 'Let’s arrange gear drop-off', body: 'Hi {{name}},\n\nLet’s arrange a convenient drop-off time for {{item}}. Reply with a couple of times that work for you.\n\nTide & Trail' },
  declined: { subject: 'Your Tide & Trail submission', body: 'Hi {{name}},\n\nThanks for showing us {{item}}. It isn’t the right fit for our current marketplace, but we appreciate the opportunity.\n\nTide & Trail' },
  listed: { subject: 'Your gear is listed', body: 'Hi {{name}},\n\n{{item}} is now listed and ready for another adventure.\n\nTide & Trail' },
  sold: { subject: 'Your gear sold', body: 'Hi {{name}},\n\nGood news: {{item}} sold. We’ll follow up about your payout.\n\nTide & Trail' },
  payout_ready: { subject: 'Your payout is ready', body: 'Hi {{name}},\n\nYour payout for {{item}} is ready. Reply to arrange the final step.\n\nTide & Trail' },
}

export async function POST(request: Request) {
  if (!await gearRoomAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { submissionId, type } = await request.json().catch(() => ({}))
  const template = templates[type]
  if (!isUuid(submissionId) || !template) return NextResponse.json({ error: 'Invalid message.' }, { status: 400 })
  const supabase = supabaseAdmin()
  const { data: submission, error: submissionError } = await supabase.from('consignment_submissions').select('name,email,item_name').eq('id', submissionId).single()
  if (submissionError) return NextResponse.json({ error: submissionError.message }, { status: 500 })
  const apply = (text: string) => text.replaceAll('{{name}}', submission.name).replaceAll('{{item}}', submission.item_name)
  const { data, error } = await supabase.from('consignment_messages').insert({ submission_id: submissionId, type, recipient_email: submission.email, subject: apply(template.subject), body: apply(template.body), status: 'queued' }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: data })
}
