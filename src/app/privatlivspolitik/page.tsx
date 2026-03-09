import type { Metadata } from 'next'
import Container from '@/components/Container'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Privatlivspolitik',
  description: 'Information om hvordan vi behandler personoplysninger i forbindelse med henvendelser.',
  alternates: {
    canonical: withSiteBasePath('/privatlivspolitik'),
  },
}

export default async function PrivacyPolicyPage() {
  const state = await readCmsState()
  const sections = state.content.pages.privacy?.sections ?? defaultSiteContent.pages.privacy.sections
  const title = state.content.pages.privacy?.title ?? defaultSiteContent.pages.privacy.title

  return (
    <section className="section-soft py-20">
      <Container className="max-w-4xl">
        <h1 className="font-display text-4xl text-[color:var(--site-text)]">{title}</h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[color:var(--site-muted)]">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl text-[color:var(--site-text)]">{section.heading}</h2>
              <p>{section.text}</p>
            </section>
          ))}
        </div>
      </Container>
    </section>
  )
}
