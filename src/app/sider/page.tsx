import type { Metadata } from 'next'
import Link from 'next/link'
import Container from '@/components/Container'
import PageHero from '@/components/PageHero'
import ScrollReveal from '@/components/ScrollReveal'
import { readCmsState } from '@/lib/cms-store'
import { withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Ekstra sider',
  description: 'Oversigt over sider om entreprise, erhverv og projektforløb hos TB Entreprise.',
  alternates: {
    canonical: withSiteBasePath('/sider'),
  },
}

export default async function CustomPagesOverview() {
  const state = await readCmsState()
  const block = state.content.pages.customPages ?? defaultSiteContent.pages.customPages
  const heroImage = state.content.galleryImages[0]?.src ?? state.content.hero.backgroundImage

  return (
    <>
      <PageHero
        eyebrow={block.eyebrow}
        title={block.title}
        intro={block.intro}
        imageSrc={heroImage}
        imageAlt={state.content.company.name}
        primaryCtaLabel="Kontakt os"
        primaryCtaHref="/kontakt#tilbudsformular"
        secondaryCtaLabel="Se ydelser"
        secondaryCtaHref="/ydelser"
      />

      <section className="section-soft py-16 md:py-20">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            {state.content.customPages.map((page, index) => (
              <ScrollReveal key={page.slug} as="article" variant="soft" delay={index * 70} className="panel-card p-6">
                <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold tracking-[-0.04em] text-[color:var(--site-text)]">{page.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--site-muted)]">{page.intro}</p>
                <Link href={`/sider/${page.slug}`} className="btn-secondary mt-6 inline-flex">
                  Åbn side
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
