import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Container from '@/components/Container'
import PageNarrativeSection from '@/components/PageNarrativeSection'
import QuoteSection from '@/components/sections/QuoteSection'
import { readCmsState } from '@/lib/cms-store'
import { getCustomPageNarrative } from '@/lib/professional-copy'
import { withSiteBasePath } from '@/lib/site-paths'
import { getCustomPageBySlug } from '@/lib/site-data'

type CustomPageProps = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const state = await readCmsState()
  return state.content.customPages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: CustomPageProps): Promise<Metadata> {
  const state = await readCmsState()
  const page = getCustomPageBySlug(state.content, params.slug)

  if (!page) {
    return {
      title: 'Side ikke fundet',
    }
  }

  return {
    title: page.title,
    description: page.intro,
    alternates: {
      canonical: withSiteBasePath(`/sider/${page.slug}`),
    },
  }
}

export default async function CustomPage({ params }: CustomPageProps) {
  const state = await readCmsState()
  const page = getCustomPageBySlug(state.content, params.slug)

  if (!page) {
    notFound()
  }

  return (
    <>
      <section className="hero-shell py-20">
        <Container className="max-w-4xl">
          <p className="section-eyebrow">{page.menuLabel}</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl">{page.title}</h1>
          <p className="mt-6 text-base leading-relaxed text-[color:var(--site-on-dark-soft)]">{page.intro}</p>
        </Container>
      </section>

      <section className="section-soft py-20">
        <Container className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {page.sections.map((section) => (
            <article key={section.heading} className="panel-card p-6">
              <h2 className="font-display text-2xl text-[color:var(--site-text)]">{section.heading}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[color:var(--site-muted)]">{section.text}</p>
              {section.bullets.length > 0 ? (
                <ul className="mt-5 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="rounded-xl border border-[color:var(--site-border)] bg-[color:var(--site-panel-soft)] px-3 py-2 text-sm">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </Container>
      </section>

      <PageNarrativeSection
        block={getCustomPageNarrative(page)}
        imageSrc={state.content.galleryImages[0]?.src ?? state.content.hero.backgroundImage}
        imageAlt={page.title}
      />
      <QuoteSection company={state.content.company} quoteForm={state.content.quoteForm} templateId={state.activeTemplate} compact />
    </>
  )
}
