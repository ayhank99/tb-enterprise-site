const ABSOLUTE_OR_SPECIAL_URL_RE = /^(?:[a-z][a-z\d+\-.]*:|\/\/|#)/i

function normalizeBasePath(value: string | undefined) {
  const trimmed = value?.trim() ?? ''

  if (!trimmed || trimmed === '/') {
    return ''
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/, '')
}

function ensureRootRelativePath(path: string) {
  if (!path) {
    return '/'
  }

  return path.startsWith('/') ? path : `/${path.replace(/^\/+/, '')}`
}

function ensureTrailingSlash(url: string) {
  return url.endsWith('/') ? url : `${url}/`
}

export function getSiteBasePath() {
  return normalizeBasePath(process.env.NEXT_PUBLIC_SITE_BASE_PATH)
}

export function isPreviewDeployment() {
  return process.env.NEXT_PUBLIC_SITE_IS_PREVIEW === 'true'
}

export function isCmsEnabledOnDeployment() {
  return process.env.NEXT_PUBLIC_CMS_ENABLED !== 'false'
}

export function withSiteBasePath(path: string) {
  if (!path) {
    return getSiteBasePath() || '/'
  }

  if (ABSOLUTE_OR_SPECIAL_URL_RE.test(path)) {
    return path
  }

  const normalizedPath = ensureRootRelativePath(path)
  const basePath = getSiteBasePath()

  if (!basePath) {
    return normalizedPath
  }

  if (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath
  }

  return normalizedPath === '/' ? basePath : `${basePath}${normalizedPath}`
}

export function toAbsoluteSiteUrl(siteUrl: string, path = '/') {
  const base = ensureTrailingSlash(siteUrl)
  const resolvedPath = withSiteBasePath(path)
  const site = new URL(base)

  if (site.pathname !== '/' && resolvedPath.startsWith(site.pathname)) {
    return new URL(resolvedPath, `${site.origin}/`).toString()
  }

  return new URL(resolvedPath, base).toString()
}

export function getSiteOrigin(siteUrl: string) {
  return new URL(ensureTrailingSlash(siteUrl)).origin
}
