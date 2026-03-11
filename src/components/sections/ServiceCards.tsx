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
            return (
              <ScrollReveal key={service.slug} variant="image" delay={index * 90}>
                <Link
                  href={`/ydelser/${service.slug}`}
                  className="group relative block overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel)] shadow-[var(--site-card-shadow)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--site-card-shadow-hover)]"
                >
                  <div className="relative h-64 overflow-hidden sm:h-72">
                    <Image
                      src={withSiteBasePath(service.image)}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--site-dark)]/82 via-[color:var(--site-dark)]/18 to-transparent" />
                    <div className="absolute inset-0 border border-white/0 transition-colors duration-500 group-hover:border-white/18" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <span className="mb-3 block h-[3px] w-16 bg-[color:var(--site-primary)] transition-all duration-500 group-hover:w-24" />
                    <h3 className="text-[1.45rem] font-bold leading-tight">{service.title}</h3>
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
