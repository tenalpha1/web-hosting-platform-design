import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Ban, Check, Clock, CreditCard, Globe2, LifeBuoy, LogOut, Mail, PartyPopper, ShieldCheck, UserRound } from 'lucide-react'
import { logout } from '@/app/actions'
import { Brand } from '@/components/brand'
import { isAdmin } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth'
import { CURRENCY, formatPrice, getPlan, priceFor, SUPPORT_EMAIL } from '@/lib/plans'
import { PAYPAL_PLANS } from '@/lib/paypal-plans'
import { ChangePlan } from './change-plan'
import { PayPalSubscribeButton } from './paypal-button'
import { DomainForm } from './domain-form'

export const metadata: Metadata = { title: 'Your dashboard — BGW Domain' }
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
  const suspended = user.status === 'suspended'
  const admin = isAdmin(user)
  const paid = user.payment_status === 'paid'
  const paymentReceived = user.payment_status !== 'unpaid'
  const paypalPlanId = PAYPAL_PLANS[plan.id][user.billing]

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#12182b]">
      <header className="border-b border-[#e7eaf2] bg-white">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between px-6">
          <Brand />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[#626b80] md:inline">{user.email}</span>
            {admin && (
              <Link href="/admin" className="inline-flex items-center gap-2 rounded-lg bg-[#1b2340] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#2a3560]">
                <ShieldCheck size={15} /> Admin
              </Link>
            )}
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
              <p className="font-bold">Welcome to BGW Domain, {firstName}!</p>
              <p className="mt-1 text-sm text-[#626b80]">{paymentReceived ? `Your account is created. We’re setting up your hosting now and will email ${user.email} as soon as it’s ready.` : 'Your account is created. Complete your payment below and we’ll start setting up your hosting.'}</p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Hi {firstName}</h1>
        <p className="mt-2 text-[#626b80]">Here’s everything about your hosting in one place.</p>

        {!paymentReceived && (
          <section className="mt-8 rounded-2xl border-2 border-[#3067f1] bg-white p-6 shadow-[0_18px_55px_rgba(48,103,241,0.12)] sm:p-7" aria-labelledby="pay-heading">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-md">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#3067f1] text-white"><CreditCard size={19} /></span>
                  <h2 id="pay-heading" className="text-xl font-bold">Complete your payment</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#626b80]">
                  {plan.name} plan · <span className="font-semibold text-[#12182b]">${formatPrice(user.billing === 'yearly' ? price * 12 : price)} {CURRENCY}</span> {user.billing === 'yearly' ? 'once a year' : 'every month'}. Pay securely with PayPal or a debit or credit card. You can cancel any time.
                </p>
                <p className="mt-2 text-xs text-[#8992a7]">Want a different plan? Change it in “Your plan” below before paying.</p>
              </div>
              <div className="w-full lg:w-[380px]">
                <PayPalSubscribeButton planId={paypalPlanId} userId={user.id} />
              </div>
            </div>
          </section>
        )}

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <section className={`${cardBase} border-[#1b2340] bg-[#1b2340] text-white shadow-[0_18px_55px_rgba(27,35,64,0.18)]`} aria-labelledby="site-heading">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/55">Your website</p>
                <h2 id="site-heading" className="mt-2 break-all text-2xl font-bold">{user.desired_domain ?? 'No domain chosen yet'}</h2>
              </div>
              <Globe2 className="shrink-0 text-[#8db1ff]" />
            </div>
            <DomainForm current={user.desired_domain} />
            <div className="mt-8 flex items-center gap-3 rounded-xl bg-white/5 p-4">
              {ready ? (
                <><span className="size-2.5 rounded-full bg-[#38b47d]" /><span className="text-sm font-semibold">Live and running</span></>
              ) : suspended ? (
                <>
                  <Ban size={18} className="shrink-0 text-[#ffb4ae]" />
                  <div>
                    <p className="text-sm font-semibold">Your hosting is paused</p>
                    <p className="text-xs text-white/55">Please contact support and we’ll help you get it running again.</p>
                  </div>
                </>
              ) : (
                <>
                  <Clock size={18} className="shrink-0 text-[#8db1ff]" />
                  <div>
                    <p className="text-sm font-semibold">{paymentReceived ? 'Setting up your hosting' : 'Waiting for payment'}</p>
                    <p className="text-xs text-white/55">{paymentReceived ? 'We’ll email you when your server space is ready, usually within one business day.' : 'Once your payment is complete, we’ll set up your server space, usually within one business day.'}</p>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className={card} aria-labelledby="plan-heading">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#3067f1]">Your plan</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h2 id="plan-heading" className="text-2xl font-bold">{plan.name}</h2>
              <p><span className="text-2xl font-bold tracking-[-0.04em]">${formatPrice(price)}</span><span className="text-sm text-[#747d91]">/mo {CURRENCY}</span></p>
            </div>
            <p className="mt-1 text-xs text-[#8992a7]">Billed {user.billing === 'yearly' ? 'annually' : 'monthly'}</p>
            <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${paid ? 'bg-[#e9f8f0] text-[#23835e]' : paymentReceived ? 'bg-[#f0f4ff] text-[#3067f1]' : 'bg-[#fff6e5] text-[#a15c00]'}`}>
              {paid ? <><Check size={13} /> Paid with PayPal</> : paymentReceived ? 'Payment received — confirming' : 'Payment needed'}
            </p>
            <ul className="mt-5 flex flex-col gap-2.5 border-t border-[#edf0f5] pt-5 text-sm text-[#626b80]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5"><Check size={16} className="text-[#3067f1]" /> {feature}</li>
              ))}
            </ul>
            <div className="mt-6">
              {paymentReceived ? (
                <p className="text-sm text-[#626b80]">To change your plan, <a href={`mailto:${SUPPORT_EMAIL}?subject=BGW%20Domain%20plan%20change`} className="font-semibold text-[#3067f1] hover:underline">contact us</a>.</p>
              ) : (
                <ChangePlan currentPlan={plan.id} currentBilling={user.billing} />
              )}
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
            <a href={`mailto:${SUPPORT_EMAIL}?subject=BGW%20Domain%20support`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#3067f1] hover:underline">
              <Mail size={16} /> Contact support
            </a>
          </section>
        </div>
      </div>
    </main>
  )
}
