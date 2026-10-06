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
  'w-full rounded-lg border border-[#dfe4ef] bg-white px-4 py-3 text-sm text-[#12182b] outline-none transition placeholder:text-[#a2aabc] focus:border-[#3067f1] focus:ring-3 focus:ring-[#3067f1]/15'

export const labelClass = 'mb-1.5 block text-sm font-semibold text-[#30384d]'

export const primaryButtonClass =
  'inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#3067f1] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-200 transition hover:bg-[#2457d7] disabled:cursor-wait disabled:opacity-70'
