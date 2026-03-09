import Image from 'next/image'
import { ReactNode } from 'react'
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
  'Fleksibel planlaegning',
  'Ansvarlig udfoerelse',
]

const reasonIcons = [
  <svg key="a" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l7 4v6c0 5-3.8 9.7-7 10-3.2-.3-7-5-7-10V6l7-4z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>,
  <svg key="e" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3" />
    <circle cx="12" cy="12" r="9" />
  </svg>,
  <svg key="f" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h18" />
    <path d="M12 3v18" />
  </svg>,
]

function ReasonCard({
  title,
  text,
  icon,
  align,
  delay = 0,
}: {
  title: string
  text: string
  icon: ReactNode
  align: 'left' | 'right'
  delay?: number
}) {
  const reverse = align === 'right'

  return (
    <ScrollReveal
      as="article"
      variant={reverse ? 'right' : 'left'}
      delay={delay}
      className={`flex items-start gap-4 ${reverse ? 'lg:flex-row-reverse lg:text-right' : ''}`}
    >
      <span className="flex h-16 w-16 shrink-0 items-center justify-center bg-[color:var(--site-primary)] text-[color:var(--site-dark)] shadow-[var(--site-card-shadow)]">
        {icon}
      </span>
      <div>
        <h3 className="text-2xl font-bold tracking-[-0.04em] text-[color:var(--site-text)]">{title}</h3>
        <p className="mt-2 text-base leading-relaxed text-[color:var(--site-muted)]">{text}</p>
      </div>
    </ScrollReveal>
  )
}

export default function WhyChooseSection({ title, reasons, galleryImages, hero }: WhyChooseSectionProps) {
  const featureImage = galleryImages[1]?.src ?? hero.backgroundImage
  const entries = reasons.slice(0, 6).map((text, index) => ({
    title: reasonTitles[index],
    text,
    icon: reasonIcons[index],
  }))

  const left = entries.slice(0, 3)
  const right = entries.slice(3, 6)

  return (
    <section className="bg-[color:var(--site-bg-soft)] py-16 md:py-20">
      <Container>
        <SectionHeading eyebrow="Fordele" title={title} align="center" />

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(280px,420px)_1fr] lg:items-start">
          <div className="space-y-10">
            {left.map((entry, index) => (
              <ReasonCard key={entry.title} title={entry.title} text={entry.text} icon={entry.icon} align="left" delay={index * 100} />
            ))}
          </div>

          <ScrollReveal variant="image" delay={120} className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute inset-x-8 bottom-0 h-12 bg-[color:var(--site-primary)]" />
            <div className="relative h-[520px] overflow-hidden rounded-[220px_220px_0_0] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow-hover)]">
              <Image
                src={withSiteBasePath(featureImage)}
                alt={title}
                fill
                sizes="(max-width: 1024px) 80vw, 28vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>

          <div className="space-y-10">
            {right.map((entry, index) => (
              <ReasonCard key={entry.title} title={entry.title} text={entry.text} icon={entry.icon} align="right" delay={index * 100 + 60} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
