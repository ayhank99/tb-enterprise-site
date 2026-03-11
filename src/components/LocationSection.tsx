import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import { SiteContent } from '@/lib/site-data'

type LocationSectionProps = {
  company: SiteContent['company']
}

function LocationMarkerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.88.37 1.74.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.07.33 1.93.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export default function LocationSection({ company }: LocationSectionProps) {
  const mapQuery = encodeURIComponent(`${company.address}`)
  const mapEmbedUrl = `https://maps.google.com/maps?hl=da&q=${mapQuery}&z=16&ie=UTF8&iwloc=B&output=embed`
  const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  return (
    <section className="section-block bg-[color:var(--site-bg-soft)]">
      <Container className="mb-6">
        <ScrollReveal className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">
          <span className="h-[2px] w-10 bg-[color:var(--site-primary)]" />
          Find os
        </ScrollReveal>
      </Container>

      <div className="relative overflow-hidden border-y border-[color:var(--site-border)] bg-white shadow-[var(--site-card-shadow-hover)]">
        <ScrollReveal variant="soft" className="relative h-[320px] sm:h-[420px] lg:h-[540px]">
          <iframe
            title={`Google Maps for ${company.name}`}
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
            allowFullScreen
          />

          <div className="pointer-events-none absolute inset-x-4 top-4 sm:left-6 sm:right-auto">
            <div className="max-w-sm rounded-[1.35rem] border border-white/24 bg-white/94 px-4 py-4 text-[color:var(--site-text)] shadow-[var(--site-card-shadow)] backdrop-blur-sm">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{company.name}</p>
              <div className="mt-3 flex items-start gap-3">
                <span className="mt-0.5 text-[color:var(--site-primary)]">
                  <LocationMarkerIcon />
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{company.address}</p>
                  <div className="flex flex-col gap-1">
                    <a href={company.phoneHref} className="text-sm font-semibold text-[color:var(--site-text)] transition-colors hover:text-[color:var(--site-primary)]">
                      {company.phoneDisplay}
                    </a>
                    <a href={`mailto:${company.email}`} className="text-sm font-semibold text-[color:var(--site-text)] transition-colors hover:text-[color:var(--site-primary)]">
                      {company.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <Container className="-mt-8 relative z-10 sm:-mt-10">
        <div className="grid gap-6 md:grid-cols-3">
          <ScrollReveal variant="soft" className="rounded-[1.5rem] bg-white px-5 py-5 ring-1 ring-[color:var(--site-border)] shadow-[var(--site-card-shadow)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Adresse</p>
            <div className="mt-4 flex items-start gap-3">
              <span className="mt-0.5 text-[color:var(--site-primary)]">
                <LocationMarkerIcon />
              </span>
              <p className="text-sm leading-relaxed text-[color:var(--site-text)]">{company.address}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="soft" delay={80} className="rounded-[1.5rem] bg-white px-5 py-5 ring-1 ring-[color:var(--site-border)] shadow-[var(--site-card-shadow)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Kontakt</p>
            <div className="mt-4 space-y-3">
              <Link href={company.phoneHref} className="flex items-center gap-3 text-sm font-semibold text-[color:var(--site-text)] transition-colors hover:text-[color:var(--site-primary)]">
                <span className="text-[color:var(--site-primary)]">
                  <PhoneIcon />
                </span>
                {company.phoneDisplay}
              </Link>
              <Link href={`mailto:${company.email}`} className="flex items-center gap-3 text-sm font-semibold text-[color:var(--site-text)] transition-colors hover:text-[color:var(--site-primary)]">
                <span className="text-[color:var(--site-primary)]">
                  <MailIcon />
                </span>
                <span className="break-all">{company.email}</span>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="soft" delay={160} className="rounded-[1.5rem] bg-white px-5 py-5 ring-1 ring-[color:var(--site-border)] shadow-[var(--site-card-shadow)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Åbningstid</p>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--site-text)]">{company.openingHours}</p>
            <a href={mapLinkUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center rounded-full bg-[color:var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--site-primary-strong)]">
              Åbn kort
            </a>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
