import type { Metadata } from 'next'
import Container from '@/components/Container'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import ProcessSection from '@/components/sections/ProcessSection'
import QuoteSection from '@/components/sections/QuoteSection'
import ServiceCards from '@/components/sections/ServiceCards'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Ydelser',
  description:
    'Se vores ydelser inden for belægning, anlæg, græspleje, træarbejde og mindre entrepriser.',
  alternates: {
    canonical: withSiteBasePath('/ydelser'),
  },
}

export default async function ServicesPage() {
  const state = await readCmsState()
  const content = state.content
  const block = content.pages.services ?? defaultSiteContent.pages.services
  const processBlock = content.pages.home?.process ?? defaultSiteContent.pages.home.process
  const narrative = content.pages.services?.narrative ?? defaultSiteContent.pages.services.narrative

  return (
    <>
      <section className="hero-shell py-20">
        <Container>
          <p className="section-eyebrow">{block.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl md:text-6xl">{block.title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[color:var(--site-on-dark-soft)]">{block.intro}</p>
        </Container>
      </section>

      <ServiceCards
        title="Alle vores ydelser"
        intro="Klik ind på den enkelte ydelse for at se omfang, leverance og hvad løsningen passer bedst til."
        services={content.services}
        templateId={state.activeTemplate}
      />
      <ProcessSection steps={content.processSteps} templateId={state.activeTemplate} block={processBlock} />
      <PageNarrativeSection
        block={narrative}
        imageSrc={content.services[0]?.image ?? content.hero.backgroundImage}
        imageAlt={content.pages.services.title}
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}

