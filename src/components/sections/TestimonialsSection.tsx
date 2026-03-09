import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import SectionHeading from '@/components/SectionHeading'
import { Testimonial } from '@/lib/site-data'
import { TemplateId } from '@/lib/templates'

type TestimonialVariant = 'cards' | 'slider'

type TestimonialsSectionProps = {
  items: Testimonial[]
  templateId: TemplateId
  block: {
    eyebrow?: string
    title: string
    intro: string
  }
  variant?: TestimonialVariant
}

export default function TestimonialsSection({ items, templateId, block, variant = 'cards' }: TestimonialsSectionProps) {
  void templateId

  const cardClass =
    'group relative overflow-hidden rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-7 shadow-[var(--site-card-shadow)] transition-all duration-400 hover:-translate-y-1 hover:shadow-[var(--site-card-shadow-hover)]'

  return (
    <section className="relative overflow-hidden bg-[color:var(--site-panel)] section-block">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-30" style={{ background: 'radial-gradient(ellipse, var(--site-primary-glow), transparent 70%)' }} />

      <Container className="relative">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} align="center" />

        {variant === 'cards' ? (
          <div className="grid gap-[var(--grid-gap)] md:grid-cols-3">
            {items.map((item, index) => (
              <ScrollReveal key={item.name} as="figure" variant="zoom" delay={index * 90} className={cardClass}>
                <div className="absolute left-0 right-0 top-0 h-[3px] bg-[color:var(--site-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--site-primary)]/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[color:var(--site-primary)]" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                  </svg>
                </div>

                <blockquote className="text-sm leading-relaxed text-[color:var(--site-muted)]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-[color:var(--site-border)] pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-sm font-bold text-[color:var(--site-dark)]">
                    {item.name.charAt(0)}
                  </span>
                  <span className="text-sm font-bold text-[color:var(--site-text)]">{item.name}</span>
                </figcaption>
              </ScrollReveal>
            ))}
          </div>
        ) : null}

        {variant === 'slider' ? (
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {items.map((item, index) => (
              <ScrollReveal
                key={item.name}
                as="figure"
                variant="zoom"
                delay={index * 90}
                className={`${cardClass} w-[86%] shrink-0 snap-start sm:w-[60%] lg:w-[35%]`}
              >
                <div className="absolute left-0 right-0 top-0 h-[3px] bg-[color:var(--site-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--site-primary)]/10">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-[color:var(--site-primary)]" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
                  </svg>
                </div>

                <blockquote className="text-sm leading-relaxed text-[color:var(--site-muted)]">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-[color:var(--site-border)] pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-sm font-bold text-[color:var(--site-dark)]">
                    {item.name.charAt(0)}
                  </span>
                  <span className="text-sm font-bold text-[color:var(--site-text)]">{item.name}</span>
                </figcaption>
              </ScrollReveal>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
