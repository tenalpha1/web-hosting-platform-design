import 'server-only'
import type { User } from './auth'

/**
 * Who can open /admin. Set ADMIN_EMAILS in Vercel (comma-separated) to change it;
 * otherwise the owner's account is the only admin.
 */
const DEFAULT_ADMINS = ['bwbillyg@gmail.com']

export function adminEmails() {
  const fromEnv = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
  return fromEnv.length ? fromEnv : DEFAULT_ADMINS
}

export function isAdmin(user: Pick<User, 'email'> | null | undefined) {
  return !!user && adminEmails().includes(user.email.toLowerCase())
}

export const STATUSES = {
  pending: { label: 'Setting up', tone: 'bg-[#fff6e5] text-[#9a6200] border-[#f5d9a3]' },
  active: { label: 'Live', tone: 'bg-[#e9f7f0] text-[#1d7a52] border-[#b6e3cc]' },
  suspended: { label: 'Suspended', tone: 'bg-[#fff1f0] text-[#b42318] border-[#f5c2c0]' },
} as const

export type Status = keyof typeof STATUSES

export function isStatus(value: unknown): value is Status {
  return typeof value === 'string' && value in STATUSES
}
