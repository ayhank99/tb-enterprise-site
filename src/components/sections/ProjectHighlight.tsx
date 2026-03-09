import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import SectionHeading from '@/components/SectionHeading'
import { withSiteBasePath } from '@/lib/site-paths'
import { ProjectImage } from '@/lib/site-data'
import { TemplateId } from '@/lib/templates'

type GalleryVariant = 'masonry' | 'grid' | 'carousel'

type ProjectHighlightProps = {
  images: ProjectImage[]
  templateId: TemplateId
  block: {
    eyebrow?: string
    title: string
    intro: string
  }
  variant?: GalleryVariant
}

function ProjectCard({ image, tall = false }: { image: ProjectImage; tall?: boolean }) {
  return (
    <Link
      href={image.href ?? '/galleri'}
      className={`group relative block overflow-hidden rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow)] transition-all duration-500 hover:shadow-[var(--site-card-shadow-hover)] ${tall ? 'h-[390px]' : 'h-[290px]'}`}
    >
      <Image
        src={withSiteBasePath(image.src)}
        alt={image.alt}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-all duration-700 group-hover:scale-110"
      />

      <span className="absolute inset-0 bg-gradient-to-t from-[color:var(--site-dark)]/90 via-[color:var(--site-dark)]/30 to-transparent transition-all duration-500 group-hover:from-[color:var(--site-dark)]/80" />
      <span className="absolute inset-3 rounded-lg border-2 border-[color:var(--site-primary)]/0 transition-all duration-500 group-hover:border-[color:var(--site-primary)]/30" />

      <span className="absolute inset-x-0 bottom-0 p-5 text-white">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--site-primary)]">
          <span className="h-[2px] w-4 bg-[color:var(--site-primary)]" />
          {image.category ?? 'Projekt'}
        </span>
        <span className="mt-2 block text-lg font-bold leading-tight">{image.title ?? image.alt}</span>
      </span>

      <span className="absolute right-4 top-4 translate-x-2 rounded-lg bg-[color:var(--site-primary)] p-2.5 text-[color:var(--site-dark)] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}

export default function ProjectHighlight({ images, templateId, block, variant = 'masonry' }: ProjectHighlightProps) {
  void templateId
  const source = images.slice(0, 8)

  return (
    <section className="bg-[color:var(--site-bg-soft)] section-block">
      <Container>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} align="center" />

        {variant === 'carousel' ? (
          <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4">
            {source.map((image, index) => (
              <ScrollReveal key={image.src} variant="image" delay={index * 90} className="w-[84%] shrink-0 snap-start sm:w-[58%] lg:w-[36%]">
                <ProjectCard image={image} tall={index % 2 === 0} />
              </ScrollReveal>
            ))}
          </div>
        ) : null}

        {variant === 'grid' ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {source.slice(0, 8).map((image, index) => (
              <ScrollReveal key={image.src} variant="image" delay={index * 80}>
                <ProjectCard image={image} />
              </ScrollReveal>
            ))}
          </div>
        ) : null}

        {variant === 'masonry' ? (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {source.map((image, index) => (
              <ScrollReveal key={image.src} as="figure" variant="image" delay={index * 80} className="mb-5 break-inside-avoid">
                <ProjectCard image={image} tall={index % 3 === 0} />
              </ScrollReveal>
            ))}
          </div>
        ) : null}

        <ScrollReveal delay={180} className="mt-12 flex items-center justify-center gap-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--site-muted)]">
            Klik et projekt for detaljer
          </span>
          <Link href="/galleri" className="btn-secondary">
            Gaa til fuldt galleri
          </Link>
        </ScrollReveal>
      </Container>
    </section>
  )
}
