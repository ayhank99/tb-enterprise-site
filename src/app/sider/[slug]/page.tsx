import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import ScrollReveal from '@/components/ScrollReveal'
import QuoteSection from '@/components/sections/QuoteSection'
import { readCmsState } from '@/lib/cms-store'
import { getCustomPageNarrative } from '@/lib/professional-copy'
import { withSiteBasePath } from '@/lib/site-paths'
import { getCustomPageBySlug, getCustomPageHeroImage } from '@/lib/site-data'

type CustomPageProps = {
  params: {
    slug: string
  }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: CustomPageProps): Promise<Metadata> {
  const state = await readCmsState()
  const page = getCustomPageBySlug(state.content, params.slug)

  if (!page) {
    return {
      title: 'Side ikke fundet',
    }
  }

  return {
    title: page.title,
    description: page.intro,
    alternates: {
      canonical: withSiteBasePath(`/sider/${page.slug}`),
    },
  }
}

export default async function CustomPage({ params }: CustomPageProps) {
  const state = await readCmsState()
  const page = getCustomPageBySlug(state.content, params.slug)

  if (!page) {
    notFound()
  }

  const heroImage = getCustomPageHeroImage(state.content, page.slug)

  return (
    <>
      <PageHero
        eyebrow={page.menuLabel}
        title={page.title}
        intro={page.intro}
        imageSrc={heroImage}
        imageAlt={page.title}
        primaryCtaLabel="Kontakt os"
        primaryCtaHref="/kontakt#tilbudsformular"
        secondaryCtaLabel="Se ydelser"
        secondaryCtaHref="/ydelser"
      />

      <section className="section-soft py-16 md:py-20">
        <Container className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {page.sections.map((section, index) => (
            <ScrollReveal key={section.heading} as="article" variant="soft" delay={index * 70} className="panel-card p-6">
              <h2 className="font-display text-[clamp(1.45rem,2.8vw,2rem)] font-bold tracking-[-0.04em] text-[color:var(--site-text)]">{section.heading}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--site-muted)]">{section.text}</p>
              {section.bullets.length > 0 ? (
                <ul className="mt-5 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] px-3 py-2 text-sm">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </ScrollReveal>
          ))}
        </Container>
      </section>

      <PageNarrativeSection
        block={getCustomPageNarrative(page)}
        imageSrc={heroImage}
        imageAlt={page.title}
      />
      <QuoteSection company={state.content.company} quoteForm={state.content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}
