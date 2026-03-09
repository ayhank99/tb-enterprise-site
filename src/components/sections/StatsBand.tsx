import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'

type StatsBandProps = {
  points: string[]
}

const stats = [
  { value: '15+', label: 'AARS ERFARING' },
  { value: '500+', label: 'GLADE KUNDER' },
  { value: '100%', label: 'KVALITETSFOKUS' },
  { value: '24/7', label: 'TILGAENGELIG' },
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
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, var(--site-dark) 0%, var(--site-dark) 47%, var(--site-primary) 47.15%, var(--site-primary) 100%)',
        }}
      />

      <Container className="relative py-12 md:py-16">
        <ScrollReveal className="mb-10 grid gap-4 border-b border-white/15 pb-6 lg:grid-cols-[1fr_260px] lg:items-center">
          <p className="text-lg font-bold text-white md:text-2xl">
            Vi leverer kvalitet og paalidelighed i hvert eneste projekt.
          </p>
          <div className="justify-self-start lg:justify-self-end">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-3 rounded-none bg-[color:var(--site-primary)] px-6 py-4 text-sm font-bold uppercase tracking-[0.08em] text-[color:var(--site-dark)] transition-opacity hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Kontakt os
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => {
            const darkSide = index < 2

            return (
              <ScrollReveal key={stat.label} as="article" variant={darkSide ? 'left' : 'right'} delay={index * 90} className="flex items-start gap-4">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 ${
                    darkSide
                      ? 'border-white/70 text-white'
                      : 'border-[color:var(--site-dark)]/40 text-[color:var(--site-dark)]'
                  }`}
                >
                  {icons[index]}
                </span>

                <div className={darkSide ? 'text-white' : 'text-[color:var(--site-dark)]'}>
                  <p className="text-4xl font-extrabold leading-none">{stat.value}</p>
                  <p className="mt-2 text-sm font-bold tracking-[0.12em]">{stat.label}</p>
                  <p className={`mt-2 max-w-[18rem] text-sm leading-relaxed ${darkSide ? 'text-white/70' : 'text-[color:var(--site-dark)]/70'}`}>
                    {points[index] ?? ''}
                  </p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
