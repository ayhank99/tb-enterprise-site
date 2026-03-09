import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import SectionHeading from '@/components/SectionHeading'
import { withSiteBasePath } from '@/lib/site-paths'
import { ProjectImage, SiteContent } from '@/lib/site-data'

type BuilderzIntroSectionProps = {
  company: SiteContent['company']
  companyStory: SiteContent['companyStory']
  block: {
    eyebrow?: string
    title: string
    intro: string
  }
  cta: {
    primaryLabel: string
    secondaryLabel: string
  }
  hero: SiteContent['hero']
  galleryImages: ProjectImage[]
}

export default function BuilderzIntroSection({
  company,
  companyStory,
  block,
  cta,
  hero,
  galleryImages,
}: BuilderzIntroSectionProps) {
  const featureImage = galleryImages[0]?.src ?? hero.backgroundImage
  const leadPoints = companyStory.points.slice(0, 2)

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_320px]">
          <ScrollReveal as="div" variant="left" className="bg-[color:var(--site-dark)] text-white">
            <Container className="flex min-h-[90px] items-center py-6">
              <p className="max-w-4xl text-lg font-bold leading-tight md:text-2xl">
                Vi er klar til at levere holdbare løsninger med fokus på kvalitet, finish og tydelige aftaler.
              </p>
            </Container>
          </ScrollReveal>

          <ScrollReveal as="div" variant="right" delay={120}>
            <Link
              href="/kontakt"
              className="relative flex items-center justify-center gap-3 bg-[color:var(--site-primary)] px-8 py-6 text-lg font-bold text-[color:var(--site-dark)] transition-opacity hover:opacity-90 md:text-2xl"
            >
              <span
                className="absolute left-[-3.5rem] top-0 hidden h-full w-16 bg-[color:var(--site-primary)] lg:block"
                style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
              />
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              <span>Kontakt os</span>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[color:var(--site-bg-soft)] py-16 md:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <ScrollReveal variant="image" className="relative mx-auto w-full max-w-[640px]">
            <div className="absolute inset-x-0 bottom-[-1.5rem] top-[1.5rem] rotate-[-6deg] bg-[color:var(--site-primary)]/35" />
            <div className="absolute inset-x-5 bottom-5 top-[-1.25rem] rotate-[4deg] border-[14px] border-[color:var(--site-primary)]" />

            <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow-hover)]">
              <Image
                src={withSiteBasePath(featureImage)}
                alt={company.name}
                fill
                sizes="(max-width: 1024px) 100vw, 46vw"
                className="object-cover"
              />
            </div>

            <Link
              href="/om-os"
              aria-label="Læs mere om virksomheden"
              className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-[color:var(--site-dark)] shadow-2xl transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                <path d="M8 5l10 7-10 7V5z" />
              </svg>
            </Link>
          </ScrollReveal>

          <div>
            <SectionHeading eyebrow={block.eyebrow ?? 'Velkommen'} title={block.title} intro={companyStory.intro || block.intro} />

            <div className="space-y-5 text-base leading-relaxed text-[color:var(--site-muted)]">
              {leadPoints.map((point) => (
                <ScrollReveal key={point} as="p" variant="soft">
                  {point}
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={180} className="mt-8 flex flex-wrap gap-4">
              <Link href="/kontakt#tilbudsformular" className="btn-primary">
                {cta.primaryLabel}
              </Link>
              <Link href="/om-os" className="btn-secondary">
                {cta.secondaryLabel}
              </Link>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </>
  )
}
