'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Container from '@/components/Container'
import { isCmsEnabledOnDeployment, withSiteBasePath } from '@/lib/site-paths'
import { NavItem, SiteContent } from '@/lib/site-data'
import { TemplateId } from '@/lib/templates'

type HeaderProps = {
  company: SiteContent['company']
  navItems: NavItem[]
  templateId: TemplateId
}

function isRouteActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function itemIsActive(pathname: string, item: NavItem) {
  if (isRouteActive(pathname, item.href)) return true
  return item.children?.some((child) => isRouteActive(pathname, child.href)) ?? false
}

function BrandMark({ company }: { company: SiteContent['company'] }) {
  const src = withSiteBasePath(company.logoUrlOnLight || company.logoUrl)

  return (
    <Link href="/" aria-label="Forside" className="group inline-flex items-start">
      <Image
        src={src}
        alt={`${company.name} logo`}
        width={980}
        height={180}
        priority
        sizes="(max-width: 640px) 72vw, (max-width: 1024px) 48vw, 18rem"
        className="h-auto w-[clamp(10rem,58vw,18rem)] max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] sm:w-[clamp(11.5rem,42vw,18rem)]"
      />
    </Link>
  )
}

function CompactBrandMark({ company }: { company: SiteContent['company'] }) {
  const src = withSiteBasePath(company.logoUrl)

  return (
    <Link
      href="/"
      aria-label="Forside"
      className="group inline-flex items-center py-3"
    >
      <Image
        src={src}
        alt={`${company.name} logo`}
        width={760}
        height={140}
        sizes="(max-width: 640px) 132px, 160px"
        className="h-auto w-[8rem] max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] sm:w-[9rem]"
      />
    </Link>
  )
}

function TopBar({ company }: { company: SiteContent['company'] }) {
  return (
    <div className="bg-[color:var(--site-primary)]">
      <Container className="grid gap-4 py-4 sm:gap-5 sm:py-5 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10 lg:py-7">
        <BrandMark company={company} />

        <div className="hidden items-center justify-end gap-8 xl:flex">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[color:var(--site-dark)]/18 text-[color:var(--site-dark)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <circle cx="12" cy="15" r="3" />
                <path d="M12 12v3l2 1" />
              </svg>
            </span>
            <div>
              <span className="block text-sm font-semibold text-[color:var(--site-dark)]/68">Åbningstid</span>
              <span className="block text-xl font-bold tracking-[-0.03em] text-[color:var(--site-dark)]">{company.openingHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[color:var(--site-dark)]/18 text-[color:var(--site-dark)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div>
              <span className="block text-sm font-semibold text-[color:var(--site-dark)]/68">Ring til os</span>
              <Link href={company.phoneHref} className="block text-xl font-bold tracking-[-0.03em] text-[color:var(--site-dark)] transition-opacity hover:opacity-75">
                {company.phoneDisplay}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-[color:var(--site-dark)]/18 text-[color:var(--site-dark)]">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <div>
              <span className="block text-sm font-semibold text-[color:var(--site-dark)]/68">E-mail</span>
              <Link href={`mailto:${company.email}`} className="block text-xl font-bold tracking-[-0.03em] text-[color:var(--site-dark)] transition-opacity hover:opacity-75">
                {company.email}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

function DesktopNav({
  items,
  pathname,
  compact = false,
}: {
  items: NavItem[]
  pathname: string
  compact?: boolean
}) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (href: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenKey(href)
  }

  const handleMouseLeave = (href: string) => {
    timeoutRef.current = setTimeout(() => {
      setOpenKey((current) => (current === href ? null : current))
    }, 120)
  }

  return (
    <nav aria-label="Primær navigation" className="hidden lg:block">
      <ul className="flex items-center gap-0.5 xl:gap-1">
        {items.map((item) => {
          const active = itemIsActive(pathname, item)
          const hasChildren = Boolean(item.children?.length)
          const open = openKey === item.href

          return (
            <li
              key={item.href}
              className="relative"
              onMouseEnter={() => handleMouseEnter(item.href)}
              onMouseLeave={() => handleMouseLeave(item.href)}
              onFocusCapture={() => handleMouseEnter(item.href)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) handleMouseLeave(item.href)
              }}
            >
              <Link
                href={item.href}
                className={`group relative flex items-center gap-1.5 whitespace-nowrap ${
                  compact ? 'px-3 py-5 text-[12px]' : 'px-3 py-6 text-[12px] xl:px-4 xl:text-[13px]'
                } font-bold uppercase tracking-[0.1em] transition-colors duration-300 ${
                  active ? 'text-[color:var(--site-primary)]' : 'text-white hover:text-[color:var(--site-primary)]'
                }`}
              >
                <span>{item.label}</span>
                {hasChildren ? (
                  <svg viewBox="0 0 16 16" className={`h-2.5 w-2.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : null}
                <span
                  className={`absolute bottom-0 left-4 right-4 h-[3px] rounded-t-full transition-all duration-300 ${
                    active ? 'bg-[color:var(--site-primary)] scale-x-100' : 'bg-[color:var(--site-primary)] scale-x-0 group-hover:scale-x-100'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
              </Link>

              {hasChildren ? (
                <div
                  className={`absolute left-0 top-full z-50 pt-4 transition-all duration-300 ${
                    open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="w-[23rem] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[color:var(--site-dark)]/96 shadow-[0_30px_70px_-28px_rgba(0,0,0,0.78)] backdrop-blur-xl">
                    <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Undermenu</p>
                      <p className="mt-2 text-base font-semibold text-white">{item.label}</p>
                      <p className="mt-1 text-xs leading-relaxed text-white/62">
                        Vælg en underside eller gå til oversigten for at se hele området.
                      </p>
                    </div>

                    <ul role="menu" className="space-y-1 p-2">
                      {item.children!.map((child) => {
                        const childActive = isRouteActive(pathname, child.href)

                        return (
                          <li key={child.href} role="none">
                            <Link
                              role="menuitem"
                              href={child.href}
                              className={`group/item flex items-center gap-3 rounded-[1rem] px-4 py-3 transition-all duration-200 ${
                                childActive
                                  ? 'bg-white/10 text-white'
                                  : 'text-white/88 hover:bg-white/[0.06] hover:text-white'
                              }`}
                            >
                              <span
                                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-[11px] font-bold uppercase tracking-[0.08em] ${
                                  childActive
                                    ? 'border-[color:var(--site-primary)] bg-[color:var(--site-primary)] text-[color:var(--site-dark)]'
                                    : 'border-white/12 bg-white/[0.04] text-[color:var(--site-primary)]'
                                }`}
                              >
                                {child.icon ?? item.icon ?? 'PG'}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">{child.label}</span>
                                <span className="mt-0.5 block text-[11px] uppercase tracking-[0.12em] text-white/42">
                                  {item.href === '/ydelser' ? 'Se ydelse' : 'Se underside'}
                                </span>
                              </span>
                              <svg
                                viewBox="0 0 16 16"
                                className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                                  childActive ? 'translate-x-0 text-[color:var(--site-primary)]' : 'text-white/35 group-hover/item:translate-x-0.5 group-hover/item:text-[color:var(--site-primary)]'
                                }`}
                              >
                                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="border-t border-white/10 px-3 py-3">
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
                      >
                        <span>{item.href === '/ydelser' ? 'Se alle ydelser' : 'Se oversigt'}</span>
                        <svg viewBox="0 0 16 16" className="h-4 w-4">
                          <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

function MobileDrawer({
  open,
  onClose,
  items,
  pathname,
  expanded,
  onToggleParent,
  company,
  cmsEnabled,
}: {
  open: boolean
  onClose: () => void
  items: NavItem[]
  pathname: string
  expanded: Record<string, boolean>
  onToggleParent: (href: string) => void
  company: SiteContent['company']
  cmsEnabled: boolean
}) {
  return (
    <div className={`lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Luk menu"
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`fixed right-0 top-0 z-[80] flex h-full w-[min(94vw,420px)] flex-col overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--site-dark)' }}
      >
        <div className="border-b border-white/12 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--site-primary)]">Menu</p>
                <CompactBrandMark company={company} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-white transition-colors hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <nav aria-label="Mobil navigation" className="flex-1 p-5">
          <ul className="space-y-1">
            {items.map((item) => {
              const active = itemIsActive(pathname, item)
              const hasChildren = Boolean(item.children?.length)

              return (
                <li key={item.href}>
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] transition-all ${
                        active ? 'bg-[color:var(--site-primary)] text-[color:var(--site-dark)]' : 'text-white hover:bg-white/6 hover:text-[color:var(--site-primary)]'
                      }`}
                    >
                      {item.label}
                    </Link>

                    {hasChildren ? (
                      <button
                        type="button"
                        aria-label={`${item.label} undermenu`}
                        aria-expanded={Boolean(expanded[item.href])}
                        onClick={() => onToggleParent(item.href)}
                        className="inline-flex h-11 w-11 items-center justify-center text-white/70 transition-colors hover:bg-white/8 hover:text-[color:var(--site-primary)]"
                      >
                        <svg viewBox="0 0 16 16" className={`h-3 w-3 transition-transform duration-300 ${expanded[item.href] ? 'rotate-180' : ''}`}>
                          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {hasChildren && expanded[item.href] ? (
                    <ul className="ml-4 border-l-2 border-[color:var(--site-primary)]/30 pl-4">
                      {item.children!.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className={`block px-3 py-2.5 text-sm transition-all ${
                              isRouteActive(pathname, child.href)
                                ? 'text-[color:var(--site-primary)]'
                                : 'text-white/75 hover:pl-5 hover:text-[color:var(--site-primary)]'
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-white/12 p-5">
          <div className={`grid gap-3 ${cmsEnabled ? 'sm:grid-cols-2' : ''}`}>
            {cmsEnabled ? (
              <Link
                href="/admin"
                onClick={onClose}
                className="flex w-full items-center justify-center border border-white/15 bg-white/5 px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
              >
                Admin panel
              </Link>
            ) : null}
            <Link
              href="/kontakt#tilbudsformular"
              onClick={onClose}
              className="flex w-full items-center justify-center bg-[color:var(--site-primary)] px-5 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--site-dark)]"
            >
              Indhent tilbud
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default function Header({ company, navItems, templateId }: HeaderProps) {
  void templateId
  const cmsEnabled = isCmsEnabledOnDeployment()

  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let frame = 0

    const onScroll = () => {
      if (frame) return

      frame = window.requestAnimationFrame(() => {
        const nextScrollY = window.scrollY
        setScrolled((current) => (current ? nextScrollY > 32 : nextScrollY > 140))
        frame = 0
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className={`overflow-hidden transition-all duration-500 ease-out ${scrolled ? 'max-h-0 opacity-0' : 'max-h-[14rem] opacity-100'}`}>
          <TopBar company={company} />
        </div>

        <div className={`transition-all duration-300 ${scrolled ? 'bg-[color:var(--site-header)]/95 shadow-[0_12px_36px_-20px_rgba(10,22,40,0.8)] backdrop-blur-xl' : 'bg-transparent'}`}>
          <Container className={scrolled ? 'py-0' : 'lg:-mt-4'}>
            <div className={`builderz-nav-shell flex items-center justify-between gap-3 px-3.5 sm:px-4 lg:gap-4 lg:px-8 ${scrolled ? 'bg-[color:var(--site-header)]' : 'bg-[color:var(--site-navbar-bg)]'}`}>
              {scrolled ? (
                <div className="hidden min-w-[11rem] lg:block">
                  <CompactBrandMark company={company} />
                </div>
              ) : null}

              <div className={`hidden lg:flex lg:flex-1 ${scrolled ? 'justify-start' : 'justify-center'}`}>
                <DesktopNav items={navItems} pathname={pathname} compact={scrolled} />
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                {cmsEnabled ? (
                  <Link
                    href="/admin"
                    className={`inline-flex items-center whitespace-nowrap border border-white/18 bg-white/5 px-4 font-bold uppercase tracking-[0.08em] text-white transition-all duration-300 hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)] ${
                      scrolled ? 'py-3 text-[12px]' : 'py-4 text-[12px] xl:px-5 xl:text-[13px]'
                    }`}
                  >
                    Admin panel
                  </Link>
                ) : null}
                <Link
                  href="/kontakt#tilbudsformular"
                  className={`inline-flex items-center whitespace-nowrap border-2 border-[color:var(--site-primary)] px-5 font-bold uppercase tracking-[0.08em] text-[color:var(--site-primary)] transition-all duration-300 hover:bg-[color:var(--site-primary)] hover:text-[color:var(--site-dark)] ${
                    scrolled ? 'py-3 text-[12px]' : 'py-4 text-[12px] xl:px-6 xl:text-[13px]'
                  }`}
                >
                  Indhent tilbud
                </Link>
              </div>

              <div className="flex min-h-[4rem] flex-1 items-center justify-between gap-2 lg:hidden">
                <CompactBrandMark company={company} />

                <div className="flex items-center gap-2">
                  <Link
                    href={company.phoneHref}
                    className="inline-flex h-10 w-10 items-center justify-center bg-[color:var(--site-primary)] text-sm font-bold text-[color:var(--site-dark)] min-[380px]:w-auto min-[380px]:gap-2 min-[380px]:px-3"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="hidden min-[380px]:inline">Ring</span>
                  </Link>

                  <button
                    type="button"
                    aria-label="Åbn menu"
                    aria-expanded={mobileOpen}
                    onClick={() => setMobileOpen((current) => !current)}
                    className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      {mobileOpen ? (
                        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      ) : (
                        <>
                          <path d="M4 7h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M4 12h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M4 17h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </header>

      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={navItems}
        pathname={pathname}
        expanded={mobileExpanded}
        onToggleParent={(href) => setMobileExpanded((current) => ({ ...current, [href]: !current[href] }))}
        company={company}
        cmsEnabled={cmsEnabled}
      />
    </>
  )
}
