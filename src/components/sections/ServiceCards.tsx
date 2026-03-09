import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import SectionHeading from '@/components/SectionHeading'
import { withSiteBasePath } from '@/lib/site-paths'
import { Service } from '@/lib/site-data'
import { TemplateId } from '@/lib/templates'

type ServiceGridVariant = 'A' | 'B' | 'C'

type ServiceCardsProps = {
  title: string
  intro: string
  eyebrow?: string
  limit?: number
  showOverviewLink?: boolean
  services: Service[]
  templateId: TemplateId
  variant?: ServiceGridVariant
}

export default function ServiceCards({
  title,
  intro,
  eyebrow,
  limit,
  showOverviewLink = false,
  services,
  templateId,
  variant: _variant = 'A',
}: ServiceCardsProps) {
  void templateId
  void _variant
  const visibleServices = typeof limit === 'number' ? services.slice(0, limit) : services

  return (
    <section className="bg-white section-block">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {visibleServices.map((service, index) => {
            const isEven = index % 2 === 0

            return (
              <ScrollReveal key={service.slug} variant="image" delay={index * 90}>
                <Link
                  href={`/ydelser/${service.slug}`}
                  className="group relative block overflow-hidden rounded-lg shadow-[var(--site-card-shadow)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--site-card-shadow-hover)]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={withSiteBasePath(service.image)}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-[color:var(--site-dark)]/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white text-white">
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div
                    className="px-6 py-4 text-center transition-colors duration-300"
                    style={{
                      background: isEven ? 'var(--site-primary)' : 'var(--site-dark)',
                      color: isEven ? 'var(--site-dark)' : 'white',
                    }}
                  >
                    <h3 className="text-base font-bold">{service.title}</h3>
                  </div>
                </Link>
              </ScrollReveal>
            )
          })}
        </div>

        {showOverviewLink ? (
          <ScrollReveal delay={180} className="mt-12 text-center">
            <Link href="/ydelser" className="btn-secondary">
              Se alle ydelser
            </Link>
          </ScrollReveal>
        ) : null}
      </Container>
    </section>
  )
}
