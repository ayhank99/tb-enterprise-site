import type { Metadata } from 'next'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import ScrollReveal from '@/components/ScrollReveal'
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
    <>
      <PageHero
        eyebrow="Information"
        title={title}
        intro="Her kan du læse, hvordan TB Entreprise behandler personoplysninger i forbindelse med henvendelser og tilbud."
        imageSrc={state.content.hero.backgroundImage}
        imageAlt={state.content.company.name}
        primaryCtaLabel="Kontakt os"
        primaryCtaHref="/kontakt#tilbudsformular"
      />

      <section className="section-soft py-16 md:py-20">
        <Container className="max-w-4xl">
          <div className="space-y-8 text-sm leading-relaxed text-[color:var(--site-muted)]">
            {sections.map((section, index) => (
              <ScrollReveal key={section.heading} as="section" variant="soft" delay={index * 50} className="panel-card p-6 sm:p-7">
                <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-bold tracking-[-0.04em] text-[color:var(--site-text)]">{section.heading}</h2>
                <p className="mt-3">{section.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
