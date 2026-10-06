'use client'

import { useActionState, useEffect, useState } from 'react'
import { changePlan, type FormState } from '@/app/actions'
import { plans, priceFor, type Billing, type PlanId } from '@/lib/plans'

export function ChangePlan({ currentPlan, currentBilling }: { currentPlan: PlanId; currentBilling: Billing }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(changePlan, {})
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState<PlanId>(currentPlan)
  const [billing, setBilling] = useState<Billing>(currentBilling)
  const unchanged = plan === currentPlan && billing === currentBilling

  // Close the editor once the plan has been saved.
  useEffect(() => {
    if (state.message) setOpen(false)
  }, [state])

  if (!open) {
    return (
      <div>
        {state.message && <p className="mb-3 text-sm font-semibold text-[#23835e]">{state.message}</p>}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-[#dfe4ef] px-4 py-2.5 text-sm font-bold text-[#30384d] transition hover:border-[#b9c8ed]"
        >
          Change plan
        </button>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state.error && <p role="alert" className="text-sm font-medium text-[#b42318]">{state.error}</p>}
      <div className="flex gap-2 text-xs font-semibold">
        {(['monthly', 'yearly'] as const).map((option) => (
          <label key={option} className={`cursor-pointer rounded-md border px-3 py-1.5 capitalize ${billing === option ? 'border-[#3067f1] bg-[#f0f4ff] text-[#3067f1]' : 'border-[#e1e5ef] text-[#747d91]'}`}>
            <input type="radio" name="billing" value={option} checked={billing === option} onChange={() => setBilling(option)} className="sr-only" />
            {option}
          </label>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {plans.map((option) => (
          <label key={option.id} className={`cursor-pointer rounded-xl border p-3 text-sm ${plan === option.id ? 'border-[#3067f1] ring-3 ring-[#3067f1]/15' : 'border-[#e1e5ef]'}`}>
            <input type="radio" name="plan" value={option.id} checked={plan === option.id} onChange={() => setPlan(option.id)} className="sr-only" />
            <span className="block font-bold">{option.name}</span>
            <span className="text-[#626b80]">${priceFor(option, billing)}/mo</span>
          </label>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending || unchanged} className="rounded-lg bg-[#3067f1] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2457d7] disabled:opacity-50">
          {pending ? 'Saving…' : 'Save plan'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#626b80] hover:text-[#12182b]">
          Cancel
        </button>
      </div>
    </form>
  )
}
