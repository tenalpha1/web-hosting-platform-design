export type PlanId = 'launch' | 'grow' | 'scale'
export type Billing = 'monthly' | 'yearly'

export type Plan = {
  id: PlanId
  name: string
  description: string
  monthly: number
  yearly: number
  popular?: boolean
  features: string[]
}

export const plans: Plan[] = [
  {
    id: 'launch',
    name: 'Launch',
    description: 'Everything you need to get your first site online.',
    monthly: 2.95,
    yearly: 2.45,
    features: ['1 website', '10 GB SSD storage', 'Free SSL certificate', 'Weekly backups'],
  },
  {
    id: 'grow',
    name: 'Grow',
    description: 'More room for your ideas, content, and customers.',
    monthly: 5.95,
    yearly: 4.95,
    popular: true,
    features: ['10 websites', '50 GB SSD storage', 'Free domain for 1 year', 'Daily backups', 'Priority support'],
  },
  {
    id: 'scale',
    name: 'Scale',
    description: 'Powerful hosting for busy, growing businesses.',
    monthly: 10.95,
    yearly: 8.95,
    features: ['Unlimited websites', '100 GB SSD storage', 'Free domain for 1 year', 'Performance tuning', 'Priority support'],
  },
]

export const lowestPrice = Math.min(...plans.map((plan) => plan.yearly))

export function getPlan(id: string | null | undefined): Plan {
  return plans.find((plan) => plan.id === id) ?? plans[0]
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
