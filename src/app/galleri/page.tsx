import type { Metadata } from 'next'
import Image from 'next/image'
import PageHero from '@/components/PageHero'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import ScrollReveal from '@/components/ScrollReveal'
import Container from '@/components/Container'
import QuoteSection from '@/components/sections/QuoteSection'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Galleri',
  description: 'Udvalgte projekter inden for belægning, anlæg, træarbejde, vedligehold og opgradering af udearealer.',
  alternates: {
    canonical: withSiteBasePath('/galleri'),
  },
}

export default async function GalleryPage() {
  const state = await readCmsState()
  const content = state.content
  const block = content.pages.gallery ?? defaultSiteContent.pages.gallery
  const narrative = content.pages.gallery?.narrative ?? defaultSiteContent.pages.gallery.narrative
  const heroImage = content.galleryImages[0]?.src ?? content.hero.backgroundImage
  const heroAlt = content.galleryImages[0]?.alt ?? content.company.name

  return (
    <>
      <PageHero
        eyebrow={block.eyebrow}
        title={block.title}
        intro={block.intro}
        imageSrc={heroImage}
        imageAlt={heroAlt}
        primaryCtaLabel="Kontakt os"
        primaryCtaHref="/kontakt#tilbudsformular"
        secondaryCtaLabel="Få et tilbud"
        secondaryCtaHref="/kontakt#tilbudsformular"
      />

      <section className="section-soft py-16 md:py-20">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.galleryImages.map((image, index) => (
              <ScrollReveal key={image.src} as="figure" variant="image" delay={index * 60} className="group overflow-hidden rounded-[1.7rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow)]">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={withSiteBasePath(image.src)}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/18 to-transparent opacity-80" />
                </div>
                <figcaption className="space-y-2 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--site-primary)]">{image.category ?? 'Projekt'}</p>
                  <p className="text-base font-semibold text-[color:var(--site-text)]">{image.title ?? image.alt}</p>
                  <p className="text-sm text-[color:var(--site-muted)]">{image.alt}</p>
                </figcaption>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <PageNarrativeSection
        block={narrative}
        imageSrc={heroImage}
        imageAlt={heroAlt}
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}
