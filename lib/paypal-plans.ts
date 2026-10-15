import type { Billing, PlanId } from './plans'

/** Public PayPal app Client ID (Live). Safe to show in the browser. */
export const PAYPAL_CLIENT_ID =
  'BAA3CuZ14vfb36UFvoWO13sdawgkGOVL_gcabPOYUlQ_ZURyPzf2vscK7xVydHR8sRp4pHqLrL4D_8_jfs'

/** PayPal subscription plans, all under the "BGW Domain Web Hosting" product. Prices in CAD. */
export const PAYPAL_PLANS: Record<PlanId, Record<Billing, string>> = {
  starter: { monthly: 'P-2WY69732010743820NLIU6YQ', yearly: 'P-9YL973837R212180SNLIVATQ' },
  plus: { monthly: 'P-3FW15381WV592733TNLIUUUI', yearly: 'P-853925905V371650HNLIUXUY' },
  pro: { monthly: 'P-31820000LU1045938NLIUYLQ', yearly: 'P-49401810RC983100XNLIUZCI' },
}

export const PAYMENT_STATUSES = {
  unpaid: 'Not paid yet',
  paid: 'Paid',
  unverified: 'Check in PayPal',
} as const
