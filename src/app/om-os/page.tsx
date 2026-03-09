import type { Metadata } from 'next'
import Container from '@/components/Container'
import PageNarrativeSection from '@/components/PageNarrativeSection'
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
      <section className="bg-[color:var(--site-bg-soft)] py-20">
        <Container>
          <SectionHeading eyebrow={block.hero.eyebrow} title={block.hero.title} intro={block.hero.intro} />
          <div className="grid gap-6 md:grid-cols-3">
            {content.companyStory.points.map((point) => (
              <article key={point} className="panel-card p-6">
                <p className="text-sm leading-relaxed text-[color:var(--site-muted)]">{point}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[color:var(--site-panel)] py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <article className="panel-card p-8">
            <h2 className="font-display text-3xl text-[color:var(--site-text)]">{block.whyTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[color:var(--site-muted)]">
              {block.whyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <article className="panel-card p-8" style={{ background: 'var(--site-primary-soft)' }}>
            <h2 className="font-display text-3xl text-[color:var(--site-text)]">{block.principleTitle}</h2>
            <p className="mt-5 text-sm leading-relaxed text-[color:var(--site-muted)]">{block.principleText}</p>
          </article>
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


