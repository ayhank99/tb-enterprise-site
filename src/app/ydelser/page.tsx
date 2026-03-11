import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
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
  const heroImage = content.services[0]?.image ?? content.hero.backgroundImage

  return (
    <>
      <PageHero
        eyebrow={block.eyebrow}
        title={block.title}
        intro={block.intro}
        imageSrc={heroImage}
        imageAlt={content.pages.services.title}
        primaryCtaLabel="Få et tilbud"
        primaryCtaHref="/kontakt#tilbudsformular"
        secondaryCtaLabel="Ring nu"
        secondaryCtaHref={content.company.phoneHref}
      />

      <ServiceCards
        title="Alle vores ydelser"
        intro="Klik ind på den enkelte ydelse for at se omfang, leverance og hvad løsningen passer bedst til."
        services={content.services}
        templateId={state.activeTemplate}
      />
      <ProcessSection steps={content.processSteps} templateId={state.activeTemplate} block={processBlock} />
      <PageNarrativeSection
        block={narrative}
        imageSrc={heroImage}
        imageAlt={content.pages.services.title}
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}
