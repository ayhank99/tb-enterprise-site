import { SiteContent } from '@/lib/site-data'
import { toAbsoluteSiteUrl, withSiteBasePath } from '@/lib/site-paths'

type StructuredDataProps = {
  content: SiteContent
}

export default function StructuredData({ content }: StructuredDataProps) {
  const activeLogoUrl = content.company.logoUrlOnLight || content.company.logoUrl
  const logoUrl = activeLogoUrl
    ? new URL(withSiteBasePath(activeLogoUrl), content.seo.siteUrl).toString()
    : undefined

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: content.company.name,
    ...(logoUrl ? { logo: logoUrl } : {}),
    description: content.seo.description,
    telephone: content.company.phoneDisplay,
    email: content.company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: content.company.address,
      addressCountry: 'DK',
    },
    areaServed: content.company.serviceAreas,
    url: toAbsoluteSiteUrl(content.seo.siteUrl, '/'),
    openingHours: content.company.openingHours,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
