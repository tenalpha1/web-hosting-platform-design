import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { verifyWebhook } from '@/lib/paypal'

export const dynamic = 'force-dynamic'

type PayPalEvent = {
  id?: string
  event_type?: string
  resource?: { id?: string; billing_agreement_id?: string; status?: string }
}

/** PayPal event → our payment_status. */
const STATUS_FOR_EVENT: Record<string, string> = {
  'BILLING.SUBSCRIPTION.ACTIVATED': 'paid',
  'BILLING.SUBSCRIPTION.RE-ACTIVATED': 'paid',
  'PAYMENT.SALE.COMPLETED': 'paid',
  'BILLING.SUBSCRIPTION.CANCELLED': 'cancelled',
  'BILLING.SUBSCRIPTION.EXPIRED': 'cancelled',
  'BILLING.SUBSCRIPTION.SUSPENDED': 'paused',
  'BILLING.SUBSCRIPTION.PAYMENT.FAILED': 'failed',
}

/**
 * PayPal calls this when a subscription changes (cancelled, payment failed, renewed…).
 * Every call is checked with PayPal before anything is changed.
 */
export async function POST(request: Request) {
  let event: PayPalEvent
  try {
    event = (await request.json()) as PayPalEvent
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  try {
    if (!(await verifyWebhook(request.headers, event))) {
      console.error('[paypal webhook] signature check failed', event.id, event.event_type)
      return new Response('Not verified', { status: 400 })
    }
  } catch (error) {
    console.error('[paypal webhook] could not verify', error)
    return new Response('Verification unavailable', { status: 500 }) // PayPal will retry later
  }

  const type = event.event_type ?? ''
  const status = STATUS_FOR_EVENT[type]
  const subscriptionId = type.startsWith('PAYMENT.SALE') ? event.resource?.billing_agreement_id : event.resource?.id
  if (!status || !subscriptionId) return Response.json({ ok: true, ignored: type })

  const sql = await db()
  const rows = (await sql`
    UPDATE cloudnest_users
    SET payment_status = ${status}, paid_at = CASE WHEN ${status} = 'paid' THEN NOW() ELSE paid_at END
    WHERE paypal_subscription_id = ${subscriptionId}
    RETURNING id`) as { id: number }[]
  console.log('[paypal webhook]', type, subscriptionId, '→', status, rows.length ? `user ${rows[0].id}` : 'no matching customer')

  revalidatePath('/admin')
  revalidatePath('/dashboard')
  return Response.json({ ok: true })
}
