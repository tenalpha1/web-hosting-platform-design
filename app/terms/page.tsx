import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPage } from '@/components/legal-page'
import { COMPANY_NAME, SUPPORT_EMAIL } from '@/lib/plans'

export const metadata: Metadata = { title: 'Terms of Service — BGW Host' }

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 7, 2026">
      <p>
        These terms are an agreement between you and {COMPANY_NAME} (“BGW Host”, “we”, “us”), based in Campbell River,
        British Columbia. By creating an account or using BGW Host, you agree to them. Please read them, and contact us
        if anything is unclear.
      </p>

      <h2>1. The service</h2>
      <p>
        BGW Host provides shared web hosting: storage space for websites and email, managed through a cPanel control
        panel. Each plan has the limits shown on our pricing page (such as storage, number of websites and email
        accounts). We may improve or change features over time, and we’ll tell you before any change that reduces what
        your plan includes.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must be at least 18 years old, or have permission from a parent or guardian, and give us accurate information.</li>
        <li>You’re responsible for keeping your password safe and for everything done through your account.</li>
        <li>Tell us right away if you think someone has used your account without permission.</li>
      </ul>

      <h2>3. Payment and renewal</h2>
      <ul>
        <li>Plans are paid in advance, monthly or yearly, at the price shown when you sign up or renew.</li>
        <li>Plans renew automatically for the same period unless you cancel before the renewal date.</li>
        <li>If a payment is not received, we may suspend your hosting after giving you notice, and close the account if it stays unpaid.</li>
        <li>We’ll give you at least 30 days’ notice before any price change affects your renewal.</li>
      </ul>

      <h2>4. Cancelling</h2>
      <p>
        You can cancel at any time by contacting us. Your hosting stays active until the end of the period you have paid
        for. Please download a copy of your website and email before your account closes, because the content is deleted
        afterwards.
      </p>

      <h2>5. Acceptable use</h2>
      <p>You may not use BGW Host to:</p>
      <ul>
        <li>break any law, or host content that is illegal, hateful, or that infringes someone else’s copyright or trademark;</li>
        <li>send spam or bulk email that people didn’t ask for;</li>
        <li>host malware, phishing pages, or anything meant to deceive or harm others;</li>
        <li>attack, probe or overload other systems or networks;</li>
        <li>use so much of the shared server that it harms other customers (for example, cryptocurrency mining or file-sharing archives).</li>
      </ul>
      <p>
        If an account breaks these rules, we may suspend it. Where possible, we’ll contact you first so you can fix the
        problem.
      </p>

      <h2>6. Your content and backups</h2>
      <p>
        You own your website, files and email. You give us permission to store and process them only so we can provide
        the service. You’re responsible for your content and for keeping your own backup copies. We take care to keep
        the service reliable, but we can’t guarantee that data will never be lost.
      </p>

      <h2>7. Availability</h2>
      <p>
        We work to keep your website online at all times, but like any hosting service, there may be interruptions for
        maintenance or reasons beyond our control. We don’t guarantee uninterrupted service.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the extent the law allows, BGW Host is not responsible for indirect losses such as lost profits or lost
        business, and our total responsibility for any claim is limited to the amount you paid us in the 12 months
        before the claim. Nothing in these terms limits rights you have under consumer protection law that cannot be
        waived.
      </p>

      <h2>9. Privacy</h2>
      <p>
        How we handle your personal information is explained in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms. If we make important changes, we’ll update the date above and email account holders
        before the changes take effect.
      </p>

      <h2>11. Governing law</h2>
      <p>These terms are governed by the laws of British Columbia and the federal laws of Canada that apply there.</p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${SUPPORT_EMAIL}?subject=BGW%20Host%20terms`}>{SUPPORT_EMAIL}</a>.
      </p>
    </LegalPage>
  )
}
