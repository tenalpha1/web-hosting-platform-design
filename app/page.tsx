'use client'

import { useState } from 'react'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Globe2,
  Headphones,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { lowestPrice, plans, SUPPORT_EMAIL } from '@/lib/plans'

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly')
  const [domain, setDomain] = useState('')
  const router = useRouter()
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  const searchDomain = (event: React.FormEvent) => {
    event.preventDefault()
    router.push(cleanDomain ? `/signup?domain=${encodeURIComponent(cleanDomain)}` : '/signup')
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbfcff] text-[#12182b]">
      <div className="bg-[#18122d] px-6 py-2 text-center text-xs font-medium tracking-wide text-white/80">
        Launch your site today — hosting from ${lowestPrice}/mo
      </div>

      <header className="relative border-b border-[#e7eaf2] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-6 lg:px-10">
          <a href="#top" className="flex items-center gap-2" aria-label="Cloudnest home">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#3067f1] text-white shadow-lg shadow-blue-200"><Sparkles size={19} fill="currentColor" /></span>
            <span className="text-[21px] font-bold tracking-[-0.04em]">cloudnest</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[#525a70] md:flex" aria-label="Main navigation">
            <a href="#plans" className="transition hover:text-[#3067f1]">Hosting</a>
            <a href="#features" className="transition hover:text-[#3067f1]">Why Cloudnest</a>
            <a href="#support" className="transition hover:text-[#3067f1]">Support</a>
          </nav>
          <div className="hidden items-center gap-5 md:flex">
            <Link href="/login" className="text-sm font-semibold text-[#525a70] hover:text-[#3067f1]">Log in</Link>
            <Link href="/signup" className="rounded-lg bg-[#3067f1] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:bg-[#2457d7]">Get started</Link>
          </div>
          <button className="rounded-lg p-2 text-[#12182b] md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && <nav className="flex flex-col gap-4 border-t border-[#e7eaf2] bg-white px-6 py-5 text-sm font-semibold md:hidden"><a href="#plans" onClick={() => setMenuOpen(false)}>Hosting</a><a href="#features" onClick={() => setMenuOpen(false)}>Why Cloudnest</a><a href="#support" onClick={() => setMenuOpen(false)}>Support</a><Link href="/login">Log in</Link><Link href="/signup" className="text-[#3067f1]">Get started <ArrowRight className="inline" size={15} /></Link></nav>}
      </header>

      <section id="top" className="relative">
        <div className="absolute -right-32 -top-24 size-[460px] rounded-full bg-[#dce8ff] blur-3xl" aria-hidden="true" />
        <div className="absolute -left-20 top-44 size-[300px] rounded-full bg-[#eee9ff] blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.03fr_.97fr] lg:px-10 lg:pb-32 lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cbd9ff] bg-white px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#3067f1]"><Zap size={13} fill="currentColor" /> Hosting, made simple</div>
            <h1 className="max-w-[650px] text-5xl font-bold leading-[1.02] tracking-[-0.065em] text-[#12182b] sm:text-6xl lg:text-[74px]">A faster home<br />for your <span className="text-[#3067f1]">website.</span></h1>
            <p className="mt-7 max-w-[520px] text-lg leading-8 text-[#626b80]">Reliable, secure web hosting for people who want to get online without the technical maze.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row"><a href="#plans" className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3067f1] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-[#2457d7]">Explore plans <ArrowRight size={17} /></a><a href="#features" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#dfe4ef] bg-white px-6 py-3.5 text-sm font-bold text-[#30384d] transition hover:border-[#b9c8ed]">See why Cloudnest works</a></div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-[#626b80]"><span className="inline-flex items-center gap-2"><Check size={16} className="text-[#3067f1]" /> 30-day guarantee</span><span className="inline-flex items-center gap-2"><Check size={16} className="text-[#3067f1]" /> Free SSL included</span></div>
          </div>
          <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
            <div className="absolute inset-8 rounded-[38px] bg-[#dce8ff] blur-2xl" aria-hidden="true" />
            <div className="relative rounded-[28px] border border-white bg-white p-3 shadow-[0_25px_80px_rgba(48,103,241,0.18)]">
              <div className="rounded-[21px] bg-[#f3f6ff] p-7 sm:p-9">
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-[#626b80]">cloudnest dashboard</span><span className="flex items-center gap-1.5 text-xs font-bold text-[#23835e]"><span className="size-2 rounded-full bg-[#38b47d]" /> All systems go</span></div>
                <div className="mt-9 rounded-2xl bg-[#1b2340] p-6 text-white shadow-xl"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-white/55">YOUR WEBSITE</p><p className="mt-2 text-xl font-bold">northstar.studio</p></div><Globe2 className="text-[#8db1ff]" /></div><div className="mt-8 flex items-end justify-between"><div><p className="text-xs text-white/55">Performance</p><p className="mt-1 text-3xl font-bold">99.98<span className="text-lg text-[#8db1ff]">%</span></p></div><div className="flex items-end gap-1">{[20,35,27,48,40,60,52,75,67,92].map((height, index) => <span key={index} className="w-2 rounded-t bg-[#70a0ff]" style={{ height }} />)}</div></div></div>
                <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white p-4"><p className="text-xs text-[#8992a7]">Visitors this month</p><p className="mt-2 text-2xl font-bold">12,840</p><p className="mt-1 text-xs font-semibold text-[#23835e]">+18.4%</p></div><div className="rounded-xl bg-white p-4"><p className="text-xs text-[#8992a7]">Page load time</p><p className="mt-2 text-2xl font-bold">0.8s</p><p className="mt-1 text-xs font-semibold text-[#23835e]">Excellent</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#e9ecf3] bg-white"><div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3 lg:px-10"><div className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3067f1]"><Zap size={20} /></span><div><p className="font-bold">Fast by default</p><p className="mt-1 text-sm text-[#747d91]">SSD storage and smart caching.</p></div></div><div className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3067f1]"><ShieldCheck size={20} /></span><div><p className="font-bold">Safe & secure</p><p className="mt-1 text-sm text-[#747d91]">SSL and backups included.</p></div></div><div className="flex items-center gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3067f1]"><Headphones size={20} /></span><div><p className="font-bold">Human support</p><p className="mt-1 text-sm text-[#747d91]">Real help, whenever you need it.</p></div></div></div></section>

      <section id="plans" className="mx-auto max-w-7xl px-6 py-24 lg:px-10"><div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#3067f1]">Simple plans</p><h2 className="mt-3 text-4xl font-bold tracking-[-0.05em] sm:text-5xl">Pick your starting point.</h2><p className="mt-4 max-w-xl text-[#747d91]">Every plan includes the essentials. Upgrade anytime as your site grows.</p></div><div className="flex items-center rounded-xl border border-[#e1e5ef] bg-white p-1 text-sm font-semibold"><button onClick={() => setBilling('monthly')} className={`rounded-lg px-4 py-2.5 transition ${billing === 'monthly' ? 'bg-[#f0f4ff] text-[#3067f1]' : 'text-[#747d91]'}`}>Monthly</button><button onClick={() => setBilling('yearly')} className={`rounded-lg px-4 py-2.5 transition ${billing === 'yearly' ? 'bg-[#f0f4ff] text-[#3067f1]' : 'text-[#747d91]'}`}>Yearly <span className="ml-1 text-xs text-[#23835e]">save 17%</span></button></div></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">{plans.map((plan) => <article key={plan.id} className={`relative flex flex-col rounded-2xl border bg-white p-7 ${plan.popular ? 'border-[#3067f1] shadow-[0_18px_55px_rgba(48,103,241,0.14)]' : 'border-[#e1e5ef]'}`}>{plan.popular && <span className="absolute -top-3 left-7 rounded-full bg-[#3067f1] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Most popular</span>}<h3 className="text-xl font-bold">{plan.name}</h3><p className="mt-3 min-h-12 text-sm leading-6 text-[#747d91]">{plan.description}</p><div className="mt-6 flex items-baseline gap-1"><span className="text-4xl font-bold tracking-[-0.05em]">${billing === 'yearly' ? plan.yearly : plan.monthly}</span><span className="text-sm text-[#747d91]">/mo</span></div><p className="mt-1 text-xs text-[#8992a7]">Billed {billing === 'yearly' ? 'annually' : 'monthly'}</p><Link href={`/signup?plan=${plan.id}&billing=${billing}`} className={`mt-7 inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-bold ${plan.popular ? 'bg-[#3067f1] text-white hover:bg-[#2457d7]' : 'border border-[#dfe4ef] text-[#30384d] hover:border-[#b9c8ed]'}`}>Choose {plan.name} <ArrowRight className="ml-2" size={16} /></Link><ul className="mt-7 flex flex-col gap-3 border-t border-[#edf0f5] pt-6 text-sm text-[#626b80]">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2.5"><Check size={16} className="text-[#3067f1]" /> {feature}</li>)}</ul></article>)}</div></section>

      <section id="domain" className="mx-6 mb-24 overflow-hidden rounded-3xl bg-[#1b2340] lg:mx-auto lg:max-w-7xl"><div className="grid items-center gap-10 px-7 py-12 sm:px-12 lg:grid-cols-[.9fr_1.1fr] lg:px-16 lg:py-16"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#8db1ff]">Make it yours</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-white sm:text-4xl">Find your next domain.</h2><p className="mt-4 text-sm leading-6 text-white/60">Search for a memorable name and start building something people remember.</p></div><div><label htmlFor="domain-search" className="sr-only">Search for a domain</label><form onSubmit={searchDomain} className="flex flex-col gap-3 rounded-xl bg-white p-2 sm:flex-row"><input id="domain-search" value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="yourname.com" autoCapitalize="none" spellCheck={false} className="min-w-0 flex-1 rounded-lg px-4 py-3 text-sm text-[#12182b] outline-none placeholder:text-[#a2aabc]" /><button type="submit" className="rounded-lg bg-[#3067f1] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2457d7]">Claim this domain</button></form><p className="mt-3 text-sm text-white/60">{cleanDomain ? <>Reserve <span className="font-semibold text-[#8db1ff]">{cleanDomain}</span> when you create your account. We&apos;ll confirm it&apos;s available before it goes live.</> : <>Tell us the name you want and we&apos;ll check availability while we set up your hosting.</>}</p></div></div></section>

      <footer id="support" className="border-t border-[#e7eaf2] bg-white"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 py-10 text-sm text-[#747d91] sm:flex-row sm:items-center lg:px-10"><div><div className="flex items-center gap-2 font-bold text-[#12182b]"><span className="flex size-7 items-center justify-center rounded-lg bg-[#3067f1] text-white"><Sparkles size={14} fill="currentColor" /></span> cloudnest</div><p className="mt-2">Hosting that gives you room to grow.</p></div><div className="flex gap-6"><a href={`mailto:${SUPPORT_EMAIL}?subject=Cloudnest%20support`} className="hover:text-[#3067f1]">Contact support</a><a href="#plans" className="hover:text-[#3067f1]">Pricing</a><Link href="/login" className="hover:text-[#3067f1]">Log in</Link></div></div></footer>
    </main>
  )
}
