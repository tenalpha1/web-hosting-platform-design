'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSession, destroySession, getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth'
import { db } from '@/lib/db'
import { isBilling, isPlanId } from '@/lib/plans'

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
  const domain = text(formData, 'domain').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
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
    const sql = await db()
    await sql`UPDATE cloudnest_users SET plan = ${plan}, billing = ${billing} WHERE id = ${user.id}`
  } catch (error) {
    return serviceError(error)
  }

  revalidatePath('/dashboard')
  return { message: 'Your plan has been updated.' }
}
