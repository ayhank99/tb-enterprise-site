import Container from '@/components/Container'
import { TemplateId } from '@/lib/templates'

type TrustStripProps = {
  points: string[]
  templateId: TemplateId
}

const icons = [
  <svg key="a" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>,
  <svg key="b" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>,
  <svg key="c" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>,
  <svg key="d" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
  </svg>,
]

const statNumbers = ['15+', '500+', '100%', '24/7']
const statLabels = ['Års erfaring', 'Glade kunder', 'Kvalitetsgaranti', 'Support']

export default function TrustStrip({ points, templateId }: TrustStripProps) {
  void templateId

  return (
    <>
      {/* ── CTA STRIP (navy left + gold right with diagonal) ── */}
      <section className="relative overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Left — Dark navy with message */}
          <div className="flex flex-1 items-center bg-[color:var(--site-dark)] px-8 py-5 lg:px-12">
            <p className="text-base font-bold text-white md:text-lg">
              Vi leverer kvalitet og pålidelighed i hvert eneste projekt
            </p>
          </div>
          {/* Diagonal SVG divider */}
          <div className="hidden sm:block">
            <svg viewBox="0 0 60 70" preserveAspectRatio="none" className="h-full w-[60px]" style={{ display: 'block' }}>
              <polygon points="0,0 60,0 0,70" fill="var(--site-dark)" />
              <polygon points="60,0 60,70 0,70" fill="var(--site-primary)" />
            </svg>
          </div>
          {/* Right — Gold with CTA */}
          <div className="flex items-center justify-center bg-[color:var(--site-primary)] px-8 py-5 lg:px-12">
            <a href="/kontakt" className="flex items-center gap-3 text-base font-bold text-[color:var(--site-dark)] transition-opacity hover:opacity-80 md:text-lg">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
              Kontakt os
            </a>
          </div>
        </div>
      </section>

      {/* ── DIAGONAL STATS COUNTER (Builderz style: navy + gold split) ── */}
      <section className="relative overflow-hidden">
        {/* Background: diagonal split */}
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{ background: 'linear-gradient(160deg, var(--site-dark) 55%, var(--site-primary) 55%)' }} />
        </div>

        <Container className="relative py-12 md:py-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {points.map((point, idx) => (
              <div key={point} className="flex items-center gap-4">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ${
                  idx < 2 ? 'border-[color:var(--site-primary)]/40 text-[color:var(--site-primary)]' : 'border-[color:var(--site-dark)]/30 text-[color:var(--site-dark)]'
                }`}>
                  {icons[idx % icons.length]}
                </span>
                <div>
                  <span className={`block text-3xl font-black ${idx < 2 ? 'text-[color:var(--site-primary)]' : 'text-[color:var(--site-dark)]'}`}>
                    {statNumbers[idx % statNumbers.length]}
                  </span>
                  <span className={`block text-xs font-bold uppercase tracking-[0.12em] ${idx < 2 ? 'text-white/70' : 'text-[color:var(--site-dark)]/70'}`}>
                    {statLabels[idx % statLabels.length]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
