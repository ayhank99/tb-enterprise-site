import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import PageNarrativeSection from '@/components/PageNarrativeSection'
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
      <section className="hero-shell py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="section-eyebrow">Ydelse</p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl">{service.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--site-on-dark-soft)]">{service.description}</p>
            <div className="mt-8">
              <Link href="/kontakt#tilbudsformular" className="btn-primary">
                Få tilbud på {service.title.toLowerCase()}
              </Link>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-3xl border lg:h-96" style={{ borderColor: 'var(--site-on-dark-border)' }}>
            <Image src={withSiteBasePath(service.image)} alt={service.title} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
          </div>
        </Container>
      </section>

      <section className="section-soft py-20">
        <Container className="grid gap-8 lg:grid-cols-2">
          <article className="panel-card p-7">
            <h2 className="font-display text-3xl text-[color:var(--site-text)]">Dette indgår</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[color:var(--site-muted)]">
              {service.includes.map((item) => (
                <li key={item} className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="panel-card p-7" style={{ background: 'var(--site-primary-soft)' }}>
            <h2 className="font-display text-3xl text-[color:var(--site-text)]">Typisk relevant til</h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-[color:var(--site-muted)]">
              {service.idealFor.map((item) => (
                <li key={item} className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
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

