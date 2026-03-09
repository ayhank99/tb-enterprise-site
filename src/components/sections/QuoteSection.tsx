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
    <section id="tilbudsformular" className="bg-white section-block">
      <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <SectionHeading eyebrow={quoteForm.title} title={quoteForm.heading} intro={quoteForm.intro} />

          {!compact ? (
            <ScrollReveal delay={180} className="space-y-4 text-sm text-[color:var(--site-muted)]">
              <p>
                Har du brug for hurtig afklaring? Ring direkte paa{' '}
                <Link className="font-bold text-[color:var(--site-primary-strong)] transition-colors hover:text-[color:var(--site-primary)]" href={company.phoneHref}>
                  {company.phoneDisplay}
                </Link>
                .
              </p>
              <p>
                E-mail:{' '}
                <Link href={`mailto:${company.email}`} className="font-bold text-[color:var(--site-primary-strong)] transition-colors hover:text-[color:var(--site-primary)]">
                  {company.email}
                </Link>
              </p>
              <p>Adresse: {company.address}</p>
            </ScrollReveal>
          ) : null}
        </div>

        <ScrollReveal variant="image" delay={120} className="overflow-hidden rounded-lg shadow-2xl" style={{ background: 'var(--site-dark)' }}>
          <div className="p-6 sm:p-8">
            <QuoteForm quoteForm={quoteForm} />
          </div>
        </ScrollReveal>
      </Container>
    </section>
  )
}
