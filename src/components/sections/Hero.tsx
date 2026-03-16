'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import Container from '@/components/Container'
import { withSiteBasePath } from '@/lib/site-paths'
import { SiteContent } from '@/lib/site-data'
import { TemplateId } from '@/lib/templates'

type HeroProps = {
  hero: SiteContent['hero']
  templateId: TemplateId
}

function getVideoMimeType(url: string) {
  const cleanUrl = url.split('?')[0]?.toLowerCase() ?? ''

  if (cleanUrl.endsWith('.webm')) return 'video/webm'
  if (cleanUrl.endsWith('.mov')) return 'video/quicktime'
  if (cleanUrl.endsWith('.m4v')) return 'video/mp4'

  return 'video/mp4'
}

export default function Hero({ hero }: HeroProps) {
  const useVideo = hero.backgroundType === 'video' && hero.backgroundVideo.trim().length > 0
  const backgroundImage = withSiteBasePath(hero.backgroundImage)
  const backgroundVideo = withSiteBasePath(hero.backgroundVideo)
  const slideshowImages = useMemo(() => {
    const unique = new Set<string>()
    const sources = [hero.backgroundImage, ...(hero.backgroundSlideshow ?? [])]

    return sources
      .map((source) => source.trim())
      .filter((source) => source.length > 0)
      .filter((source) => {
        if (unique.has(source)) return false
        unique.add(source)
        return true
      })
      .map((source) => withSiteBasePath(source))
  }, [hero.backgroundImage, hero.backgroundSlideshow])
  const showSlideshow = !useVideo && slideshowImages.length > 1
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    if (!showSlideshow) {
      setActiveSlide(0)
      return
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideshowImages.length)
    }, 5200)

    return () => window.clearInterval(timer)
  }, [showSlideshow, slideshowImages.length])

  return (
    <section className="hero-shell relative">
      <div className="absolute inset-0 overflow-hidden">
        {useVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={backgroundImage || undefined}
            className="h-full w-full object-cover"
          >
            <source src={backgroundVideo} type={getVideoMimeType(hero.backgroundVideo)} />
          </video>
        ) : showSlideshow ? (
          slideshowImages.map((slideImage, index) => (
            <div
              key={slideImage}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
                index === activeSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={slideImage}
                alt="Professionelt arbejde"
                fill
                priority={index === 0}
                sizes="100vw"
                className={`object-cover transition-transform duration-[6200ms] ease-out ${
                  index === activeSlide ? 'scale-100' : 'scale-[1.05]'
                }`}
              />
            </div>
          ))
        ) : (
          <Image src={backgroundImage} alt="Professionelt arbejde" fill priority className="object-cover" sizes="100vw" />
        )}
        <div className="hero-overlay absolute inset-0" />
        {showSlideshow ? (
          <div className="pointer-events-none absolute bottom-5 left-1/2 z-[1] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/16 bg-black/14 px-3 py-2 backdrop-blur-sm">
            {slideshowImages.map((slideImage, index) => (
              <span
                key={`${slideImage}-indicator`}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  index === activeSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/45'
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>

      <Container className="relative z-[2] py-14 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-[54rem]">
          <p className="animate-fade-in-up text-[0.76rem] font-bold uppercase tracking-[0.14em] text-[color:var(--site-primary)] sm:text-xs md:text-sm">
            {hero.eyebrow}
          </p>

          <h1 className="animate-fade-in-up animate-delay-100 mt-4 max-w-[10ch] font-display text-[clamp(1.65rem,4.3vw,3rem)] font-extrabold leading-[0.96] tracking-[-0.05em] text-white sm:mt-5 sm:max-w-[10.75ch] md:max-w-[11.5ch]">
            {hero.title}
          </h1>

          <p className="animate-fade-in-up animate-delay-200 mt-5 max-w-[34rem] text-[0.96rem] leading-relaxed text-white/82 sm:mt-6 sm:text-[0.98rem] md:mt-7 md:text-base">
            {hero.text}
          </p>

          <div className="animate-fade-in-up animate-delay-300 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href={hero.primaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--site-primary)] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[color:var(--site-primary-strong)] sm:w-auto sm:px-8"
            >
              {hero.primaryCtaLabel}
            </Link>

            <Link
              href={hero.secondaryCtaHref}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/45 bg-white/8 px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-white/14 sm:w-auto sm:px-8"
            >
              {hero.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
