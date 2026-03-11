import { SiteContent } from '@/lib/site-data'

const DARK_SURFACE_FALLBACK = '/brand/tb-entreprise-logo-light.svg'
const LIGHT_SURFACE_FALLBACK = '/brand/tb-entreprise-logo-dark.svg'
const OPAQUE_RASTER_PATTERN = /\.jpe?g(?:$|\?)/i

export function getCompanyLogoPath(
  company: SiteContent['company'],
  surface: 'dark' | 'light',
) {
  const darkAreaLogo = company.logoUrl.trim()
  const lightAreaLogo = company.logoUrlOnLight.trim()

  if (surface === 'dark') {
    if (darkAreaLogo && !OPAQUE_RASTER_PATTERN.test(darkAreaLogo)) return darkAreaLogo
    return DARK_SURFACE_FALLBACK
  }

  if (lightAreaLogo) return lightAreaLogo
  if (darkAreaLogo && !OPAQUE_RASTER_PATTERN.test(darkAreaLogo)) return darkAreaLogo
  return LIGHT_SURFACE_FALLBACK
}
