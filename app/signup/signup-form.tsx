'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react'
import { signup, type FormState } from '@/app/actions'
import { FormError } from '@/components/auth-shell'
import { inputClass, labelClass, primaryButtonClass } from '@/components/brand'
import { plans, priceFor, type Billing, type PlanId } from '@/lib/plans'

export function SignupForm({
  initialPlan,
  initialBilling,
  initialDomain,
}: {
  initialPlan: PlanId
  initialBilling: Billing
  initialDomain: string
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(signup, {})
  const values = state.values ?? {}
  const [plan, setPlan] = useState<PlanId>((values.plan as PlanId) || initialPlan)
  const [billing, setBilling] = useState<Billing>((values.billing as Billing) || initialBilling)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="flex flex-col gap-5" noValidate={false}>
      <FormError message={state.error} />

      <fieldset>
        <div className="mb-2 flex items-center justify-between">
          <legend className="text-sm font-semibold text-[#30384d]">Your plan</legend>
          <div className="flex rounded-lg border border-[#e1e5ef] bg-white p-0.5 text-xs font-semibold" role="radiogroup" aria-label="Billing period">
            {(['monthly', 'yearly'] as const).map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={billing === option}
                onClick={() => setBilling(option)}
                className={`rounded-md px-3 py-1.5 capitalize transition ${billing === option ? 'bg-[#f0f4ff] text-[#3067f1]' : 'text-[#747d91]'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <input type="hidden" name="billing" value={billing} />
        <div className="grid grid-cols-3 gap-2">
          {plans.map((option) => {
            const selected = plan === option.id
            return (
              <label
                key={option.id}
                className={`relative cursor-pointer rounded-xl border bg-white p-3 transition ${selected ? 'border-[#3067f1] ring-3 ring-[#3067f1]/15' : 'border-[#e1e5ef] hover:border-[#b9c8ed]'}`}
              >
                <input type="radio" name="plan" value={option.id} checked={selected} onChange={() => setPlan(option.id)} className="sr-only" />
                {selected && (
                  <span className="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-[#3067f1] text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <span className="block text-sm font-bold">{option.name}</span>
                <span className="mt-1 block text-lg font-bold tracking-[-0.04em]">
                  ${priceFor(option, billing)}
                  <span className="text-xs font-medium text-[#747d91]">/mo</span>
                </span>
              </label>
            )
          })}
        </div>
        <p className="mt-2 text-xs text-[#8992a7]">
          Billed {billing === 'yearly' ? 'annually' : 'monthly'}. You can change plans anytime.
        </p>
      </fieldset>

      <div>
        <label htmlFor="name" className={labelClass}>Full name</label>
        <input id="name" name="name" autoComplete="name" required maxLength={100} defaultValue={values.name} className={inputClass} placeholder="Jane Smith" />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={values.email} className={inputClass} placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            className={`${inputClass} pr-12`}
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-[#8992a7] hover:text-[#3067f1]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="domain" className={labelClass}>
          Domain you’d like <span className="font-normal text-[#8992a7]">(optional)</span>
        </label>
        <input id="domain" name="domain" defaultValue={values.domain ?? initialDomain} className={inputClass} placeholder="yourname.com" autoCapitalize="none" spellCheck={false} />
      </div>

      <label className="flex items-start gap-3 text-sm text-[#626b80]">
        <input type="checkbox" name="terms" required className="mt-0.5 size-4 accent-[#3067f1]" />
        <span>I agree to the BGW Host terms of service and privacy policy.</span>
      </label>

      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? 'Creating your account…' : (
          <>
            Create account <ArrowRight size={17} />
          </>
        )}
      </button>

      <p className="text-center text-sm text-[#747d91]">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[#3067f1] hover:text-[#2457d7]">Sign in</Link>
      </p>
    </form>
  )
}
