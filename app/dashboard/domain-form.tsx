'use client'

import { useActionState, useEffect, useState } from 'react'
import { Pencil, Plus } from 'lucide-react'
import { updateDomain, type FormState } from '@/app/actions'

export function DomainForm({ current }: { current: string | null }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateDomain, {})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (state.message) setOpen(false)
  }, [state])

  if (!open) {
    return (
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/10"
        >
          {current ? <><Pencil size={13} /> Change domain</> : <><Plus size={14} /> Add a domain</>}
        </button>
        {state.message && <span className="text-xs font-semibold text-[#7ee2b2]">{state.message}</span>}
      </div>
    )
  }

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-2">
      <label htmlFor="domain" className="text-xs font-medium text-white/70">The domain you’d like for your website</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="domain"
          name="domain"
          defaultValue={state.values?.domain ?? current ?? ''}
          placeholder="yourname.com"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          className="h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-white px-3.5 text-sm text-[#12182b] outline-none placeholder:text-[#a2aabc] focus:ring-4 focus:ring-[#3067f1]/40"
        />
        <div className="flex gap-2">
          <button type="submit" disabled={pending} className="h-11 rounded-lg bg-[#3067f1] px-4 text-sm font-bold text-white transition hover:bg-[#2457d7] disabled:opacity-60">
            {pending ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="h-11 rounded-lg px-3 text-sm font-semibold text-white/70 hover:text-white">
            Cancel
          </button>
        </div>
      </div>
      {state.error && <p role="alert" className="text-xs font-semibold text-[#ffb4ae]">{state.error}</p>}
    </form>
  )
}
