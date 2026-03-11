import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'

type StatsBandProps = {
  points: string[]
}

const stats = [
  { value: '15+', label: 'ÅRS ERFARING' },
  { value: '500+', label: 'GLADE KUNDER' },
  { value: '100%', label: 'KVALITETSFOKUS' },
  { value: '24/7', label: 'TILGÆNGELIG' },
]

const icons = [
  <svg key="a" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>,
]

export default function StatsBand({ points }: StatsBandProps) {
  return (
    <section className="section-block" style={{ background: 'var(--site-bg-soft)' }}>
      <Container>
        <ScrollReveal className="mb-10 flex flex-col gap-5 rounded-[2rem] border border-[color:var(--site-border)] bg-white px-6 py-7 shadow-[var(--site-card-shadow)] lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[color:var(--site-primary)]">TB ENTREPRISE</p>
            <p className="mt-3 max-w-2xl text-2xl font-extrabold leading-tight tracking-[-0.04em] text-[color:var(--site-text)]">
              Vi leverer kvalitet og pålidelighed i hvert eneste projekt.
            </p>
          </div>

          <Link href="/kontakt" className="btn-primary">
            Kontakt os
          </Link>
        </ScrollReveal>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={stat.label}
              as="article"
              variant="soft"
              delay={index * 80}
              className="rounded-[1.75rem] border border-[color:var(--site-border)] bg-white p-6 shadow-[var(--site-card-shadow)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--site-primary-soft)] text-[color:var(--site-primary)]">
                {icons[index]}
              </span>
              <p className="mt-5 text-4xl font-extrabold leading-none text-[color:var(--site-text)]">{stat.value}</p>
              <p className="mt-2 text-xs font-bold tracking-[0.12em] text-[color:var(--site-primary)]">{stat.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--site-muted)]">{points[index] ?? ''}</p>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
