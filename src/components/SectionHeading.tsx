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
        className={`mb-4 flex items-center gap-3 text-[0.8rem] font-bold tracking-[0.04em] text-[color:var(--site-primary)] sm:text-[0.84rem] ${isCenter ? 'justify-center' : ''}`}
        >
          <span className="h-[2px] w-8 bg-[color:var(--site-primary)]" />
          {eyebrow}
          {!isCenter ? null : <span className="h-[2px] w-8 bg-[color:var(--site-primary)]" />}
        </ScrollReveal>
      ) : null}

      <ScrollReveal
        as="h2"
        delay={80}
        className="font-display text-[clamp(1.8rem,4.25vw,3rem)] font-extrabold leading-[0.99] tracking-[-0.045em] text-[color:var(--site-text)]"
      >
        {title}
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <div className={`mt-4 h-[3px] bg-[color:var(--site-primary)]/95 ${isCenter ? 'mx-auto w-24' : 'w-20'}`} />
      </ScrollReveal>

      {intro ? (
        <ScrollReveal as="p" variant="soft" delay={160} className="mt-5 text-[0.98rem] leading-relaxed text-[color:var(--site-muted)] sm:text-base md:text-[1.02rem]">
          {intro}
        </ScrollReveal>
      ) : null}
    </div>
  )
}
