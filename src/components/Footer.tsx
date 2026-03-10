import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import { withSiteBasePath } from '@/lib/site-paths'
import { NavItem, SiteContent } from '@/lib/site-data'

type FooterProps = {
  company: SiteContent['company']
  navItems: NavItem[]
}

/* ═══════════════════════════════════════
   Dual CTA Bar (Builderz style)
   ═══════════════════════════════════════ */
function FooterCtaBar({ company }: { company: SiteContent['company'] }) {
  return (
    <div className="mx-auto max-w-[var(--container-max)] px-4 sm:px-6 lg:px-10">
      <div className="relative -mb-px flex flex-col overflow-hidden rounded-t-2xl shadow-2xl sm:flex-row">
        {/* Left: Request a Quote — Dark */}
        <Link
          href="/kontakt#tilbudsformular"
          className="group flex flex-1 items-center justify-center gap-4 bg-[color:var(--site-dark)] px-8 py-6 transition-all duration-300 hover:bg-[color:var(--site-dark-soft)]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-[color:var(--site-primary)]/40 text-[color:var(--site-primary)] transition-all duration-300 group-hover:border-[color:var(--site-primary)] group-hover:bg-[color:var(--site-primary)] group-hover:text-[color:var(--site-dark)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="10" y1="14" x2="14" y2="14" />
              <line x1="12" y1="12" x2="12" y2="16" />
            </svg>
          </span>
          <span className="text-lg font-bold text-white transition-colors duration-300 group-hover:text-[color:var(--site-primary)] sm:text-xl">
            Anmod om tilbud
          </span>
        </Link>

        {/* Diagonal divider */}
        <div className="hidden sm:block">
          <svg viewBox="0 0 60 80" preserveAspectRatio="none" className="h-full w-[60px]" style={{ display: 'block' }}>
            <polygon points="0,0 60,0 0,80" fill="var(--site-dark)" />
            <polygon points="60,0 60,80 0,80" fill="var(--site-primary)" />
          </svg>
        </div>

        {/* Right: Contact — Gold */}
        <Link
          href={company.phoneHref}
          className="group flex flex-1 items-center justify-center gap-4 bg-[color:var(--site-primary)] px-8 py-6 transition-all duration-300 hover:bg-[color:var(--site-primary-strong)]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 border-[color:var(--site-dark)]/20 text-[color:var(--site-dark)] transition-all duration-300 group-hover:border-[color:var(--site-dark)] group-hover:bg-[color:var(--site-dark)] group-hover:text-[color:var(--site-primary)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <span className="text-lg font-bold text-[color:var(--site-dark)] sm:text-xl">
            Ring {company.phoneDisplay}
          </span>
        </Link>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════
   Chevron Arrow for list items
   ═══════════════════════════════════════ */
function ChevronRight() {
  return (
    <svg viewBox="0 0 16 16" className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--site-primary)]">
      <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ═══════════════════════════════════════
   Footer Heading (gold with line)
   ═══════════════════════════════════════ */
function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-6 flex items-center gap-3 text-sm font-black uppercase tracking-[0.16em] text-[color:var(--site-primary)]">
      {children}
      <span className="h-[2px] flex-1 bg-[color:var(--site-primary)]/30" />
    </h3>
  )
}

export default function Footer({ company, navItems }: FooterProps) {
  const serviceItems = navItems.find(n => n.href === '/ydelser')?.children ?? []

  return (
    <>
      {/* ── DUAL CTA BAR ── */}
      <FooterCtaBar company={company} />

      {/* ── MAIN FOOTER ── */}
      <footer className="relative overflow-hidden" style={{ background: 'var(--site-dark)' }}>
        {/* Gold accent line at top */}
        <div className="h-[3px] bg-gradient-to-r from-[color:var(--site-primary)] via-[#f7b731] to-[color:var(--site-primary)]" />

        {/* Subtle grid/dot pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <Container className="relative pb-8 pt-14 md:pt-16">
          {/* 4-Column Grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* ── Column 1: Office Contact ── */}
            <div>
              <FooterHeading>Kontakt</FooterHeading>

              <ul className="space-y-4 text-sm text-[color:var(--site-on-dark-soft)]">
                <li className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--site-primary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{company.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--site-primary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.876.37 1.74.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c1.07.33 1.93.57 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <Link href={company.phoneHref} className="font-semibold text-white transition-colors duration-200 hover:text-[color:var(--site-primary)]">
                    {company.phoneDisplay}
                  </Link>
                </li>
                <li className="flex items-start gap-3">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--site-primary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <Link href={`mailto:${company.email}`} className="font-semibold text-white transition-colors duration-200 hover:text-[color:var(--site-primary)]">
                    {company.email}
                  </Link>
                </li>
              </ul>

              {/* Social icons placeholder */}
              <div className="mt-6 flex gap-2">
                {['facebook', 'instagram', 'linkedin'].map((social) => (
                  <span
                    key={social}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white/60 transition-all duration-300 hover:border-[color:var(--site-primary)] hover:bg-[color:var(--site-primary)] hover:text-[color:var(--site-dark)] cursor-pointer"
                  >
                    {social === 'facebook' && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                      </svg>
                    )}
                    {social === 'instagram' && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    )}
                    {social === 'linkedin' && (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Column 2: Services Areas ── */}
            <div>
              <FooterHeading>Ydelser</FooterHeading>
              <ul className="space-y-3 text-sm">
                {serviceItems.length > 0
                  ? serviceItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="group/link flex items-center gap-2 text-[color:var(--site-on-dark-soft)] transition-all duration-200 hover:text-[color:var(--site-primary)] hover:pl-1"
                        >
                          <ChevronRight />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))
                  : (
                    <li>
                      <Link href="/ydelser" className="group/link flex items-center gap-2 text-[color:var(--site-on-dark-soft)] transition-all duration-200 hover:text-[color:var(--site-primary)] hover:pl-1">
                        <ChevronRight />
                        <span>Se alle ydelser</span>
                      </Link>
                    </li>
                  )}
              </ul>
            </div>

            {/* ── Column 3: Useful Pages ── */}
            <div>
              <FooterHeading>Sider</FooterHeading>
              <ul className="space-y-3 text-sm">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group/link flex items-center gap-2 text-[color:var(--site-on-dark-soft)] transition-all duration-200 hover:text-[color:var(--site-primary)] hover:pl-1"
                    >
                      <ChevronRight />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/privatlivspolitik"
                    className="group/link flex items-center gap-2 text-[color:var(--site-on-dark-soft)] transition-all duration-200 hover:text-[color:var(--site-primary)] hover:pl-1"
                  >
                    <ChevronRight />
                    <span>Privatlivspolitik</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* ── Column 4: About / Info ── */}
            <div>
              <FooterHeading>Om os</FooterHeading>

              {company.logoUrl ? (
                <div className="relative mb-5 h-16 w-[240px] max-w-full">
                  <Image
                    src={withSiteBasePath(company.logoUrl)}
                    alt={`${company.name} logo`}
                    fill
                    sizes="240px"
                    className="object-contain object-left"
                  />
                </div>
              ) : (
                <div className="mb-5 flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--site-primary)] text-sm font-black text-[color:var(--site-dark)]">
                    TB
                  </span>
                  <span className="text-lg font-bold text-white">TB Entreprise</span>
                </div>
              )}

              <p className="text-sm leading-relaxed text-[color:var(--site-on-dark-soft)]">
                Professionel belægning, haveservice og vedligehold med fokus på klare aftaler, stabil drift og pæn aflevering.
              </p>

              <div className="mt-5 space-y-2 text-sm text-[color:var(--site-on-dark-soft)]">
                <p className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[color:var(--site-primary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {company.openingHours}
                </p>
                <p className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[color:var(--site-primary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                  CVR: {company.cvr}
                </p>
                <p className="flex items-start gap-2">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--site-primary)]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Område: {company.serviceAreas.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </Container>

        {/* ── Bottom Copyright Bar ── */}
        <div className="border-t border-white/10" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <Container className="flex flex-col items-center justify-between gap-3 py-5 sm:flex-row">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} {company.name}. Alle rettigheder forbeholdes.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
              <Link href="/privatlivspolitik" className="transition-colors duration-200 hover:text-[color:var(--site-primary)]">
                Privatlivspolitik
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/kontakt" className="transition-colors duration-200 hover:text-[color:var(--site-primary)]">
                Kontakt
              </Link>
              <span className="text-white/20">|</span>
              <Link href="/om-os" className="transition-colors duration-200 hover:text-[color:var(--site-primary)]">
                Om os
              </Link>
            </div>
          </Container>
        </div>

        {/* Back to top button */}
        <a
          href="#"
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-lg bg-[color:var(--site-primary)] text-[color:var(--site-dark)] shadow-lg transition-all duration-300 hover:bg-[color:var(--site-primary-strong)] hover:-translate-y-1 hover:shadow-xl"
          aria-label="Scroll til toppen"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </a>
      </footer>
    </>
  )
}
