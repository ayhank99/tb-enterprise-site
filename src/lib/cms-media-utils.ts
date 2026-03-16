import path from 'path'
import type { CmsMediaFile } from '@/lib/cms-types'

export const LOCAL_MEDIA_URL_PREFIX = '/uploads'
export const DATABASE_MEDIA_URL_PREFIX = '/media'
export const ALLOWED_MEDIA_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4', '.webm', '.mov', '.m4v'])

const CONTENT_TYPE_BY_EXTENSION: Record<string, string> = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.m4v': 'video/x-m4v',
  '.mov': 'video/quicktime',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
}

export function sanitizeCmsMediaBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getCmsMediaContentType(filename: string, fallback = 'application/octet-stream') {
  return CONTENT_TYPE_BY_EXTENSION[path.extname(filename).toLowerCase()] ?? fallback
}

export function buildLocalCmsMediaUrl(filename: string) {
  return `${LOCAL_MEDIA_URL_PREFIX}/${filename}`
}

export function buildDatabaseCmsMediaUrl(filename: string) {
  return `${DATABASE_MEDIA_URL_PREFIX}/${filename}`
}

export function sortCmsMediaFiles(items: CmsMediaFile[]) {
  return items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}
