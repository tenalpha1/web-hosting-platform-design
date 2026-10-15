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
