import 'server-only'
import { PAYPAL_CLIENT_ID } from './paypal-plans'

const API = 'https://api-m.paypal.com'

export type PayPalSubscription = {
  id: string
  status: string
  plan_id: string
  custom_id?: string
  subscriber?: { email_address?: string }
}

export class PayPalConfigError extends Error {}

async function accessToken() {
  const secret = process.env.PAYPAL_CLIENT_SECRET
  if (!secret) throw new PayPalConfigError('PAYPAL_CLIENT_SECRET is not set in Vercel.')
  const response = await fetch(`${API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })
  if (!response.ok) throw new PayPalConfigError(`PayPal sign-in failed (${response.status}). Check PAYPAL_CLIENT_SECRET.`)
  const data = (await response.json()) as { access_token: string }
  return data.access_token
}

/** Looks a subscription up directly with PayPal, so the browser can't fake a payment. */
export async function getSubscription(id: string): Promise<PayPalSubscription | null> {
  const token = await accessToken()
  const response = await fetch(`${API}/v1/billing/subscriptions/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`PayPal lookup failed (${response.status})`)
  return (await response.json()) as PayPalSubscription
}

/** Asks PayPal whether a webhook really came from PayPal. Needs PAYPAL_WEBHOOK_ID in Vercel. */
export async function verifyWebhook(headers: Headers, event: unknown) {
  // Live webhook for https://www.bgwdomains.com/api/billing/webhook (not secret).
  const webhookId = process.env.PAYPAL_WEBHOOK_ID || '7DE16591X6355492V'
  if (!webhookId) throw new PayPalConfigError('PAYPAL_WEBHOOK_ID is not set in Vercel.')
  const token = await accessToken()
  const response = await fetch(`${API}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: headers.get('paypal-auth-algo'),
      cert_url: headers.get('paypal-cert-url'),
      transmission_id: headers.get('paypal-transmission-id'),
      transmission_sig: headers.get('paypal-transmission-sig'),
      transmission_time: headers.get('paypal-transmission-time'),
      webhook_id: webhookId,
      webhook_event: event,
    }),
    cache: 'no-store',
  })
  if (!response.ok) return false
  const data = (await response.json()) as { verification_status?: string }
  return data.verification_status === 'SUCCESS'
}
