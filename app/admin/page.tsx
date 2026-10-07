import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Globe2, Mail, Search, Users } from 'lucide-react'
import { setCustomerStatus } from '@/app/actions'
import { Brand } from '@/components/brand'
import { isAdmin, isStatus, STATUSES, type Status } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPlan, priceFor, type Billing } from '@/lib/plans'

export const metadata: Metadata = { title: 'Admin — BGW Host', robots: { index: false, follow: false } }
export const dynamic = 'force-dynamic'

type Customer = {
  id: number
  name: string
  email: string
  plan: string
  billing: Billing
  desired_domain: string | null
  status: string
  created_at: string
}

const filters: { key: 'all' | Status; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Setting up' },
  { key: 'active', label: 'Live' },
  { key: 'suspended', label: 'Suspended' },
]

function statusOf(value: string): Status {
  return isStatus(value) ? value : 'pending'
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/Vancouver' })
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!isAdmin(user)) notFound()

  const params = await searchParams
  const active: 'all' | Status = isStatus(params.status) ? params.status : 'all'
  const query = (params.q ?? '').trim().slice(0, 100)

  const sql = await db()
  const rows = (await sql`
    SELECT id, name, email, plan, billing, desired_domain, status, created_at
    FROM cloudnest_users
    ORDER BY created_at DESC`) as Customer[]

  const counts = { all: rows.length, pending: 0, active: 0, suspended: 0 }
  for (const row of rows) counts[statusOf(row.status)]++

  const monthlyRevenue = rows
    .filter((row) => statusOf(row.status) === 'active')
    .reduce((sum, row) => sum + priceFor(getPlan(row.plan), row.billing), 0)

  const needle = query.toLowerCase()
  const visible = rows.filter((row) => {
    if (active !== 'all' && statusOf(row.status) !== active) return false
    if (!needle) return true
    return [row.name, row.email, row.desired_domain ?? ''].some((field) => field.toLowerCase().includes(needle))
  })

  const linkFor = (status: 'all' | Status) => {
    const search = new URLSearchParams()
    if (status !== 'all') search.set('status', status)
    if (query) search.set('q', query)
    const qs = search.toString()
    return qs ? `/admin?${qs}` : '/admin'
  }

  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#12182b]">
      <header className="border-b border-[#e7eaf2] bg-white">
        <div className="mx-auto flex h-[70px] max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-3">
            <Brand />
            <span className="rounded-md bg-[#1b2340] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">Admin</span>
          </div>
          <Link href="/dashboard" aria-label="Back to my dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-[#626b80] hover:text-[#3067f1]">
            <ArrowLeft size={15} /> <span className="hidden sm:inline">My dashboard</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Customers</h1>
        <p className="mt-2 text-[#626b80]">Everyone who has signed up for BGW Host. Mark a customer Live once their hosting is ready.</p>

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Total sign-ups', value: counts.all },
            { label: 'Waiting for setup', value: counts.pending, highlight: counts.pending > 0 },
            { label: 'Live customers', value: counts.active },
            { label: 'Live plans, per month', value: `$${monthlyRevenue.toFixed(2)}` },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border bg-white p-5 ${stat.highlight ? 'border-[#f5d9a3]' : 'border-[#e1e5ef]'}`}>
              <p className="text-xs font-medium text-[#8992a7]">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold tracking-[-0.04em]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-1 rounded-xl bg-[#edf2ff] p-1" aria-label="Filter customers">
            {filters.map((filter) => (
              <Link
                key={filter.key}
                href={linkFor(filter.key)}
                aria-current={active === filter.key ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition ${active === filter.key ? 'bg-white text-[#12182b] shadow-sm' : 'text-[#747d91] hover:text-[#3067f1]'}`}
              >
                {filter.label} <span className="ml-1 text-xs font-semibold text-[#8992a7]">{counts[filter.key]}</span>
              </Link>
            ))}
          </nav>
          <form action="/admin" className="relative w-full sm:w-72">
            {active !== 'all' && <input type="hidden" name="status" value={active} />}
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8992a7]" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Search name, email or domain"
              aria-label="Search customers"
              className="h-11 w-full rounded-xl border border-[#dfe4ef] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-[#a2aabc] focus:border-[#3067f1] focus:ring-4 focus:ring-[#3067f1]/10"
            />
          </form>
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#e1e5ef] bg-white" aria-label="Customer list">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#edf3ff] text-[#3067f1]"><Users size={22} /></span>
              <p className="mt-4 font-bold">{rows.length === 0 ? 'No sign-ups yet' : 'No customers match'}</p>
              <p className="mt-1 text-sm text-[#747d91]">{rows.length === 0 ? 'New customers will appear here as soon as they create an account.' : 'Try a different filter or search.'}</p>
            </div>
          ) : (
            <ul className="divide-y divide-[#edf0f5]">
              {visible.map((customer) => {
                const status = statusOf(customer.status)
                const plan = getPlan(customer.plan)
                const actions = (Object.keys(STATUSES) as Status[]).filter((option) => option !== status)
                return (
                  <li key={customer.id} className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[1.3fr_1fr_auto] lg:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{customer.name}</p>
                        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${STATUSES[status].tone}`}>{STATUSES[status].label}</span>
                        {isAdmin(customer) && <span className="rounded-full border border-[#cbd9ff] bg-[#f0f4ff] px-2 py-0.5 text-[11px] font-bold text-[#3067f1]">You</span>}
                      </div>
                      <a href={`mailto:${customer.email}`} className="mt-1 inline-flex max-w-full items-center gap-1.5 break-all text-sm text-[#626b80] hover:text-[#3067f1]">
                        <Mail size={13} className="shrink-0" /> {customer.email}
                      </a>
                      <p className="mt-1 text-xs text-[#8992a7]">Signed up {formatDate(customer.created_at)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-1 lg:gap-1.5">
                      <p><span className="font-semibold">{plan.name}</span> <span className="text-[#747d91]">· ${priceFor(plan, customer.billing)}/mo, {customer.billing}</span></p>
                      <p className="inline-flex min-w-0 items-center gap-1.5 text-[#626b80]">
                        <Globe2 size={14} className="shrink-0 text-[#8992a7]" />
                        <span className="truncate">{customer.desired_domain ?? <em className="not-italic text-[#a2aabc]">No domain yet</em>}</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      {actions.map((option) => (
                        <form key={option} action={setCustomerStatus}>
                          <input type="hidden" name="id" value={customer.id} />
                          <input type="hidden" name="status" value={option} />
                          <button
                            type="submit"
                            className={
                              option === 'active'
                                ? 'rounded-lg bg-[#3067f1] px-3.5 py-2 text-sm font-bold text-white transition hover:bg-[#2457d7]'
                                : option === 'suspended'
                                  ? 'rounded-lg border border-[#f5c2c0] px-3.5 py-2 text-sm font-semibold text-[#b42318] transition hover:bg-[#fff4f3]'
                                  : 'rounded-lg border border-[#dfe4ef] px-3.5 py-2 text-sm font-semibold text-[#30384d] transition hover:border-[#b9c8ed]'
                            }
                          >
                            {option === 'active' ? 'Mark live' : option === 'pending' ? 'Back to setting up' : 'Suspend'}
                          </button>
                        </form>
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
