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

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
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
  const mapQuery = encodeURIComponent(`${company.name}, ${company.address}`)
  const mapEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`
  const mapLinkUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  return (
    <section className="relative overflow-hidden bg-[color:var(--site-bg-soft)] py-16 md:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10,22,40,0.25) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      />

      <Container className="relative">
        <ScrollReveal className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary-strong)]">
          <span className="h-[2px] w-10 bg-[color:var(--site-primary)]" />
          Find os
        </ScrollReveal>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <ScrollReveal variant="image" className="overflow-hidden rounded-[1.6rem] border border-[color:var(--site-border)] bg-white shadow-[var(--site-card-shadow-hover)]">
            <div className="flex flex-col items-start gap-3 border-b border-[color:var(--site-border)] bg-[color:var(--site-dark)] px-5 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Google Maps</p>
                <h2 className="mt-1 text-xl font-bold">Besøg os på adressen</h2>
              </div>
              <a
                href={mapLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-lg bg-[color:var(--site-primary)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--site-dark)] transition-all duration-300 hover:bg-[color:var(--site-primary-strong)]"
              >
                Åbn kort
              </a>
            </div>

            <div className="relative h-[300px] bg-[color:var(--site-dark)] sm:h-[420px]">
              <iframe
                title={`Google Maps for ${company.name}`}
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
                allowFullScreen
              />
            </div>
          </ScrollReveal>

          <ScrollReveal as="aside" variant="right" delay={120} className="relative overflow-hidden rounded-[1.6rem] bg-[color:var(--site-dark)] text-[color:var(--site-on-dark)] shadow-2xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[color:var(--site-primary)] via-[#f7b731] to-[color:var(--site-primary)]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20" style={{ background: 'var(--site-primary-glow)' }} />

            <div className="relative p-7 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[color:var(--site-primary)]">TB Entreprise</p>
              <h3 className="mt-3 font-display text-3xl leading-tight tracking-[-0.04em]">
                Klar adresse, nem adgang og hurtig kontakt.
              </h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--site-on-dark-soft)]">
                Brug kortet til at finde os direkte på Google Maps. Har du en opgave, kan du ringe eller skrive, så vender vi hurtigt tilbage.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[color:var(--site-primary)]">
                      <LocationMarkerIcon />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--site-primary)]">Adresse</p>
                      <p className="mt-1 text-sm font-semibold text-white">{company.address}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[color:var(--site-primary)]">
                      <ClockIcon />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--site-primary)]">Åbningstid</p>
                      <p className="mt-1 text-sm font-semibold text-white">{company.openingHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link
                  href={company.phoneHref}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[color:var(--site-primary)] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--site-dark)] transition-all duration-300 hover:bg-[color:var(--site-primary-strong)]"
                >
                  <PhoneIcon />
                  Ring nu
                </Link>
                <Link
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
                >
                  <MailIcon />
                  Skriv mail
                </Link>
              </div>

              <a
                href={mapLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--site-primary)] transition-colors duration-200 hover:text-white"
              >
                Få rutevejledning på Google Maps
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 13l6-6" />
                  <path d="M7 7h6v6" />
                </svg>
              </a>
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
