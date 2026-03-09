import ScrollReveal from '@/components/ScrollReveal'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  intro?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({ eyebrow, title, intro, align = 'left' }: SectionHeadingProps) {
  const isCenter = align === 'center'

  return (
    <div className={`mb-10 max-w-3xl ${isCenter ? 'mx-auto text-center' : ''}`}>
      {eyebrow ? (
        <ScrollReveal
          as="p"
          variant="soft"
          className={`mb-4 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-[color:var(--site-primary)] ${isCenter ? 'justify-center' : ''}`}
        >
          <span className="h-[2px] w-8 bg-[color:var(--site-primary)]" />
          {eyebrow}
          <span className="h-[2px] w-8 bg-[color:var(--site-primary)]" />
        </ScrollReveal>
      ) : null}

      <ScrollReveal
        as="h2"
        delay={80}
        className="font-display text-4xl font-extrabold leading-[0.98] tracking-[-0.06em] text-[color:var(--site-text)] md:text-5xl lg:text-[4rem]"
      >
        {title}
      </ScrollReveal>

      {intro ? (
        <ScrollReveal as="p" variant="soft" delay={160} className="mt-5 text-lg leading-relaxed text-[color:var(--site-muted)]">
          {intro}
        </ScrollReveal>
      ) : null}
    </div>
  )
}
