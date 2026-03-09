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
    <section className="bg-[color:var(--site-bg-soft)] section-block">
      <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <ul className="space-y-3 text-sm leading-relaxed text-[color:var(--site-text)]">
            {companyStory.points.map((point) => (
              <li key={point} className="group flex items-start gap-3 rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] px-5 py-4 shadow-[var(--site-card-shadow)] transition-all duration-300 hover:shadow-[var(--site-card-shadow-hover)]">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[color:var(--site-primary)]/15 text-[color:var(--site-primary)] transition-all duration-200 group-hover:bg-[color:var(--site-primary)] group-hover:text-[color:var(--site-dark)]">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <article className="relative overflow-hidden rounded-2xl bg-[color:var(--site-dark)] text-[color:var(--site-on-dark)] shadow-2xl">
          {/* Gold accent top */}
          <div className="h-1 bg-gradient-to-r from-[color:var(--site-primary)] via-[#f7b731] to-[color:var(--site-primary)]" />

          <div className="p-8">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--site-primary)]">
              <span className="h-[2px] w-6 bg-[color:var(--site-primary)]" />
              {cta.eyebrow}
            </p>
            <h3 className="mt-4 font-display text-2xl">{cta.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--site-on-dark-soft)]">
              {cta.text}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/kontakt#tilbudsformular" className="btn-primary">
                {cta.primaryLabel}
              </Link>
              <Link
                href="/om-os"
                className="inline-flex items-center rounded-lg border-2 border-white/20 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-[color:var(--site-primary)] hover:text-[color:var(--site-primary)]"
              >
                {cta.secondaryLabel}
              </Link>
            </div>
          </div>
        </article>
      </Container>
    </section>
  )
}
