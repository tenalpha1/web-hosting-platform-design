import 'server-only'
import { adminEmails } from './admin'
import { SUPPORT_EMAIL } from './plans'

/**
 * Sends email through Resend (resend.com). Needs RESEND_API_KEY in Vercel.
 * If the key is missing or Resend is down, the email is skipped and logged —
 * it never stops a sign-up, payment or admin action from working.
 */
const FROM = process.env.EMAIL_FROM ?? 'BGW Domain <hello@bgwdomains.com>'
const SITE = 'https://www.bgwdomains.com'

function escape(text: string) {
  return text.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

type Block = string | { button: { label: string; href: string } }

function layout(heading: string, blocks: Block[]) {
  const body = blocks
    .map((block) =>
      typeof block === 'string'
        ? `<p style="margin:0 0 16px;font-size:15px;line-height:24px;color:#3a4258">${block}</p>`
        : `<p style="margin:24px 0"><a href="${block.button.href}" style="display:inline-block;background:#3067f1;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:10px">${escape(block.button.label)}</a></p>`,
    )
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;border:1px solid #e1e5ef">
<tr><td style="padding:28px 32px 8px"><img src="${SITE}/brand/bgw-domain-logo.png" alt="BGW Domain" width="180" style="display:block;height:auto"></td></tr>
<tr><td style="padding:8px 32px 24px"><h1 style="margin:16px 0 18px;font-size:22px;line-height:30px;color:#12182b">${escape(heading)}</h1>${body}</td></tr>
<tr><td style="padding:18px 32px;border-top:1px solid #edf0f5;font-size:12px;line-height:18px;color:#8992a7">
BGW Domain · A BGW Film Studios company · Campbell River, BC<br>Questions? Just reply to this email or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:#3067f1">${SUPPORT_EMAIL}</a>.
</td></tr></table></td></tr></table></body></html>`
}

function plain(heading: string, blocks: Block[]) {
  const lines = blocks.map((b) => (typeof b === 'string' ? b.replace(/<[^>]+>/g, '') : `${b.button.label}: ${b.button.href}`))
  return [heading, '', ...lines, '', `BGW Domain · ${SITE}`, `Questions? Reply to this email or write to ${SUPPORT_EMAIL}.`].join('\n')
}

export async function sendEmail(to: string | string[], subject: string, heading: string, blocks: Block[]) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log('[email] RESEND_API_KEY not set — skipped:', subject)
    return
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, reply_to: SUPPORT_EMAIL, html: layout(heading, blocks), text: plain(heading, blocks) }),
      signal: AbortSignal.timeout(15_000),
    })
    if (!response.ok) console.error('[email] Resend refused', response.status, (await response.text()).slice(0, 300))
  } catch (error) {
    console.error('[email] send failed', subject, error)
  }
}

const owner = () => adminEmails()

/* ---------- The emails ---------- */

type Customer = { name: string; email: string }

export async function emailWelcome(c: Customer & { planName: string; billing: string; domain: string | null }) {
  await Promise.all([
    sendEmail(c.email, 'Welcome to BGW Domain', `Welcome, ${c.name.split(' ')[0]}!`, [
      `Thanks for choosing BGW Domain. Your account is ready, and you picked the <strong>${escape(c.planName)}</strong> plan, billed ${escape(c.billing)}.`,
      'Next step: complete your payment on your dashboard. As soon as it’s through, we’ll set up your hosting — usually within one business day.',
      { button: { label: 'Go to my dashboard', href: `${SITE}/dashboard` } },
    ]),
    sendEmail(owner(), `New sign-up: ${c.name}`, 'New BGW Domain sign-up', [
      `<strong>${escape(c.name)}</strong> (${escape(c.email)}) just created an account.`,
      `Plan: ${escape(c.planName)}, ${escape(c.billing)}. Domain: ${c.domain ? escape(c.domain) : 'not chosen yet'}.`,
      { button: { label: 'Open admin', href: `${SITE}/admin` } },
    ]),
  ])
}

export async function emailPaymentReceived(c: Customer & { planName: string; domain: string | null }) {
  await Promise.all([
    sendEmail(c.email, 'Payment received — thank you', `Thank you, ${c.name.split(' ')[0]}!`, [
      `We’ve received your payment for the <strong>${escape(c.planName)}</strong> plan. Your PayPal receipt is on its way separately.`,
      c.domain
        ? `We’re now setting up hosting for <strong>${escape(c.domain)}</strong>. We’ll email you again the moment it’s ready.`
        : 'Next, add the domain you’d like to use on your dashboard so we can set up your hosting.',
      { button: { label: 'Go to my dashboard', href: `${SITE}/dashboard` } },
    ]),
    sendEmail(owner(), `New payment: ${c.name} (${c.planName})`, 'New payment received', [
      `<strong>${escape(c.name)}</strong> (${escape(c.email)}) paid for the ${escape(c.planName)} plan.`,
      c.domain ? `Domain: ${escape(c.domain)}. They’re ready for “Create hosting & mark live”.` : 'They haven’t chosen a domain yet.',
      { button: { label: 'Open admin', href: `${SITE}/admin` } },
    ]),
  ])
}

export async function emailHostingReady(c: Customer & { domain: string | null }) {
  await sendEmail(c.email, 'Your hosting is ready', `Your hosting is ready, ${c.name.split(' ')[0]}!`, [
    c.domain ? `Your server space for <strong>${escape(c.domain)}</strong> is set up and live.` : 'Your server space is set up and live.',
    'Open cPanel from your dashboard to add email accounts, install WordPress, or upload your website — no extra password needed.',
    { button: { label: 'Open my dashboard', href: `${SITE}/dashboard` } },
    'To point your domain at your new hosting, set its nameservers (at the company where you registered it) to:<br><strong>ns1.bgwdomains.com</strong><br><strong>ns2.bgwdomains.com</strong><br>Changes can take a few hours to reach everyone.',
  ])
}

export async function emailSubscriptionProblem(c: Customer, status: 'cancelled' | 'paused' | 'failed') {
  const what = status === 'failed' ? 'your last payment didn’t go through' : status === 'paused' ? 'your PayPal subscription was paused' : 'your PayPal subscription was cancelled'
  await Promise.all([
    sendEmail(c.email, status === 'failed' ? 'Your payment didn’t go through' : 'Your subscription has ended', `Hi ${c.name.split(' ')[0]},`, [
      `We noticed that ${what}.`,
      'If that was a mistake, you can subscribe again from your dashboard and your hosting will carry on as normal. If you meant to leave — thank you for being with us.',
      { button: { label: 'Go to my dashboard', href: `${SITE}/dashboard` } },
    ]),
    sendEmail(owner(), `Subscription ${status}: ${c.name}`, 'Subscription needs a look', [
      `For <strong>${escape(c.name)}</strong> (${escape(c.email)}), ${what}.`,
      'Decide whether to suspend their hosting in the admin page.',
      { button: { label: 'Open admin', href: `${SITE}/admin` } },
    ]),
  ])
}
