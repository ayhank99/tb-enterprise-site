import type { Metadata } from 'next'
import Image from 'next/image'
import Container from '@/components/Container'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import SectionHeading from '@/components/SectionHeading'
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

  return (
    <>
      <section className="section-soft py-20">
        <Container>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.galleryImages.map((image) => (
              <figure key={image.src} className="group overflow-hidden rounded-md border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow)]">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={withSiteBasePath(image.src)}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[18%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-3 rounded-sm border border-white/30 opacity-0 transition duration-500 group-hover:opacity-100" />
                </div>
                <figcaption className="space-y-2 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--site-muted)]">{image.category ?? 'Projekt'}</p>
                  <p className="text-base font-semibold text-[color:var(--site-text)]">{image.title ?? image.alt}</p>
                  <p className="text-sm text-[color:var(--site-muted)]">{image.alt}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>
      <PageNarrativeSection
        block={narrative}
        imageSrc={content.galleryImages[0]?.src ?? content.hero.backgroundImage}
        imageAlt={content.galleryImages[0]?.alt ?? content.company.name}
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}

