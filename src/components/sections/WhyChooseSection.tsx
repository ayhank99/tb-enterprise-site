import Image from 'next/image'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import SectionHeading from '@/components/SectionHeading'
import { withSiteBasePath } from '@/lib/site-paths'
import { ProjectImage, SiteContent } from '@/lib/site-data'

type WhyChooseSectionProps = {
  title: string
  reasons: string[]
  galleryImages: ProjectImage[]
  hero: SiteContent['hero']
}

const reasonTitles = [
  'Tydelige aftaler',
  'Stabil kvalitet',
  'Professionel kommunikation',
  'Ordentlig aflevering',
  'Fleksibel planlægning',
  'Ansvarlig udførelse',
]

const reasonIcons = [
  <svg key="a" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l7 4v6c0 5-3.8 9.7-7 10-3.2-.3-7-5-7-10V6l7-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>,
  <svg key="e" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="12" r="9" />
  </svg>,
  <svg key="f" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18" />
    <path d="M12 3v18" />
  </svg>,
]

export default function WhyChooseSection({ title, reasons, galleryImages, hero }: WhyChooseSectionProps) {
  const featureImage = galleryImages[1]?.src ?? hero.backgroundImage
  const entries = reasons.slice(0, 6).map((text, index) => ({
    title: reasonTitles[index] ?? 'Fordel',
    text,
    icon: reasonIcons[index] ?? reasonIcons[0],
  }))

  return (
    <section className="section-block bg-[color:var(--site-bg-soft)]">
      <Container className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <SectionHeading eyebrow="Fordele" title={title} intro="Vi arbejder med tydelig planlægning, ordentlig koordinering og et kvalitetsniveau, der holder i praksis." />

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {entries.map((entry, index) => (
              <ScrollReveal
                key={entry.title}
                variant={index % 2 === 0 ? 'left' : 'right'}
                delay={index * 70}
                className="rounded-[1.5rem] border border-[color:var(--site-border)] bg-white px-5 py-5 shadow-[var(--site-card-shadow)]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--site-primary-soft)] text-[color:var(--site-primary)]">
                  {entry.icon}
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-[-0.04em] text-[color:var(--site-text)]">{entry.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--site-muted)]">{entry.text}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal variant="image" delay={120} className="overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-white shadow-[var(--site-card-shadow-hover)]">
          <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[540px]">
            <Image
              src={withSiteBasePath(featureImage)}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 44vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--site-dark-overlay)]/48 via-transparent to-transparent" />
          </div>
          <div className="border-t border-[color:var(--site-border)] bg-white px-6 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--site-primary)]">TB Entreprise</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--site-muted)]">
              Vi kombinerer faglig udførelse med en rolig proces, så projektet bliver nemmere at overskue for både private og erhverv.
            </p>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
