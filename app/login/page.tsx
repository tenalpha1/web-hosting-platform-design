import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Log in — BGW Host' }
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const user = await getCurrentUser().catch(() => null)
  if (user) redirect('/dashboard')

  return (
    <AuthShell mode="signin" title="Welcome back." subtitle="Sign in to manage your websites and hosting.">
      <LoginForm />
    </AuthShell>
  )
}
