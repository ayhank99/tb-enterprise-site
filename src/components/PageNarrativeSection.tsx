import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import { withSiteBasePath } from '@/lib/site-paths'
import { NarrativeContent } from '@/lib/site-data'

type PageNarrativeSectionProps = {
  block: NarrativeContent
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}

export default function PageNarrativeSection({
  block,
  imageSrc,
  imageAlt,
  reverse = false,
}: PageNarrativeSectionProps) {
  const resolvedImageSrc = withSiteBasePath(imageSrc)

  return (
    <section className="section-block bg-[color:var(--site-panel)]">
      <Container>
        <div className={`grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>
          <ScrollReveal
            as="article"
            variant={reverse ? 'right' : 'left'}
            className="overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-white shadow-[var(--site-card-shadow-hover)]"
          >
            <div className="h-1 bg-[color:var(--site-primary)]" />

            <div className="p-7 sm:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{block.eyebrow}</p>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3.9vw,2.85rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[color:var(--site-text)]">
                {block.title}
              </h2>
              <p className="mt-5 max-w-2xl text-[0.98rem] leading-relaxed text-[color:var(--site-muted)] sm:text-base">{block.intro}</p>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[color:var(--site-muted)]">
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {block.highlights.map((item) => (
                  <div key={item} className="rounded-[1.2rem] bg-[color:var(--site-bg-soft)] px-4 py-4 text-sm font-medium text-[color:var(--site-text)] ring-1 ring-[color:var(--site-border)]">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/kontakt#tilbudsformular" className="btn-primary">
                  Få et tilbud
                </Link>
                <Link href="/galleri" className="btn-secondary">
                  Se referencer
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal
            variant="image"
            delay={120}
            className="relative min-h-[320px] overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow-hover)]"
          >
            <Image src={resolvedImageSrc} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 46vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--site-dark-overlay)]/76 via-[color:var(--site-dark-overlay)]/28 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-[1.4rem] border border-white/14 bg-[color:var(--site-dark-overlay)]/82 px-5 py-4 text-white shadow-[0_30px_65px_-36px_rgba(15,23,42,0.9)] backdrop-blur-md">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">TB Entreprise</p>
              <p className="mt-2 text-sm leading-relaxed text-white/88">
                Professionelle løsninger inden for belægning, anlæg, drift og mindre entrepriser i Storkøbenhavn.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
