import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import { getCompanyLogoPath } from '@/lib/logo-utils'
import { withSiteBasePath } from '@/lib/site-paths'
import { NavItem, SiteContent } from '@/lib/site-data'

type FooterProps = {
  company: SiteContent['company']
  navItems: NavItem[]
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--site-primary)]">
      {children}
    </h3>
  )
}

export default function Footer({ company, navItems }: FooterProps) {
  const serviceItems = navItems.find((item) => item.href === '/ydelser')?.children ?? []
  const logoSrc = withSiteBasePath(getCompanyLogoPath(company, 'light'))

  return (
    <footer className="relative overflow-hidden border-t border-[color:var(--site-border)] bg-[color:var(--site-bg-soft)]">
      <Container className="py-12 md:py-16">
        <div className="mb-10 overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-white shadow-[var(--site-card-shadow)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="px-6 py-8 sm:px-8 sm:py-9">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Klar til næste skridt?</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight tracking-[-0.05em] text-[color:var(--site-text)]">
                Få et tilbud på belægning, anlæg, vedligehold eller mindre entrepriser.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[color:var(--site-muted)]">
                Vi hjælper både private, boligforeninger og erhverv med stabile løsninger, tydelig dialog og en ordentlig aflevering.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-3 bg-[color:var(--site-bg)] px-6 py-8 sm:px-8 sm:py-9">
              <Link href="/kontakt#tilbudsformular" className="btn-primary">
                Indhent tilbud
              </Link>
              <Link href={company.phoneHref} className="btn-secondary">
                Ring {company.phoneDisplay}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
          <div>
            <div className="relative h-14 w-[220px] max-w-full sm:h-16 sm:w-[280px]">
              <Image
                src={logoSrc}
                alt={`${company.name} logo`}
                fill
                sizes="280px"
                className="object-contain object-left"
              />
            </div>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-[color:var(--site-muted)]">
              Professionel belægning, haveservice, anlæg og mindre entrepriser udført med fokus på kvalitet, planlægning og god kundekontakt.
            </p>

            <div className="mt-6 space-y-3 text-sm text-[color:var(--site-text)]">
              <p>{company.address}</p>
              <Link href={company.phoneHref} className="block font-semibold transition-colors hover:text-[color:var(--site-primary)]">
                {company.phoneDisplay}
              </Link>
              <Link href={`mailto:${company.email}`} className="block font-semibold transition-colors hover:text-[color:var(--site-primary)]">
                {company.email}
              </Link>
              <p>{company.openingHours}</p>
            </div>
          </div>

          <div>
            <FooterHeading>Ydelser</FooterHeading>
            <ul className="mt-5 space-y-3 text-sm text-[color:var(--site-muted)]">
              {serviceItems.length > 0 ? (
                serviceItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-[color:var(--site-primary)]">
                      {item.label}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/ydelser" className="transition-colors hover:text-[color:var(--site-primary)]">
                    Se alle ydelser
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <FooterHeading>Genveje</FooterHeading>
            <ul className="mt-5 space-y-3 text-sm text-[color:var(--site-muted)]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-[color:var(--site-primary)]">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privatlivspolitik" className="transition-colors hover:text-[color:var(--site-primary)]">
                  Privatlivspolitik
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      <div className="border-t border-[color:var(--site-border)] bg-white/55">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-[color:var(--site-muted)] sm:flex-row">
          <p>© {new Date().getFullYear()} {company.name}. Alle rettigheder forbeholdes.</p>
          <div className="flex flex-wrap items-center gap-4">
            <span>CVR: {company.cvr}</span>
            <span>Område: {company.serviceAreas.join(', ')}</span>
          </div>
        </Container>
      </div>

      <a
        href="#"
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[color:var(--site-primary-strong)] hover:shadow-xl sm:bottom-6 sm:right-6"
        aria-label="Scroll til toppen"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </a>
    </footer>
  )
}
