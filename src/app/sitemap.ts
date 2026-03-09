import type { MetadataRoute } from 'next'
import { readCmsState } from '@/lib/cms-store'
import { toAbsoluteSiteUrl } from '@/lib/site-paths'
import { defaultSiteContent } from '@/lib/site-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const state = await readCmsState()
  const content = state.content
  const siteUrl = content.seo.siteUrl || defaultSiteContent.seo.siteUrl

  const staticPages = ['', '/ydelser', '/galleri', '/sider', '/om-os', '/kontakt', '/privatlivspolitik']

  const staticEntries = staticPages.map((path) => ({
    url: toAbsoluteSiteUrl(siteUrl, path || '/'),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1 : 0.8,
  }))

  const serviceEntries = content.services.map((service) => ({
    url: toAbsoluteSiteUrl(siteUrl, `/ydelser/${service.slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const customPageEntries = content.customPages.map((page) => ({
    url: toAbsoluteSiteUrl(siteUrl, `/sider/${page.slug}`),
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticEntries, ...serviceEntries, ...customPageEntries]
}
