'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { login, type FormState } from '@/app/actions'
import { FormError } from '@/components/auth-shell'
import { inputClass, labelClass, primaryButtonClass } from '@/components/brand'
import { SUPPORT_EMAIL } from '@/lib/plans'

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(login, {})

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state.error} />

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} className={inputClass} placeholder="you@example.com" />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-[#30384d]">Password</label>
          <a href={`mailto:${SUPPORT_EMAIL}?subject=Cloudnest%20password%20reset`} className="text-xs font-semibold text-[#3067f1] hover:underline">
            Forgot password?
          </a>
        </div>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </div>

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? 'Logging in…' : (
          <>
            Log in <ArrowRight size={17} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-[#626b80]">
        New to Cloudnest?{' '}
        <Link href="/signup" className="font-semibold text-[#3067f1] hover:underline">Create an account</Link>
      </p>
    </form>
  )
}
