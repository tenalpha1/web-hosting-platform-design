import Link from 'next/link'
import { Brand } from './brand'

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fbfcff] text-[#12182b]">
      <header className="border-b border-[#e7eaf2] bg-white">
        <div className="mx-auto flex h-[70px] max-w-3xl items-center justify-between px-6">
          <Brand />
          <nav className="flex gap-5 text-sm font-semibold text-[#626b80]">
            <Link href="/terms" className="hover:text-[#3067f1]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#3067f1]">Privacy</Link>
          </nav>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-6 py-12 text-[15px] leading-7 text-[#3a4258] [&_a]:font-semibold [&_a]:text-[#3067f1] [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-[-0.02em] [&_h2]:text-[#12182b] [&_li]:mt-1.5 [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        <h1 className="text-3xl font-bold tracking-[-0.05em] text-[#12182b] sm:text-4xl">{title}</h1>
        <p className="!mt-2 text-sm text-[#8992a7]">Last updated {updated}</p>
        {children}
      </article>
    </main>
  )
}
