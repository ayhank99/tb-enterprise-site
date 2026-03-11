import type { Metadata } from 'next'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import ScrollReveal from '@/components/ScrollReveal'
import SectionHeading from '@/components/SectionHeading'
import QuoteSection from '@/components/sections/QuoteSection'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Om os',
  description: 'Læs om TB Entreprise og vores tilgang til belægning, anlæg, vedligehold og mindre entrepriser.',
  alternates: {
    canonical: withSiteBasePath('/om-os'),
  },
}

export default async function AboutPage() {
  const state = await readCmsState()
  const content = state.content
  const block = content.pages.about ?? defaultSiteContent.pages.about
  const narrative = content.pages.about?.narrative ?? defaultSiteContent.pages.about.narrative

  return (
    <>
      <PageHero
        eyebrow={block.hero.eyebrow}
        title={block.hero.title}
        intro={block.hero.intro}
        imageSrc={content.hero.backgroundImage}
        imageAlt={content.company.name}
        primaryCtaLabel="Kontakt os"
        primaryCtaHref="/kontakt#tilbudsformular"
        secondaryCtaLabel="Se ydelser"
        secondaryCtaHref="/ydelser"
      />

      <section className="bg-[color:var(--site-bg-soft)] py-16 md:py-20">
        <Container>
          <SectionHeading eyebrow="Virksomheden" title={content.companyStory.title} intro={content.companyStory.intro} />
          <div className="grid gap-6 md:grid-cols-3">
            {content.companyStory.points.map((point, index) => (
              <ScrollReveal key={point} as="article" variant="soft" delay={index * 70} className="panel-card p-6">
                <p className="text-sm leading-relaxed text-[color:var(--site-muted)]">{point}</p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[color:var(--site-panel)] py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal as="article" variant="left" className="panel-card p-8">
            <h2 className="font-display text-[clamp(1.7rem,3vw,2.35rem)] font-bold tracking-[-0.04em] text-[color:var(--site-text)]">
              {block.whyTitle}
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[color:var(--site-muted)]">
              {block.whyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal as="article" variant="right" delay={90} className="panel-card p-8" style={{ background: 'var(--site-primary-soft)' }}>
            <h2 className="font-display text-[clamp(1.7rem,3vw,2.35rem)] font-bold tracking-[-0.04em] text-[color:var(--site-text)]">
              {block.principleTitle}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[color:var(--site-muted)]">{block.principleText}</p>
          </ScrollReveal>
        </Container>
      </section>

      <PageNarrativeSection
        block={narrative}
        imageSrc={content.hero.backgroundImage}
        imageAlt={content.company.name}
        reverse
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}
