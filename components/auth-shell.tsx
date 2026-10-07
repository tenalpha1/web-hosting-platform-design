import Link from 'next/link'
import { Check, ShieldCheck, Sparkles, Zap } from 'lucide-react'

export function AuthShell({
  mode,
  title,
  subtitle,
  children,
}: {
  mode: 'signin' | 'signup'
  title: string
  subtitle: React.ReactNode
  children: React.ReactNode
}) {
  const isSignUp = mode === 'signup'
  const tab = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2.5 text-center text-sm font-bold transition ${active ? 'bg-white text-[#12182b] shadow-sm' : 'text-[#747d91] hover:text-[#3067f1]'}`

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f8faff] text-[#12182b]">
      <div className="absolute -left-36 -top-36 size-[500px] rounded-full bg-[#dce8ff] blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-48 -right-24 size-[520px] rounded-full bg-[#eee9ff] blur-3xl" aria-hidden="true" />

      <section className="relative hidden w-[48%] flex-col justify-between overflow-hidden bg-[#1b2340] p-10 text-white lg:flex xl:p-14">
        <div className="absolute -right-24 top-16 size-72 rounded-full border border-white/10" aria-hidden="true" />
        <div className="absolute -right-8 top-32 size-40 rounded-full border border-white/10" aria-hidden="true" />
        <Link href="/" className="relative flex items-center gap-2 text-white" aria-label="BGW Host home">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#3067f1] shadow-xl shadow-blue-950/30"><Sparkles size={20} fill="currentColor" /></span>
          <span className="text-[22px] font-bold tracking-[-0.04em]">BGW <span className="text-[#70a0ff]">Host</span></span>
        </Link>

        <div className="relative max-w-lg">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#8db1ff]/30 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#a9c3ff]"><Zap size={13} fill="currentColor" /> Hosting, made simple</div>
          <h2 className="text-5xl font-bold leading-[1.02] tracking-[-0.065em] xl:text-6xl">A faster home<br />for your <span className="text-[#70a0ff]">website.</span></h2>
          <p className="mt-7 max-w-md text-lg leading-8 text-white/60">Everything you need to launch, manage, and grow online — without the technical maze.</p>
          <div className="mt-9 flex flex-col gap-4 text-sm font-medium text-white/75">
            {['Free SSL and automatic backups', 'Fast, reliable hosting built to scale', '30-day money-back guarantee'].map((item) => (
              <span key={item} className="flex items-center gap-3"><span className="flex size-7 items-center justify-center rounded-full bg-[#3067f1]/20 text-[#8db1ff]"><Check size={15} /></span> {item}</span>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-white/40">Trusted by creators, founders, and growing teams.</p>
      </section>

      <section className="relative flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-[52%] lg:px-14 xl:px-24">
        <div className="w-full max-w-[430px]">
          <Link href="/" className="mb-10 flex items-center justify-center gap-2 lg:hidden" aria-label="BGW Host home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#3067f1] text-white shadow-lg shadow-blue-200"><Sparkles size={18} fill="currentColor" /></span>
            <span className="text-[21px] font-bold tracking-[-0.04em]">BGW <span className="text-[#3067f1]">Host</span></span>
          </Link>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#3067f1]">Your account</p>
            <h1 className="mt-3 text-4xl font-bold tracking-[-0.055em]">{title}</h1>
            <p className="mt-3 text-[15px] leading-6 text-[#747d91]">{subtitle}</p>
          </div>

          <nav className="mb-8 flex rounded-xl bg-[#edf2ff] p-1" aria-label="Account access">
            <Link href="/login" aria-current={!isSignUp ? 'page' : undefined} className={tab(!isSignUp)}>Sign in</Link>
            <Link href="/signup" aria-current={isSignUp ? 'page' : undefined} className={tab(isSignUp)}>Register</Link>
          </nav>

          {children}

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-[#8992a7]"><ShieldCheck size={15} className="text-[#3067f1]" /> Your data is protected with secure encryption</div>
        </div>
      </section>
    </main>
  )
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-xl border border-[#f5c2c0] bg-[#fff4f3] px-4 py-3 text-sm font-medium text-[#b42318]">
      {message}
    </p>
  )
}
