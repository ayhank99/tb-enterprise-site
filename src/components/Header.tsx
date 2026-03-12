'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Container from '@/components/Container'
import { getCompanyLogoPath } from '@/lib/logo-utils'
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

function BrandMark({
  company,
  compact = false,
  surface = 'light',
}: {
  company: SiteContent['company']
  compact?: boolean
  surface?: 'light' | 'dark'
}) {
  const src = withSiteBasePath(getCompanyLogoPath(company, surface))

  return (
    <Link href="/" aria-label="Forside" className="group inline-flex items-center">
      <Image
        src={src}
        alt={`${company.name} logo`}
        width={980}
        height={180}
        priority
        sizes="(max-width: 640px) 58vw, (max-width: 1024px) 34vw, 14rem"
        className={`h-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.01] ${
          compact ? 'w-[7.7rem] sm:w-[8.8rem]' : 'w-[clamp(9rem,14vw,13rem)]'
        }`}
      />
    </Link>
  )
}

function DesktopNav({
  items,
  pathname,
  scrolled,
}: {
  items: NavItem[]
  pathname: string
  scrolled: boolean
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
    }, 110)
  }

  return (
    <nav aria-label="Primær navigation" className="hidden xl:block">
      <ul className="flex items-center gap-1 2xl:gap-2">
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
                className={`group flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.94rem] font-semibold tracking-[0.01em] transition-colors duration-300 2xl:px-3.5 ${
                  active
                    ? scrolled
                      ? 'text-[color:var(--site-primary)]'
                      : 'text-[color:var(--site-primary-strong)]'
                    : scrolled
                      ? 'text-white/95 hover:text-[color:var(--site-primary)]'
                      : 'text-[color:var(--site-text)] hover:text-[color:var(--site-primary-strong)]'
                }`}
              >
                <span>{item.label}</span>
                {hasChildren ? (
                  <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}>
                    <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : null}
              </Link>

              {hasChildren ? (
                <div
                  className={`absolute left-1/2 top-full z-50 w-[22.5rem] -translate-x-1/2 pt-4 transition-all duration-300 ${
                    open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                  }`}
                >
                  <div className="overflow-hidden rounded-[1.7rem] border border-[color:var(--site-border)] bg-white shadow-[0_28px_60px_-28px_rgba(31,37,29,0.48)] backdrop-blur-none">
                    <div className="border-b border-[color:var(--site-border)] bg-white px-5 py-4">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Undersider</p>
                      <p className="mt-2 text-base font-semibold text-[color:var(--site-text)]">{item.label}</p>
                    </div>

                    <ul role="menu" className="space-y-1 p-2">
                      {item.children!.map((child) => {
                        const childActive = isRouteActive(pathname, child.href)

                        return (
                          <li key={child.href} role="none">
                            <Link
                              role="menuitem"
                              href={child.href}
                              className={`group/item flex items-center gap-3 rounded-[1.05rem] px-4 py-3 transition-all duration-200 ${
                                childActive
                                  ? 'bg-[color:var(--site-primary-strong)] text-white'
                                  : 'text-[color:var(--site-text)] hover:bg-[color:var(--site-primary-strong)] hover:text-white'
                              }`}
                            >
                              <span
                                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold uppercase ${
                                  childActive
                                    ? 'bg-white/14 text-white ring-1 ring-white/16'
                                    : 'bg-[color:var(--site-bg-soft)] text-[color:var(--site-primary-strong)] ring-1 ring-[color:var(--site-border)] group-hover/item:bg-white/12 group-hover/item:text-white group-hover/item:ring-white/14'
                                }`}
                              >
                                {child.label.slice(0, 2)}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-semibold">{child.label}</span>
                                <span className={`mt-0.5 block text-[11px] ${childActive ? 'text-white/78' : 'text-[color:var(--site-muted)] group-hover/item:text-white/78'}`}>
                                  {item.href === '/ydelser' ? 'Se ydelse' : 'Se underside'}
                                </span>
                              </span>
                              <svg
                                viewBox="0 0 16 16"
                                className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                                  childActive
                                    ? 'text-white'
                                    : 'text-[color:var(--site-muted)] group-hover/item:translate-x-0.5 group-hover/item:text-white'
                                }`}
                              >
                                <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>

                    <div className="border-t border-[color:var(--site-border)] bg-white px-3 py-3">
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-[1rem] bg-[color:var(--site-bg-soft)] px-4 py-3 text-sm font-semibold text-[color:var(--site-text)] ring-1 ring-[color:var(--site-border)] transition-colors duration-200 hover:bg-[color:var(--site-primary-strong)] hover:text-white"
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
    <div className={`xl:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label="Luk menu"
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/52 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`fixed right-0 top-0 z-[80] flex h-full w-[min(94vw,420px)] flex-col overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'var(--site-header)' }}
      >
        <div className="border-b border-white/10 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">Menu</p>
              <div className="mt-3">
                <BrandMark company={company} compact surface="dark" />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <nav aria-label="Mobil navigation" className="flex-1 px-5 py-5">
          <ul className="space-y-2">
            {items.map((item) => {
              const active = itemIsActive(pathname, item)
              const hasChildren = Boolean(item.children?.length)

              return (
                <li key={item.href}>
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex-1 rounded-2xl px-4 py-3.5 text-base font-semibold transition-all ${
                        active ? 'bg-[color:var(--site-primary-soft)] text-[color:var(--site-primary)]' : 'text-white hover:bg-white/6'
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
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/75 transition-colors hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
                      >
                        <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded[item.href] ? 'rotate-180' : ''}`}>
                          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                    ) : null}
                  </div>

                  {hasChildren && expanded[item.href] ? (
                    <ul className="ml-4 mt-2 space-y-1 border-l border-[color:var(--site-primary)]/30 pl-4">
                      {item.children!.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className={`block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                              isRouteActive(pathname, child.href)
                                ? 'text-[color:var(--site-primary)]'
                                : 'text-white/78 hover:text-[color:var(--site-primary)]'
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

        <div className="border-t border-white/10 p-5">
          <div className={`grid gap-3 ${cmsEnabled ? 'sm:grid-cols-2' : ''}`}>
            {cmsEnabled ? (
              <Link
                href="/admin"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full border border-white/16 bg-white/6 px-5 py-4 text-sm font-semibold text-white transition-colors hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
              >
                Admin panel
              </Link>
            ) : null}
            <Link
              href="/kontakt#tilbudsformular"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-full bg-[color:var(--site-primary)] px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--site-primary-strong)]"
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
        setScrolled(window.scrollY > 28)
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
        <div
          className={`backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? 'border-b border-white/15 bg-[color:var(--site-header)] shadow-[0_18px_44px_-26px_rgba(31,35,29,0.72)]'
              : 'border-b border-[color:var(--site-border)]/60 bg-[color:var(--site-panel-alpha-strong)] shadow-[0_14px_30px_-28px_rgba(31,35,29,0.24)]'
          }`}
        >
          <Container className="flex items-center justify-between gap-4 py-3 sm:py-3.5 lg:gap-6 xl:max-w-[96rem] xl:px-7">
            <div className="shrink-0">
              <BrandMark company={company} surface={scrolled ? 'dark' : 'light'} />
            </div>

            <div className="hidden flex-1 items-center justify-end gap-5 xl:flex">
              <DesktopNav items={navItems} pathname={pathname} scrolled={scrolled} />

              <div className="flex items-center gap-3 pl-1">
                {cmsEnabled ? (
                  <Link
                    href="/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-3 text-sm font-semibold transition-colors ${
                      scrolled
                        ? 'border border-white/20 bg-white/10 text-white hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]'
                        : 'border border-[color:var(--site-border)] bg-white/85 text-[color:var(--site-text)] hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary-strong)]'
                    }`}
                  >
                    Admin panel
                  </Link>
                ) : null}

                <Link
                  href="/kontakt#tilbudsformular"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-[color:var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[color:var(--site-primary-strong)]"
                >
                  Indhent tilbud
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <Link
                href={company.phoneHref}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-white min-[390px]:w-auto min-[390px]:gap-2 min-[390px]:px-3"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="hidden min-[390px]:inline">Ring</span>
              </Link>

              <button
                type="button"
                aria-label="Åbn menu"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((current) => !current)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                  scrolled
                    ? 'border border-white/20 text-white hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]'
                    : 'border border-[color:var(--site-border)] text-[color:var(--site-text)] hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]'
                }`}
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
