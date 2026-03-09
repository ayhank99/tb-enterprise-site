import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import QuoteSection from '@/components/sections/QuoteSection'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontakt TB Entreprise for besigtigelse og et uforpligtende tilbud på belægning, vedligehold og mindre entrepriser.',
  alternates: {
    canonical: withSiteBasePath('/kontakt'),
  },
}

export default async function ContactPage() {
  const state = await readCmsState()
  const content = state.content
  const block = content.pages.contact ?? defaultSiteContent.pages.contact
  const narrative = content.pages.contact?.narrative ?? defaultSiteContent.pages.contact.narrative

  return (
    <>
      <section className="hero-shell py-20">
        <Container className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="section-eyebrow">{block.hero.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl">{block.hero.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[color:var(--site-on-dark-soft)]">{block.hero.intro}</p>
          </div>

          <div className="rounded-3xl border p-7 text-sm" style={{ borderColor: 'var(--site-on-dark-border)', background: 'var(--site-dark-overlay)' }}>
            <p className="text-[color:var(--site-on-dark-soft)]">{block.cardLabels.phone}</p>
            <p className="mt-1 text-lg font-semibold">
              <Link href={content.company.phoneHref}>{content.company.phoneDisplay}</Link>
            </p>

            <p className="mt-6 text-[color:var(--site-on-dark-soft)]">{block.cardLabels.email}</p>
            <p className="mt-1 text-lg font-semibold">
              <Link href={`mailto:${content.company.email}`}>{content.company.email}</Link>
            </p>

            <p className="mt-6 text-[color:var(--site-on-dark-soft)]">{block.cardLabels.address}</p>
            <p className="mt-1">{content.company.address}</p>

            <p className="mt-6 text-[color:var(--site-on-dark-soft)]">{block.cardLabels.openingHours}</p>
            <p className="mt-1">{content.company.openingHours}</p>
          </div>
        </Container>
      </section>

      <PageNarrativeSection
        block={narrative}
        imageSrc={content.hero.backgroundImage}
        imageAlt={content.company.name}
        reverse
      />
      <QuoteSection company={content.company} quoteForm={content.quoteForm} templateId={state.activeTemplate} />
    </>
  )
}

