import Link from 'next/link'
import Container from '@/components/Container'
import SectionHeading from '@/components/SectionHeading'
import { SiteContent } from '@/lib/site-data'
import { TemplateId } from '@/lib/templates'

type AboutTeaserProps = {
  companyStory: SiteContent['companyStory']
  templateId: TemplateId
  block: {
    eyebrow?: string
    title: string
    intro: string
  }
  cta: {
    eyebrow: string
    title: string
    text: string
    primaryLabel: string
    secondaryLabel: string
  }
}

export default function AboutTeaser({ companyStory, templateId, block, cta }: AboutTeaserProps) {
  void templateId

  return (
    <section className="section-block bg-[color:var(--site-bg-soft)]">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-start">
        <div>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <ul className="space-y-3 text-sm leading-relaxed text-[color:var(--site-text)]">
            {companyStory.points.map((point) => (
              <li key={point} className="flex items-start gap-3 rounded-[1.35rem] border border-[color:var(--site-border)] bg-white px-5 py-4 shadow-[var(--site-card-shadow)]">
                <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color:var(--site-primary-soft)] text-[color:var(--site-primary)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <article className="overflow-hidden rounded-[2rem] border border-[color:var(--site-border)] bg-white shadow-[var(--site-card-shadow-hover)]">
          <div className="h-1 bg-[color:var(--site-primary)]" />
          <div className="p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--site-primary)]">{cta.eyebrow}</p>
            <h3 className="mt-4 text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[color:var(--site-text)]">{cta.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--site-muted)]">{cta.text}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/kontakt#tilbudsformular" className="btn-primary">
                {cta.primaryLabel}
              </Link>
              <Link href="/om-os" className="btn-secondary">
                {cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </article>
      </Container>
    </section>
  )
}
