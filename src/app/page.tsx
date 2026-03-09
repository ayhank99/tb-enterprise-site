import BuilderzIntroSection from '@/components/sections/BuilderzIntroSection'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import StatsBand from '@/components/sections/StatsBand'
import WhyChooseSection from '@/components/sections/WhyChooseSection'
import Hero from '@/components/sections/Hero'
import ProjectHighlight from '@/components/sections/ProjectHighlight'
import QuoteSection from '@/components/sections/QuoteSection'
import ServiceCards from '@/components/sections/ServiceCards'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CtaBanner from '@/components/sections/CtaBanner'
import { readCmsState } from '@/lib/cms-store'
import { defaultSiteContent, HomeSection } from '@/lib/site-data'

function resolveHomeSections(sections: HomeSection[] | undefined): HomeSection[] {
  if (!sections || sections.length === 0) {
    return defaultSiteContent.pages.home.sections
  }

  return sections
}

export default async function HomePage() {
  const state = await readCmsState()
  const content = state.content
  const home = content.pages.home ?? defaultSiteContent.pages.home
  const narrative = content.pages.home?.narrative ?? defaultSiteContent.pages.home.narrative
  const sections = resolveHomeSections(home.sections)
  const renderedSections: React.ReactNode[] = []
  const enabledTypes = new Set(sections.filter((section) => section.enabled).map((section) => section.type))

  if (enabledTypes.has('hero')) {
    renderedSections.push(<Hero key="hero" hero={content.hero} templateId={state.activeTemplate} />)
  }

  if (enabledTypes.has('trustStrip')) {
    renderedSections.push(
      <BuilderzIntroSection
        key="builderzIntro"
        company={content.company}
        companyStory={content.companyStory}
        block={home.about}
        cta={home.aboutCta}
        hero={content.hero}
        galleryImages={content.galleryImages}
      />
    )
    renderedSections.push(<StatsBand key="statsBand" points={content.trustPoints} />)
  }

  if (enabledTypes.has('process')) {
    renderedSections.push(
      <WhyChooseSection
        key="whyChoose"
        title={content.pages.about.whyTitle}
        reasons={[...content.pages.about.whyPoints, ...content.companyStory.points]}
        galleryImages={content.galleryImages}
        hero={content.hero}
      />
    )
  }

  for (const section of sections) {
    if (!section.enabled) {
      continue
    }

    if (section.type === 'hero' || section.type === 'trustStrip' || section.type === 'process') {
      continue
    }

    if (section.type === 'servicesGrid') {
      renderedSections.push(
        <ServiceCards
          key="servicesGrid"
          eyebrow={home.services.eyebrow}
          title={home.services.title}
          intro={home.services.intro}
          limit={6}
          showOverviewLink
          services={content.services}
          templateId={state.activeTemplate}
          variant={section.variant as 'A' | 'B' | 'C' | undefined}
        />
      )
      continue
    }

    if (section.type === 'projectsGallery') {
      renderedSections.push(
        <ProjectHighlight
          key="projectsGallery"
          images={content.galleryImages}
          templateId={state.activeTemplate}
          block={home.projects}
          variant={section.variant as 'masonry' | 'grid' | 'carousel' | undefined}
        />
      )
      continue
    }

    if (section.type === 'testimonials') {
      renderedSections.push(
        <TestimonialsSection
          key="testimonials"
          items={content.testimonials}
          templateId={state.activeTemplate}
          block={home.testimonials}
          variant={section.variant as 'cards' | 'slider' | undefined}
        />
      )
      continue
    }

    if (section.type === 'ctaBanner') {
      renderedSections.push(
        <CtaBanner
          key="ctaBanner"
          companyStory={content.companyStory}
          block={home.about}
          cta={home.aboutCta}
          variant={section.variant as 'split' | 'centered' | undefined}
        />
      )
    }
  }

  return (
    <>
      {renderedSections}
      <PageNarrativeSection
        block={narrative}
        imageSrc={content.hero.backgroundImage}
        imageAlt={content.company.name}
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} />
    </>
  )
}
