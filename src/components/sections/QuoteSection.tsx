import Link from 'next/link'
import Container from '@/components/Container'
import ScrollReveal from '@/components/ScrollReveal'
import SectionHeading from '@/components/SectionHeading'
import QuoteForm from '@/components/forms/QuoteForm'
import { SiteContent } from '@/lib/site-data'
import { TemplateId } from '@/lib/templates'

type QuoteSectionProps = {
  company: SiteContent['company']
  quoteForm: SiteContent['quoteForm']
  templateId: TemplateId
  compact?: boolean
}

export default function QuoteSection({ company, quoteForm, templateId, compact = false }: QuoteSectionProps) {
  void templateId

  return (
    <section id="tilbudsformular" className="section-block" style={{ background: 'var(--site-bg)' }}>
      <Container>
        <SectionHeading eyebrow={quoteForm.title} title={quoteForm.heading} intro={quoteForm.intro} align="center" />

        {!compact ? (
          <ScrollReveal delay={160} className="mx-auto mb-8 max-w-3xl text-center text-sm text-[color:var(--site-muted)]">
            Har du brug for hurtig afklaring? Ring direkte på{' '}
            <Link
              className="font-bold text-[color:var(--site-primary-strong)] transition-colors hover:text-[color:var(--site-primary)]"
              href={company.phoneHref}
            >
              {company.phoneDisplay}
            </Link>{' '}
            eller skriv til{' '}
            <Link
              href={`mailto:${company.email}`}
              className="font-bold text-[color:var(--site-primary-strong)] transition-colors hover:text-[color:var(--site-primary)]"
            >
              {company.email}
            </Link>
            .
          </ScrollReveal>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr] xl:items-stretch">
          <ScrollReveal
            variant="left"
            className="relative overflow-hidden rounded-[2rem] px-7 py-8 text-white shadow-[var(--site-card-shadow-hover)]"
            style={{ background: 'linear-gradient(180deg, var(--site-primary) 0%, var(--site-primary-strong) 100%)' }}
          >
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-white/80">DIREKTE KONTAKT</p>
                <h3 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em]">
                  Vi vender hurtigt tilbage på din forespørgsel.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">
                  Send din opgave til os her, eller kontakt os direkte, hvis du har brug for en hurtig afklaring om pris,
                  tidsplan eller udførelse.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <Link
                  href={company.phoneHref}
                  className="flex items-center gap-3 rounded-2xl bg-white/12 px-4 py-4 font-semibold text-white transition-colors hover:bg-white/18"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <span>{company.phoneDisplay}</span>
                </Link>

                <Link
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/12 px-4 py-4 font-semibold text-white transition-colors hover:bg-white/18"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <span className="break-all">{company.email}</span>
                </Link>

                <div className="rounded-2xl bg-white/12 px-4 py-4 text-sm leading-relaxed text-white/88">
                  <p className="font-semibold text-white">Adresse</p>
                  <p className="mt-1">{company.address}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal
            variant="image"
            delay={120}
            className="overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] shadow-[var(--site-card-shadow-hover)]"
          >
            <div className="p-5 sm:p-8">
              <QuoteForm quoteForm={quoteForm} />
            </div>
          </ScrollReveal>
        </div>
      </Container>
    </section>
  )
}
