'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSession, destroySession, getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth'
import { isAdmin, isStatus } from '@/lib/admin'
import { db } from '@/lib/db'
import { getSubscription } from '@/lib/paypal'
import { cpanelLoginUrl, createAccount, removeAccount, suspendAccount, unsuspendAccount, whmConfigured, WhmError } from '@/lib/whm'
import { PAYPAL_PLANS } from '@/lib/paypal-plans'
import { getPlan, isBilling, isPlanId } from '@/lib/plans'

export type FormState = {
  error?: string
  message?: string
  values?: Record<string, string>
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DOMAIN_PATTERN = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})*\.[a-z]{2,}$/

function text(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeDomain(value: string) {
  return value.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
}

function serviceError(error: unknown): FormState {
  console.error('[cloudnest] database error', error)
  return { error: 'We could not reach our servers just now. Please try again in a minute.' }
}

/* ---------- Sign up ---------- */

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = text(formData, 'name')
  const email = text(formData, 'email').toLowerCase()
  const password = typeof formData.get('password') === 'string' ? (formData.get('password') as string) : ''
  const plan = text(formData, 'plan')
  const billing = text(formData, 'billing')
  const domain = normalizeDomain(text(formData, 'domain'))
  const values = { name, email, plan, billing, domain }

  if (!name || name.length > 100) return { error: 'Please enter your name.', values }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return { error: 'Please enter a valid email address.', values }
  if (password.length < 8) return { error: 'Your password needs at least 8 characters.', values }
  if (password.length > 200) return { error: 'That password is too long.', values }
  if (!isPlanId(plan)) return { error: 'Please choose a plan.', values }
  if (!isBilling(billing)) return { error: 'Please choose monthly or yearly billing.', values }
  if (domain && !DOMAIN_PATTERN.test(domain)) return { error: 'That domain doesn’t look right. Try something like yourname.com.', values }
  if (formData.get('terms') !== 'on') return { error: 'Please agree to the terms to create your account.', values }

  try {
    const sql = await db()
    const passwordHash = await hashPassword(password)
    const rows = await sql`
      INSERT INTO cloudnest_users (name, email, password_hash, plan, billing, desired_domain)
      VALUES (${name}, ${email}, ${passwordHash}, ${plan}, ${billing}, ${domain || null})
      ON CONFLICT (email) DO NOTHING
      RETURNING id`
    if (rows.length === 0) {
      return { error: 'An account with that email already exists. Try logging in instead.', values }
    }
    await createSession(rows[0].id as number)
  } catch (error) {
    return { ...serviceError(error), values }
  }

  redirect('/dashboard?welcome=1')
}

/* ---------- Log in ---------- */

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = text(formData, 'email').toLowerCase()
  const password = typeof formData.get('password') === 'string' ? (formData.get('password') as string) : ''
  const values = { email }

  if (!email || !password) return { error: 'Please enter your email and password.', values }

  try {
    const sql = await db()
    const rows = await sql`SELECT id, password_hash FROM cloudnest_users WHERE email = ${email} LIMIT 1`
    const user = rows[0]
    const valid = user ? await verifyPassword(password, user.password_hash as string) : false
    if (!user || !valid) return { error: 'That email and password don’t match an account.', values }
    await createSession(user.id as number)
  } catch (error) {
    return { ...serviceError(error), values }
  }

  redirect('/dashboard')
}

/* ---------- Log out ---------- */

export async function logout() {
  try {
    await destroySession()
  } catch (error) {
    console.error('[cloudnest] logout error', error)
  }
  redirect('/')
}

/* ---------- Change plan ---------- */

export async function changePlan(_prev: FormState, formData: FormData): Promise<FormState> {
  const plan = text(formData, 'plan')
  const billing = text(formData, 'billing')
  if (!isPlanId(plan) || !isBilling(billing)) return { error: 'Please choose a plan and billing period.' }

  try {
    const user = await getCurrentUser()
    if (!user) return { error: 'Your session has ended. Please log in again.' }
    if (user.payment_status !== 'unpaid') return { error: 'Your plan is already paid for. Please contact support to change it.' }
    const sql = await db()
    await sql`UPDATE cloudnest_users SET plan = ${plan}, billing = ${billing} WHERE id = ${user.id}`
  } catch (error) {
    return serviceError(error)
  }

  revalidatePath('/dashboard')
  return { message: 'Your plan has been updated.' }
}

/* ---------- Customer: set the domain for their site ---------- */

export async function updateDomain(_prev: FormState, formData: FormData): Promise<FormState> {
  const domain = normalizeDomain(text(formData, 'domain'))
  if (!DOMAIN_PATTERN.test(domain)) return { error: 'That domain doesn’t look right. Try something like yourname.com.', values: { domain } }

  try {
    const user = await getCurrentUser()
    if (!user) return { error: 'Your session has ended. Please log in again.' }
    const sql = await db()
    await sql`UPDATE cloudnest_users SET desired_domain = ${domain} WHERE id = ${user.id}`
  } catch (error) {
    return serviceError(error)
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin')
  return { message: 'Domain saved.' }
}

/* ---------- Admin: change a customer's hosting status (and their cPanel account in WHM) ---------- */

function adminNotice(tone: 'ok' | 'error', message: string): never {
  redirect(`/admin?${new URLSearchParams({ tone, notice: message.slice(0, 400) })}`)
}

export async function setCustomerStatus(formData: FormData) {
  const id = Number(text(formData, 'id'))
  const status = text(formData, 'status')
  if (!Number.isInteger(id) || id <= 0 || !isStatus(status)) return

  const admin = await getCurrentUser()
  if (!isAdmin(admin)) return

  const sql = await db()
  const rows = (await sql`SELECT id, name, email, plan, desired_domain, status, whm_username FROM cloudnest_users WHERE id = ${id}`) as {
    id: number; name: string; email: string; plan: string; desired_domain: string | null; status: string; whm_username: string | null
  }[]
  const customer = rows[0]
  if (!customer) adminNotice('error', 'That customer could not be found.')

  let notice = `${customer.name} is now ${status === 'active' ? 'live' : status === 'suspended' ? 'suspended' : 'back to setting up'}.`
  let whmUsername = customer.whm_username

  if (whmConfigured()) {
    try {
      if (status === 'active' && !whmUsername) {
        if (!customer.desired_domain) adminNotice('error', `${customer.name} hasn’t chosen a domain yet, so their hosting account can’t be created. Ask them to add one on their dashboard.`)
        whmUsername = await createAccount({ domain: customer.desired_domain, plan: getPlan(customer.plan).id, email: customer.email })
        notice = `Hosting account “${whmUsername}” created in WHM for ${customer.desired_domain}, and ${customer.name} is now live.`
      } else if (status === 'active' && customer.status === 'suspended' && whmUsername) {
        await unsuspendAccount(whmUsername)
        notice = `${customer.name}’s hosting is turned back on in WHM, and they’re live again.`
      } else if (status === 'suspended' && whmUsername) {
        await suspendAccount(whmUsername)
        notice = `${customer.name}’s hosting is suspended in WHM.`
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'digest' in error) throw error // let redirects through
      console.error('[whm] admin action failed', error)
      adminNotice('error', error instanceof WhmError ? error.message : 'Something went wrong talking to WHM. Nothing was changed.')
    }
  } else if (status !== 'pending') {
    notice += ' (WHM isn’t connected yet, so remember to make the change in WHM yourself.)'
  }

  await sql`UPDATE cloudnest_users SET status = ${status}, whm_username = ${whmUsername} WHERE id = ${id}`
  revalidatePath('/dashboard')
  adminNotice('ok', notice)
}

/* ---------- Admin: remove a customer (e.g. a test account) ---------- */

export async function removeCustomer(formData: FormData) {
  const id = Number(text(formData, 'id'))
  if (!Number.isInteger(id) || id <= 0) return
  const admin = await getCurrentUser()
  if (!isAdmin(admin) || !admin) return
  if (formData.get('confirm') !== 'yes') adminNotice('error', 'Tick “Yes, remove” to confirm before removing a customer.')
  if (admin.id === id) adminNotice('error', 'You can’t remove your own account.')

  const sql = await db()
  const rows = (await sql`SELECT name, whm_username FROM cloudnest_users WHERE id = ${id}`) as { name: string; whm_username: string | null }[]
  const customer = rows[0]
  if (!customer) adminNotice('error', 'That customer could not be found.')

  let notice = `${customer.name} has been removed.`
  if (customer.whm_username && formData.get('hosting') === 'yes') {
    if (!whmConfigured()) adminNotice('error', 'WHM isn’t connected, so their hosting account can’t be deleted from here.')
    try {
      await removeAccount(customer.whm_username)
      notice = `${customer.name} has been removed, and their hosting account “${customer.whm_username}” was deleted from WHM.`
    } catch (error) {
      console.error('[whm] remove failed', error)
      adminNotice('error', error instanceof WhmError ? error.message : 'Something went wrong talking to WHM. Nothing was removed.')
    }
  } else if (customer.whm_username) {
    notice += ` Their hosting account “${customer.whm_username}” was left in WHM.`
  }

  await sql`DELETE FROM cloudnest_users WHERE id = ${id}`
  revalidatePath('/admin')
  adminNotice('ok', notice)
}

/* ---------- Customer: open their cPanel without a password ---------- */

export async function openCpanel() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (!user.whm_username || user.status !== 'active') redirect('/dashboard')
  let url: string
  try {
    url = await cpanelLoginUrl(user.whm_username)
  } catch (error) {
    console.error('[whm] cPanel login link failed', error)
    redirect('/dashboard?cpanel=error')
  }
  redirect(url)
}

/* ---------- Customer: confirm a PayPal subscription after checkout ---------- */

export async function confirmSubscription(subscriptionId: string): Promise<FormState> {
  if (typeof subscriptionId !== 'string' || !/^I-[A-Z0-9]{6,40}$/.test(subscriptionId)) {
    return { error: 'We could not read the PayPal confirmation. Please contact support.' }
  }

  const user = await getCurrentUser()
  if (!user) return { error: 'Your session has ended. Please log in again.' }
  const expectedPlan = PAYPAL_PLANS[getPlan(user.plan).id][user.billing]
  const sql = await db()

  try {
    const subscription = await getSubscription(subscriptionId)
    const ok =
      subscription &&
      ['ACTIVE', 'APPROVED'].includes(subscription.status) &&
      subscription.plan_id === expectedPlan &&
      (!subscription.custom_id || subscription.custom_id === String(user.id))
    if (!ok) {
      console.error('[bgw] subscription did not match', { userId: user.id, subscriptionId, status: subscription?.status, plan: subscription?.plan_id })
      await sql`UPDATE cloudnest_users SET payment_status = 'unverified', paypal_subscription_id = ${subscriptionId} WHERE id = ${user.id}`
      revalidatePath('/dashboard')
      revalidatePath('/admin')
      return { error: 'PayPal did not confirm this payment for your plan. We’ve saved the details and will check it for you.' }
    }
    await sql`
      UPDATE cloudnest_users
      SET payment_status = 'paid', paypal_subscription_id = ${subscriptionId}, paid_at = NOW()
      WHERE id = ${user.id}`
  } catch (error) {
    // PayPal unreachable or not configured: keep the ID so the owner can check it by hand.
    console.error('[bgw] could not verify subscription', error)
    await sql`UPDATE cloudnest_users SET payment_status = 'unverified', paypal_subscription_id = ${subscriptionId} WHERE id = ${user.id}`
    revalidatePath('/dashboard')
    revalidatePath('/admin')
    return { message: 'Thank you! Your payment was received. We’ll confirm it shortly.' }
  }

  revalidatePath('/dashboard')
  revalidatePath('/admin')
  return { message: 'Payment confirmed. Thank you!' }
}
