import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth-shell'
import { getCurrentUser } from '@/lib/auth'
import { LoginForm } from './login-form'

export const metadata: Metadata = { title: 'Log in — Cloudnest' }
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  const user = await getCurrentUser().catch(() => null)
  if (user) redirect('/dashboard')

  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your hosting.">
      <LoginForm />
    </AuthShell>
  )
}
