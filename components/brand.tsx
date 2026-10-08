import Link from 'next/link'

export function Brand({ size = 'md', light = false }: { size?: 'sm' | 'md'; light?: boolean }) {
  const logo = (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/brand/bgw-host-logo.png" alt="BGW Host" width={840} height={195} className={size === 'sm' ? 'h-7 w-auto' : 'h-9 w-auto'} />
  )
  return (
    <Link href="/" className="flex items-center" aria-label="BGW Host home">
      {light ? <span className="rounded-xl bg-white px-3 py-2 shadow-lg shadow-blue-950/20">{logo}</span> : logo}
    </Link>
  )
}

export const inputClass =
  'h-12 w-full rounded-xl border border-[#dfe4ef] bg-white px-4 text-sm text-[#12182b] outline-none transition placeholder:text-[#a2aabc] focus:border-[#3067f1] focus:ring-4 focus:ring-[#3067f1]/10'

export const labelClass = 'mb-2 block text-sm font-semibold text-[#30384d]'

export const primaryButtonClass =
  'mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3067f1] text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#2457d7] disabled:translate-y-0 disabled:cursor-wait disabled:opacity-70'
