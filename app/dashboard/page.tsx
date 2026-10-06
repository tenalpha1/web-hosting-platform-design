import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Check, Clock, Globe2, LifeBuoy, LogOut, Mail, PartyPopper, UserRound } from 'lucide-react'
import { logout } from '@/app/actions'
import { Brand } from '@/components/brand'
import { getCurrentUser } from '@/lib/auth'
import { getPlan, priceFor, SUPPORT_EMAIL } from '@/lib/plans'
import { ChangePlan } from './change-plan'

export const metadata: Metadata = { title: 'Your dashboard — Cloudnest' }
export const dynamic = 'force-dynamic'

const cardBase = 'rounded-2xl border p-6 sm:p-7'
const card = `${cardBase} border-[#e1e5ef] bg-white`

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { welcome } = await searchParams
  const plan = getPlan(user.plan)
  const price = priceFor(plan, user.billing)
  const firstName = user.name.split(' ')[0]
  const memberSince = new Date(user.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
  const ready = user.status === 'active'

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#12182b]">
      <header className="border-b border-[#e7eaf2] bg-white">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-6">
          <Brand />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[#626b80] sm:inline">{user.email}</span>
            <form action={logout}>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg border border-[#dfe4ef] px-3 py-2 text-sm font-semibold text-[#30384d] transition hover:border-[#b9c8ed]">
                <LogOut size={15} /> Log out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {welcome && (
          <div className="mb-8 flex items-start gap-4 rounded-2xl border border-[#cbd9ff] bg-[#f0f4ff] p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#3067f1] text-white"><PartyPopper size={20} /></span>
            <div>
              <p className="font-bold">Welcome to Cloudnest, {firstName}!</p>
              <p className="mt-1 text-sm text-[#626b80]">Your account is created. We’re setting up your hosting now and will email {user.email} as soon as it’s ready.</p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Hi {firstName}</h1>
        <p className="mt-2 text-[#626b80]">Here’s everything about your hosting in one place.</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className={`${cardBase} border-[#1b2340] bg-[#1b2340] text-white shadow-[0_18px_55px_rgba(27,35,64,0.18)]`} aria-labelledby="site-heading">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">Your website</p>
                <h2 id="site-heading" className="mt-2 text-2xl font-bold">{user.desired_domain ?? 'No domain chosen yet'}</h2>
              </div>
              <Globe2 className="text-[#8db1ff]" />
            </div>
            <div className="mt-8 flex items-center gap-3 rounded-xl bg-white/5 p-4">
              {ready ? (
                <><span className="size-2.5 rounded-full bg-[#38b47d]" /><span className="text-sm font-semibold">Live and running</span></>
              ) : (
                <>
                  <Clock size={18} className="shrink-0 text-[#8db1ff]" />
                  <div>
                    <p className="text-sm font-semibold">Setting up your hosting</p>
                    <p className="text-xs text-white/55">We’ll email you when your server space is ready, usually within one business day.</p>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className={card} aria-labelledby="plan-heading">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3067f1]">Your plan</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h2 id="plan-heading" className="text-2xl font-bold">{plan.name}</h2>
              <p><span className="text-2xl font-bold tracking-[-0.04em]">${price}</span><span className="text-sm text-[#747d91]">/mo</span></p>
            </div>
            <p className="mt-1 text-xs text-[#8992a7]">Billed {user.billing === 'yearly' ? 'annually' : 'monthly'}</p>
            <ul className="mt-5 flex flex-col gap-2.5 border-t border-[#edf0f5] pt-5 text-sm text-[#626b80]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5"><Check size={16} className="text-[#3067f1]" /> {feature}</li>
              ))}
            </ul>
            <div className="mt-6">
              <ChangePlan currentPlan={plan.id} currentBilling={user.billing} />
            </div>
          </section>

          <section className={card} aria-labelledby="account-heading">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3067f1]"><UserRound size={19} /></span>
              <h2 id="account-heading" className="text-lg font-bold">Account details</h2>
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
              <div><dt className="text-[#8992a7]">Name</dt><dd className="mt-1 font-semibold">{user.name}</dd></div>
              <div><dt className="text-[#8992a7]">Email</dt><dd className="mt-1 break-all font-semibold">{user.email}</dd></div>
              <div><dt className="text-[#8992a7]">Member since</dt><dd className="mt-1 font-semibold">{memberSince}</dd></div>
            </dl>
          </section>

          <section className={card} aria-labelledby="help-heading">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3067f1]"><LifeBuoy size={19} /></span>
              <h2 id="help-heading" className="text-lg font-bold">Need a hand?</h2>
            </div>
            <p className="mt-4 text-sm text-[#626b80]">Real people, ready to help with anything from domains to email.</p>
            <a href={`mailto:${SUPPORT_EMAIL}?subject=Cloudnest%20support`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#3067f1] hover:underline">
              <Mail size={16} /> Contact support
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}
