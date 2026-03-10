import Image from 'next/image'
import Link from 'next/link'
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
        ) : (
          <Image src={backgroundImage} alt="Professionelt arbejde" fill priority className="object-cover" sizes="100vw" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(94deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.58) 40%, rgba(255,255,255,0.08) 100%)' }}
        />
      </div>

      <Container className="relative py-16 sm:py-20 md:py-28 lg:py-40">
        <div className="max-w-[60rem]">
          <p className="animate-fade-in-up text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--site-primary-strong)] sm:text-sm md:text-base">
            {hero.eyebrow}
          </p>

          <h1 className="animate-fade-in-up animate-delay-100 mt-4 max-w-[12ch] font-display text-[clamp(1.55rem,8vw,2.9rem)] font-extrabold leading-[0.94] tracking-[-0.06em] text-[color:var(--site-dark)] sm:mt-5 sm:max-w-[13ch] md:max-w-[15ch]">
            {hero.title}
          </h1>

          <p className="animate-fade-in-up animate-delay-200 mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--site-muted)] sm:mt-6 sm:text-lg md:mt-7 md:text-xl">
            {hero.text}
          </p>

          <div className="animate-fade-in-up animate-delay-300 mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              href={hero.primaryCtaHref}
              className="inline-flex w-full items-center justify-center bg-[color:var(--site-primary)] px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--site-dark)] transition-all duration-300 hover:bg-[color:var(--site-primary-strong)] sm:w-auto sm:px-8"
            >
              {hero.primaryCtaLabel}
            </Link>

            <Link
              href={hero.secondaryCtaHref}
              className="inline-flex w-full items-center justify-center border-2 border-[color:var(--site-dark)] px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--site-dark)] transition-all duration-300 hover:bg-[color:var(--site-dark)] hover:text-white sm:w-auto sm:px-8"
            >
              {hero.secondaryCtaLabel}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}
