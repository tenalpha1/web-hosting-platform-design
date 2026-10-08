import type { Metadata } from 'next'
import { LegalPage } from '@/components/legal-page'
import { COMPANY_NAME, SUPPORT_EMAIL } from '@/lib/plans'

export const metadata: Metadata = { title: 'Privacy Policy — BGW Host' }

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 7, 2026">
      <p>
        BGW Host is a web hosting service operated by {COMPANY_NAME}, an Indigenous-owned company based in Campbell River,
        British Columbia. We respect your privacy and handle personal information in line with Canada’s Personal
        Information Protection and Electronic Documents Act (PIPEDA). This policy explains what we collect, why, and the
        choices you have.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details</strong> you give us when you sign up: your name, email address, and the plan, billing period and domain name you choose.</li>
        <li><strong>Your password</strong>, which we never store as written. We keep only a scrambled (hashed) version that cannot be turned back into your password.</li>
        <li><strong>A sign-in cookie</strong> that keeps you logged in for up to 30 days. We don’t use advertising or tracking cookies.</li>
        <li><strong>Basic visit statistics</strong>, such as which pages are viewed, collected without cookies and without identifying you personally.</li>
        <li><strong>Messages you send us</strong>, for example when you contact support.</li>
        <li><strong>Your website and email content</strong> that you store on your hosting account. We only access it when needed to provide the service, keep it secure, or when you ask us to help.</li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To create and manage your account and hosting.</li>
        <li>To contact you about your account, service changes, renewals and support requests.</li>
        <li>To keep our service secure and prevent abuse.</li>
        <li>To meet our legal and accounting obligations.</li>
      </ul>
      <p>We do not sell your personal information, and we don’t share it with advertisers.</p>

      <h2>Who we share it with</h2>
      <p>
        We use trusted service providers to run BGW Host, such as our website and database hosts and the data centres that
        hold customer websites. They may only use your information to provide services to us. Some of these providers
        store data outside Canada, including in the United States, where it may be subject to the laws of that country.
        We may also disclose information if the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account information while your account is open. When you close your account, we delete or
        anonymize your information within a reasonable time, except for records we must keep by law (for example,
        billing records).
      </p>

      <h2>How we protect it</h2>
      <p>
        We use secure connections (HTTPS), hashed passwords, and access limited to the people who need it. No system is
        perfectly secure, but we take reasonable steps to protect your information.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can see and update your account details on your dashboard. You may also ask us for a copy of the personal
        information we hold about you, ask us to correct it, or ask us to close your account and delete your
        information. Email us and we’ll respond within 30 days.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions or concerns about privacy can be sent to our privacy contact at{' '}
        <a href={`mailto:${SUPPORT_EMAIL}?subject=BGW%20Host%20privacy`}>{SUPPORT_EMAIL}</a>. If you’re not satisfied
        with our answer, you can contact the Office of the Privacy Commissioner of Canada.
      </p>

      <h2>Changes to this policy</h2>
      <p>If we make important changes, we’ll update the date above and let account holders know by email.</p>
    </LegalPage>
  )
}
