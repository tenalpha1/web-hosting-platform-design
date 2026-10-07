import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export function Brand({ size = 'md', light = false }: { size?: 'sm' | 'md'; light?: boolean }) {
  const small = size === 'sm'
  return (
    <Link href="/" className={`flex items-center gap-2 ${light ? 'text-white' : 'text-[#12182b]'}`} aria-label="Cloudnest home">
      <span
        className={`flex items-center justify-center bg-[#3067f1] text-white shadow-lg shadow-blue-200 ${small ? 'size-7 rounded-lg' : 'size-9 rounded-xl'}`}
      >
        <Sparkles size={small ? 14 : 19} fill="currentColor" />
      </span>
      <span className={`font-bold tracking-[-0.04em] ${small ? 'text-base' : 'text-[21px]'}`}>cloudnest</span>
    </Link>
  )
}

export const inputClass =
  'h-12 w-full rounded-xl border border-[#dfe4ef] bg-white px-4 text-sm text-[#12182b] outline-none transition placeholder:text-[#a2aabc] focus:border-[#3067f1] focus:ring-4 focus:ring-[#3067f1]/10'

export const labelClass = 'mb-2 block text-sm font-semibold text-[#30384d]'

export const primaryButtonClass =
  'mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3067f1] text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#2457d7] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70'
