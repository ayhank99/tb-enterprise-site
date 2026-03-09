import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import SectionHeading from '@/components/SectionHeading'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Ekstra sider',
  description: 'Oversigt over sider om entreprise, erhverv og projektforloeb hos TB Entreprise.',
  alternates: {
    canonical: withSiteBasePath('/sider'),
  },
}

export default async function CustomPagesOverview() {
  const state = await readCmsState()
  const block = state.content.pages.customPages ?? defaultSiteContent.pages.customPages

  return (
    <section className="section-soft py-20">
      <Container>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        <div className="grid gap-5 md:grid-cols-2">
          {state.content.customPages.map((page) => (
            <article key={page.slug} className="panel-card p-6">
              <h2 className="font-display text-3xl text-[color:var(--site-text)]">{page.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--site-muted)]">{page.intro}</p>
              <Link href={`/sider/${page.slug}`} className="btn-secondary mt-6 inline-flex">
                Åbn side
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}



