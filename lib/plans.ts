export type PlanId = 'starter' | 'plus' | 'pro'
export type Billing = 'monthly' | 'yearly'

export type Plan = {
  id: PlanId
  name: string
  description: string
  monthly: number
  /** Effective monthly price when billed once a year (about two months free). */
  yearly: number
  popular?: boolean
  /** Disk space the WHM package for this plan should allow. */
  diskGb: number
  features: string[]
}

/**
 * Sized to fit a HostUpon RS-100 reseller account (15 GB, 10 cPanel accounts).
 * The WHM packages should use the same disk and website limits.
 */
export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'One website, done right. Perfect for a small business or personal site.',
    monthly: 5.95,
    yearly: 4.95,
    diskGb: 1,
    features: ['1 website', '1 GB SSD storage', 'Free SSL certificate', 'Up to 5 email accounts', 'cPanel with 1-click WordPress'],
  },
  {
    id: 'plus',
    name: 'Plus',
    description: 'Room for a few sites and a growing inbox.',
    monthly: 9.95,
    yearly: 8.25,
    popular: true,
    diskGb: 3,
    features: ['Up to 3 websites', '3 GB SSD storage', 'Free SSL certificates', 'Up to 25 email accounts', 'cPanel with 1-click WordPress'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For busy businesses and people who run several sites.',
    monthly: 14.95,
    yearly: 12.45,
    diskGb: 5,
    features: ['Up to 10 websites', '5 GB SSD storage', 'Free SSL certificates', 'Up to 50 email accounts', 'Priority support'],
  },
]

/** Plan ids used before the RS-100 rework, mapped to the closest current plan. */
export const LEGACY_PLAN_IDS: Record<string, PlanId> = { launch: 'starter', grow: 'plus', scale: 'pro' }

export const lowestPrice = Math.min(...plans.map((plan) => plan.yearly))

export function getPlan(id: string | null | undefined): Plan {
  const resolved = id && id in LEGACY_PLAN_IDS ? LEGACY_PLAN_IDS[id] : id
  return plans.find((plan) => plan.id === resolved) ?? plans[0]
}

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && plans.some((plan) => plan.id === value)
}

export function isBilling(value: unknown): value is Billing {
  return value === 'monthly' || value === 'yearly'
}

export function priceFor(plan: Plan, billing: Billing) {
  return billing === 'yearly' ? plan.yearly : plan.monthly
}

export const SUPPORT_EMAIL = 'admin@bgwfilmstudios.com'
export const COMPANY_NAME = 'BGW Film Studios Inc.'
