function normalizeBasePath(value) {
  const trimmed = typeof value === 'string' ? value.trim() : ''

  if (!trimmed || trimmed === '/') {
    return ''
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.replace(/\/+$/, '')
}

const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_SITE_BASE_PATH)
const isStaticExport = process.env.NEXT_EXPORT_STATIC === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(basePath ? { basePath } : {}),
  ...(isStaticExport ? { output: 'export', trailingSlash: true } : {}),
  images: {
    ...(isStaticExport ? { unoptimized: true } : {}),
    path: `${basePath || ''}/_next/image`,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tbgruppen.dk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tbgruppen.dk',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
