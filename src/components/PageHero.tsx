import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import { withSiteBasePath } from '@/lib/site-paths'

type PageHeroProps = {
  eyebrow?: string
  title: string
  intro: string
  imageSrc: string
  imageAlt: string
  primaryCtaLabel?: string
  primaryCtaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

export default function PageHero({
  eyebrow,
  title,
  intro,
  imageSrc,
  imageAlt,
  primaryCtaLabel,
  primaryCtaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
}: PageHeroProps) {
  return (
    <section className="hero-shell relative">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={withSiteBasePath(imageSrc)}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <Container className="relative py-14 sm:py-18 md:py-22 lg:py-26">
        <div className="max-w-[54rem]">
          {eyebrow ? (
            <ScrollReveal
              as="p"
              className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--site-primary)] sm:text-sm"
            >
              {eyebrow}
            </ScrollReveal>
          ) : null}

          <ScrollReveal
            as="h1"
            delay={80}
            className="mt-4 max-w-[11.5ch] text-balance font-display text-[clamp(1.95rem,5vw,3.45rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-white"
          >
            {title}
          </ScrollReveal>

          <ScrollReveal
            as="p"
            variant="soft"
            delay={140}
            className="mt-5 max-w-3xl text-[0.98rem] leading-relaxed text-white/82 sm:text-base md:text-[1.02rem]"
          >
            {intro}
          </ScrollReveal>

          {primaryCtaLabel && primaryCtaHref ? (
            <ScrollReveal delay={220} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={primaryCtaHref} className="btn-primary">
                {primaryCtaLabel}
              </Link>
              {secondaryCtaLabel && secondaryCtaHref ? (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center rounded-full border border-white/38 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/14"
                >
                  {secondaryCtaLabel}
                </Link>
              ) : null}
            </ScrollReveal>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
