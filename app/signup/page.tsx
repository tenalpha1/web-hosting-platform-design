import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { getCurrentUser } from '@/lib/auth'
import { isBilling, isPlanId } from '@/lib/plans'
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
  const plan = isPlanId(params.plan) ? params.plan : 'grow'
  const billing = isBilling(params.billing) ? params.billing : 'yearly'
  const domain = (params.domain ?? '').slice(0, 253)

  return (
    <AuthShell mode="signup" title="Create your account." subtitle="Start building your next big thing with BGW Host.">
      <SignupForm initialPlan={plan} initialBilling={billing} initialDomain={domain} />
    </AuthShell>
  )
}
