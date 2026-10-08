'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { login, type FormState } from '@/app/actions'
import { FormError } from '@/components/auth-shell'
import { inputClass, labelClass, primaryButtonClass } from '@/components/brand'
import { SUPPORT_EMAIL } from '@/lib/plans'

export function LoginForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(login, {})
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <FormError message={state.error} />

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.values?.email} className={inputClass} placeholder="you@example.com" />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-semibold text-[#30384d]">Password</label>
          <a href={`mailto:${SUPPORT_EMAIL}?subject=BGW%20Host%20password%20reset`} className="text-xs font-semibold text-[#3067f1] hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className={`${inputClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#8992a7] hover:text-[#3067f1]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? 'Signing in…' : (
          <>
            Sign in <ArrowRight size={17} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-[#747d91]">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold text-[#3067f1] hover:text-[#2457d7]">Sign up</Link>
      </p>
    </form>
  )
}
