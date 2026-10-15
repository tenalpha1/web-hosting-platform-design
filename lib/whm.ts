import 'server-only'
import { randomBytes, randomInt } from 'node:crypto'
import type { PlanId } from './plans'

/**
 * Talks to the HostUpon reseller WHM (cPanel's WHM API 1).
 * Needs WHM_API_TOKEN in Vercel (WHM → Development → Manage API Tokens).
 * WHM_HOST and WHM_USER can be overridden in Vercel if the server ever changes.
 */
const HOST = process.env.WHM_HOST ?? 'cp2.uhcloud.com'
const RESELLER = process.env.WHM_USER ?? 'bgwdomai'

/** WHM package for each BGW Domain plan. */
export const WHM_PACKAGES: Record<PlanId, string> = {
  starter: 'bgwdomai_bgw_starter',
  plus: 'bgwdomai_bgw_plus',
  pro: 'bgwdomai_bgw_pro',
}

export class WhmError extends Error {}

export function whmConfigured() {
  return !!process.env.WHM_API_TOKEN
}

type WhmResponse<T> = { metadata?: { result?: number; reason?: string }; data?: T }

async function call<T = unknown>(fn: string, params: Record<string, string> = {}): Promise<T> {
  const token = process.env.WHM_API_TOKEN
  if (!token) throw new WhmError('WHM is not connected yet. Add WHM_API_TOKEN in Vercel → Settings → Environment Variables.')

  const query = new URLSearchParams({ 'api.version': '1', ...params })
  let response: Response
  try {
    response = await fetch(`https://${HOST}:2087/json-api/${fn}?${query}`, {
      headers: { Authorization: `whm ${RESELLER}:${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(60_000),
    })
  } catch (error) {
    console.error('[whm] request failed', fn, error)
    throw new WhmError('Could not reach the hosting server (WHM). Please try again in a minute.')
  }

  if (response.status === 401 || response.status === 403) {
    throw new WhmError('WHM refused the API token. Check WHM_API_TOKEN in Vercel and the token’s permissions in WHM.')
  }
  const body = (await response.json().catch(() => null)) as WhmResponse<T> | null
  if (!response.ok || !body) throw new WhmError(`WHM returned an error (${response.status}).`)
  if (body.metadata?.result !== 1) {
    throw new WhmError(`WHM: ${(body.metadata?.reason ?? 'unknown error').replace(/\s+/g, ' ').slice(0, 300)}`)
  }
  return body.data as T
}

/** A cPanel username based on the domain: lowercase letters/digits, starts with a letter, 8–10 chars. */
export function usernameFor(domain: string) {
  let base = domain.toLowerCase().split('.')[0].replace(/[^a-z0-9]/g, '')
  base = base.replace(/^[0-9]+/, '')
  if (!base || base.startsWith('test')) base = `bgw${base}`
  const letters = 'abcdefghjkmnpqrstuvwxyz'
  const suffix = Array.from({ length: 3 }, () => letters[randomInt(letters.length)]).join('')
  return (base.slice(0, 7) + suffix).slice(0, 10)
}

function strongPassword() {
  // Never stored or shown — customers get into cPanel with a one-time login link instead.
  return `${randomBytes(18).toString('base64url')}#9aZ`
}

export async function createAccount(input: { domain: string; plan: PlanId; email: string }) {
  let lastError: unknown
  for (let attempt = 0; attempt < 3; attempt++) {
    const username = usernameFor(input.domain)
    try {
      await call('createacct', {
        username,
        domain: input.domain,
        plan: WHM_PACKAGES[input.plan],
        contactemail: input.email,
        password: strongPassword(),
      })
      return username
    } catch (error) {
      lastError = error
      // Only retry when the username itself was the problem.
      if (!(error instanceof WhmError) || !/user ?name|reserved/i.test(error.message)) throw error
    }
  }
  throw lastError
}

export async function suspendAccount(username: string) {
  await call('suspendacct', { user: username, reason: 'Suspended from the BGW Domain admin page' })
}

export async function unsuspendAccount(username: string) {
  await call('unsuspendacct', { user: username })
}

export async function changePackage(username: string, plan: PlanId) {
  await call('changepackage', { user: username, pkg: WHM_PACKAGES[plan] })
}

/** A one-time link that logs the customer straight into their cPanel. */
export async function cpanelLoginUrl(username: string) {
  const data = await call<{ url?: string }>('create_user_session', { user: username, service: 'cpaneld' })
  if (!data?.url) throw new WhmError('WHM did not return a login link.')
  return data.url
}
