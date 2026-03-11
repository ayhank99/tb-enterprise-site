import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import ScrollReveal from '@/components/ScrollReveal'
import QuoteSection from '@/components/sections/QuoteSection'
import { readCmsState } from '@/lib/cms-store'
import { getServiceNarrative } from '@/lib/professional-copy'
import { withSiteBasePath } from '@/lib/site-paths'
import { getServiceBySlug } from '@/lib/site-data'

type ServicePageProps = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const state = await readCmsState()
  return state.content.services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const state = await readCmsState()
  const service = getServiceBySlug(state.content, params.slug)

  if (!service) {
    return {
      title: 'Ydelse ikke fundet',
    }
  }

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: withSiteBasePath(`/ydelser/${service.slug}`),
    },
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const state = await readCmsState()
  const content = state.content
  const service = getServiceBySlug(content, params.slug)

  if (!service) {
    notFound()
  }

  return (
    <>
      <PageHero
        eyebrow="Ydelse"
        title={service.title}
        intro={service.description}
        imageSrc={service.image}
        imageAlt={service.title}
        primaryCtaLabel={`Få tilbud på ${service.title.toLowerCase()}`}
        primaryCtaHref="/kontakt#tilbudsformular"
        secondaryCtaLabel="Ring nu"
        secondaryCtaHref={content.company.phoneHref}
      />

      <section className="section-soft py-16 md:py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal as="article" variant="left" className="panel-card p-7">
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-[-0.04em] text-[color:var(--site-text)]">Dette indgår</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[color:var(--site-muted)]">
              {service.includes.map((item) => (
                <li key={item} className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal as="article" variant="right" delay={90} className="panel-card p-7" style={{ background: 'var(--site-primary-soft)' }}>
            <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-[-0.04em] text-[color:var(--site-text)]">Typisk relevant til</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[color:var(--site-muted)]">
              {service.idealFor.map((item) => (
                <li key={item} className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </Container>
      </section>

      <PageNarrativeSection
        block={getServiceNarrative(service)}
        imageSrc={service.image}
        imageAlt={service.title}
        reverse
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}
