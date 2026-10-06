import { Check } from 'lucide-react'
import { Brand } from './brand'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#12182b] lg:grid lg:grid-cols-[1fr_minmax(0,560px)]">
      <aside className="relative hidden overflow-hidden bg-[#1b2340] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-[420px] rounded-full bg-[#3067f1]/30 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-16 size-[360px] rounded-full bg-[#7c5cff]/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <Brand light />
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-[-0.05em]">A faster home for your website.</h2>
          <ul className="mt-8 flex flex-col gap-4 text-sm text-white/75">
            {['Free SSL on every plan', 'SSD storage and smart caching', '30-day money-back guarantee', 'Real people when you need help'].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex size-6 items-center justify-center rounded-full bg-white/10 text-[#8db1ff]">
                  <Check size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-white/40">© {new Date().getFullYear()} Cloudnest</p>
      </aside>

      <section className="flex min-h-screen flex-col px-6 py-8 sm:px-12">
        <div className="lg:hidden">
          <Brand />
        </div>
        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">{title}</h1>
          <p className="mt-3 text-[#626b80]">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  )
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg border border-[#f5c2c0] bg-[#fff4f3] px-4 py-3 text-sm font-medium text-[#b42318]">
      {message}
    </p>
  )
}
