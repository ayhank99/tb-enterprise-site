import Container from '@/components/Container'
import SectionHeading from '@/components/SectionHeading'
import { TemplateId } from '@/lib/templates'

type ProcessStep = {
  title: string
  text: string
}

type ProcessVariant = 'steps' | 'timeline'

type ProcessSectionProps = {
  steps: ProcessStep[]
  templateId: TemplateId
  block: {
    eyebrow?: string
    title: string
    intro: string
  }
  variant?: ProcessVariant
}

export default function ProcessSection({ steps, templateId, block, variant = 'steps' }: ProcessSectionProps) {
  void templateId

  return (
    <section className="bg-[color:var(--site-panel)] section-block relative overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--site-muted) 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />

      <Container className="relative">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />

        {variant === 'steps' ? (
          <ol className="grid gap-[var(--grid-gap)] md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="group relative overflow-hidden rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-6 shadow-[var(--site-card-shadow)] transition-all duration-400 hover:shadow-[var(--site-card-shadow-hover)] hover:-translate-y-1"
              >
                {/* Gold top accent */}
                <div className="absolute left-0 right-0 top-0 h-[3px] bg-[color:var(--site-primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Step number */}
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--site-primary)] text-lg font-bold text-[color:var(--site-dark)] shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  {index + 1}
                </span>

                <h3 className="font-display text-xl text-[color:var(--site-text)] transition-colors duration-200 group-hover:text-[color:var(--site-primary-strong)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--site-muted)]">{step.text}</p>

                {/* Connector line (visible on xl) */}
                {index < steps.length - 1 && (
                  <div className="pointer-events-none absolute -right-4 top-1/2 hidden h-[2px] w-8 bg-[color:var(--site-primary)]/30 xl:block" />
                )}
              </li>
            ))}
          </ol>
        ) : null}

        {variant === 'timeline' ? (
          <ol className="relative space-y-6 border-l-2 pl-8" style={{ borderColor: 'var(--site-primary)' }}>
            {steps.map((step, index) => (
              <li key={step.title} className="group relative rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel)] p-6 shadow-[var(--site-card-shadow)] transition-all duration-300 hover:shadow-[var(--site-card-shadow-hover)]">
                <span className="absolute -left-[calc(2rem+5px)] mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--site-primary)] text-xs font-bold text-[color:var(--site-dark)] shadow-md">
                  {index + 1}
                </span>
                <h3 className="font-display text-xl text-[color:var(--site-text)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--site-muted)]">{step.text}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </Container>
    </section>
  )
}
