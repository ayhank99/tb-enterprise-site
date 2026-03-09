import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import '@/app/globals.css'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LocationSection from '@/components/LocationSection'
import StructuredData from '@/components/StructuredData'
import { readCmsState } from '@/lib/cms-store'
import { isPreviewDeployment, toAbsoluteSiteUrl, withSiteBasePath } from '@/lib/site-paths'
import { defaultSiteContent, getNavItems } from '@/lib/site-data'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
})

export async function generateMetadata(): Promise<Metadata> {
  const state = await readCmsState()
  const seo = state.content.seo ?? defaultSiteContent.seo
  const siteHomeUrl = toAbsoluteSiteUrl(seo.siteUrl, '/')
  const previewMode = isPreviewDeployment()

  return {
    metadataBase: new URL(siteHomeUrl),
    title: {
      default: seo.title,
      template: `%s | ${state.content.company.name}`,
    },
    description: seo.description,
    icons: {
      icon: withSiteBasePath('/favicon.svg'),
      shortcut: withSiteBasePath('/favicon.svg'),
      apple: withSiteBasePath('/favicon.svg'),
    },
    alternates: {
      canonical: withSiteBasePath('/'),
    },
    robots: previewMode ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: siteHomeUrl,
      siteName: state.content.company.name,
      locale: seo.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const state = await readCmsState()
  const navItems = getNavItems(state.content)

  return (
    <html lang="da" data-template="builderz">
      <body className={poppins.variable}>
        <StructuredData content={state.content} />
        <Header company={state.content.company} navItems={navItems} templateId="builderz" />
        <main>{children}</main>
        <LocationSection company={state.content.company} />
        <Footer company={state.content.company} navItems={navItems} />
      </body>
    </html>
  )
}
