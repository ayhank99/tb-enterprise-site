import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import ScrollReveal from '@/components/ScrollReveal'
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
      <PageHero
        eyebrow={block.hero.eyebrow}
        title={block.hero.title}
        intro={block.hero.intro}
        imageSrc={content.hero.backgroundImage}
        imageAlt={content.company.name}
        primaryCtaLabel="Ring nu"
        primaryCtaHref={content.company.phoneHref}
        secondaryCtaLabel="Skriv til os"
        secondaryCtaHref={`mailto:${content.company.email}`}
      />

      <section className="bg-[color:var(--site-bg-soft)] py-16 md:py-20">
        <Container>
          <ScrollReveal as="article" variant="soft" className="rounded-[2rem] border border-[color:var(--site-border)] bg-white p-7 text-sm shadow-[var(--site-card-shadow)]">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{block.cardLabels.phone}</p>
                <p className="mt-2 text-lg font-semibold">
                  <Link href={content.company.phoneHref}>{content.company.phoneDisplay}</Link>
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{block.cardLabels.email}</p>
                <p className="mt-2 text-lg font-semibold break-all">
                  <Link href={`mailto:${content.company.email}`}>{content.company.email}</Link>
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{block.cardLabels.address}</p>
                <p className="mt-2">{content.company.address}</p>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{block.cardLabels.openingHours}</p>
                <p className="mt-2">{content.company.openingHours}</p>
              </div>
            </div>
          </ScrollReveal>
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
