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
    <section className="bg-[color:var(--site-panel)] py-16 md:py-20">
      <Container>
        <div className={`grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch ${reverse ? 'lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1' : ''}`}>
          <ScrollReveal as="article" variant={reverse ? 'right' : 'left'} className="relative overflow-hidden rounded-[1.75rem] bg-[color:var(--site-dark)] text-[color:var(--site-on-dark)] shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[color:var(--site-primary)] via-[#f7b731] to-[color:var(--site-primary)]" />
            <div className="pointer-events-none absolute -right-16 -top-12 h-40 w-40 rounded-full opacity-20" style={{ background: 'var(--site-primary-glow)' }} />

            <div className="relative p-7 sm:p-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--site-primary)]">{block.eyebrow}</p>
              <h2 className="mt-4 font-display text-3xl leading-tight tracking-[-0.05em] md:text-4xl">{block.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--site-on-dark-soft)]">{block.intro}</p>

              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[color:var(--site-on-dark-soft)]">
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {block.highlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-medium text-white">
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/kontakt#tilbudsformular" className="btn-primary">
                  Faa et tilbud
                </Link>
                <Link
                  href="/galleri"
                  className="inline-flex items-center rounded-lg border-2 border-white/15 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
                >
                  Se referencer
                </Link>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="image" delay={120} className="relative min-h-[320px] overflow-hidden rounded-[1.75rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow-hover)]">
            <Image src={resolvedImageSrc} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 46vw" className="object-cover" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[color:var(--site-dark)]/55 via-[color:var(--site-dark)]/10 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 z-20 rounded-2xl border border-white/15 bg-[color:var(--site-dark)]/82 px-5 py-4 text-white backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">TB Entreprise</p>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--site-on-dark-soft)]">
                Professionelle loesninger inden for belaegning, anlaeg, drift og mindre entrepriser i Storkoebenhavn.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
