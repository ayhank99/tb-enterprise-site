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
  const leadPoints = companyStory.points.slice(0, 3)

  return (
    <>
      <section className="bg-[color:var(--site-bg-soft)] py-5 sm:py-6">
        <Container>
          <ScrollReveal className="rounded-[2rem] border border-[color:var(--site-border)] bg-white px-5 py-6 shadow-[var(--site-card-shadow)] sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Professionel samarbejdspartner</p>
                <p className="mt-3 text-lg font-semibold leading-tight text-[color:var(--site-text)] sm:text-[1.45rem]">
                  Vi leverer holdbare løsninger med fokus på klare aftaler, god kommunikation og pæn aflevering.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/kontakt#tilbudsformular" className="btn-primary">
                  {cta.primaryLabel}
                </Link>
                <Link href={company.phoneHref} className="btn-secondary">
                  Ring direkte
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      <section className="section-block bg-[color:var(--site-bg)]">
        <Container className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <ScrollReveal variant="image" className="relative overflow-hidden rounded-[2.2rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow-hover)]">
            <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[540px]">
              <Image
                src={withSiteBasePath(featureImage)}
                alt={company.name}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--site-dark-overlay)] via-[color:var(--site-dark-overlay)]/40 to-transparent" />
            </div>

            <div className="absolute inset-x-5 bottom-5 rounded-[1.6rem] border border-white/18 bg-[color:var(--site-dark-overlay)]/90 px-5 py-4 text-white backdrop-blur-sm sm:inset-x-7 sm:bottom-7 sm:px-6 sm:py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{company.name}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/82">
                Belægning, anlæg, vedligehold og mindre entrepriser udført med ordentlig planlægning og stabil kvalitet.
              </p>
            </div>
          </ScrollReveal>

          <div>
            <SectionHeading eyebrow={block.eyebrow ?? 'Velkommen'} title={block.title} intro={companyStory.intro || block.intro} />

            <div className="mt-8 grid gap-4">
              {leadPoints.map((point, index) => (
                <ScrollReveal
                  key={point}
                  variant="soft"
                  delay={index * 80}
                  className="rounded-[1.4rem] border border-[color:var(--site-border)] bg-white px-5 py-4 shadow-[var(--site-card-shadow)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color:var(--site-primary-soft)] text-[color:var(--site-primary)]">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <p className="text-sm leading-relaxed text-[color:var(--site-muted)] sm:text-[0.98rem]">{point}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={180} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
