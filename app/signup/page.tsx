import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { getCurrentUser } from '@/lib/auth'
import { isBilling, isPlanId, LEGACY_PLAN_IDS } from '@/lib/plans'
import { SignupForm } from './signup-form'

export const metadata: Metadata = { title: 'Create your account — BGW Host' }
export const dynamic = 'force-dynamic'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; billing?: string; domain?: string }>
}) {
  const user = await getCurrentUser().catch(() => null)
  if (user) redirect('/dashboard')

  const params = await searchParams
  const requested = params.plan && params.plan in LEGACY_PLAN_IDS ? LEGACY_PLAN_IDS[params.plan] : params.plan
  const plan = isPlanId(requested) ? requested : 'plus'
  const billing = isBilling(params.billing) ? params.billing : 'yearly'
  const domain = (params.domain ?? '').slice(0, 253)

  return (
    <AuthShell mode="signup" title="Create your account." subtitle="Start building your next big thing with BGW Host.">
      <SignupForm initialPlan={plan} initialBilling={billing} initialDomain={domain} />
    </AuthShell>
  )
}
