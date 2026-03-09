import type { MetadataRoute } from 'next'
import { readCmsState } from '@/lib/cms-store'
import { getSiteOrigin, isPreviewDeployment, toAbsoluteSiteUrl } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const state = await readCmsState()
  const siteUrl = state.content.seo.siteUrl || defaultSiteContent.seo.siteUrl
  const previewMode = isPreviewDeployment()

  return {
    rules: {
      userAgent: '*',
      ...(previewMode ? { disallow: '/' } : { allow: '/' }),
    },
    sitemap: previewMode ? undefined : toAbsoluteSiteUrl(siteUrl, '/sitemap.xml'),
    host: getSiteOrigin(siteUrl),
  }
}
