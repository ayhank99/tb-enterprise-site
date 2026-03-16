import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { createDefaultCmsState, resolveCmsState } from '@/lib/cms-state-utils'
import {
  buildLocalCmsMediaUrl,
  getCmsMediaContentType,
  sanitizeCmsMediaBaseName,
  sortCmsMediaFiles,
} from '@/lib/cms-media-utils'
import type { CmsMediaFile, CmsMediaRecord, CmsState, SaveCmsMediaInput } from '@/lib/cms-types'

const DATA_DIRECTORY = path.join(process.cwd(), 'data')
const CMS_STATE_PATH = path.join(DATA_DIRECTORY, 'cms-state.json')
const UPLOAD_DIRECTORY = path.join(process.cwd(), 'public', 'uploads')

async function ensureDataDirectory() {
  await fs.mkdir(DATA_DIRECTORY, { recursive: true })
}

async function ensureUploadDirectory() {
  await fs.mkdir(UPLOAD_DIRECTORY, { recursive: true })
}

export async function readCmsState(): Promise<CmsState> {
  try {
    const file = await fs.readFile(CMS_STATE_PATH, 'utf8')
    return resolveCmsState(JSON.parse(file) as unknown)
  } catch {
    const fallback = createDefaultCmsState()
    await ensureDataDirectory()
    await fs.writeFile(CMS_STATE_PATH, JSON.stringify(fallback, null, 2), 'utf8')
    return fallback
  }
}

export async function writeCmsState(input: Partial<CmsState>): Promise<CmsState> {
  await ensureDataDirectory()

  const current = await readCmsState().catch(() => createDefaultCmsState())
  const merged = resolveCmsState({
    ...current,
    ...input,
    activeTemplate: input.activeTemplate ?? current.activeTemplate,
    content: input.content ?? current.content,
    updatedAt: new Date().toISOString(),
  })

  await fs.writeFile(CMS_STATE_PATH, JSON.stringify(merged, null, 2), 'utf8')
  return merged
}

export async function listCmsMediaFiles(): Promise<CmsMediaFile[]> {
  await ensureUploadDirectory()
  const files = await fs.readdir(UPLOAD_DIRECTORY, { withFileTypes: true })
  const items = await Promise.all(
    files
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const fullPath = path.join(UPLOAD_DIRECTORY, entry.name)
        const stats = await fs.stat(fullPath)

        return {
          name: entry.name,
          url: buildLocalCmsMediaUrl(entry.name),
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
          contentType: getCmsMediaContentType(entry.name),
        } satisfies CmsMediaFile
      })
  )

  return sortCmsMediaFiles(items)
}

export async function saveCmsMediaFile(input: SaveCmsMediaInput): Promise<CmsMediaFile> {
  await ensureUploadDirectory()

  const originalName = path.basename(input.originalName)
  const extension = path.extname(originalName).toLowerCase()
  const baseName = sanitizeCmsMediaBaseName(path.basename(originalName, extension)) || 'media'
  const filename = `${baseName}-${randomUUID().slice(0, 8)}${extension}`
  const targetPath = path.join(UPLOAD_DIRECTORY, filename)
  const updatedAt = new Date().toISOString()

  await fs.writeFile(targetPath, input.buffer)

  return {
    name: filename,
    url: buildLocalCmsMediaUrl(filename),
    size: input.buffer.byteLength,
    updatedAt,
    contentType: input.contentType || getCmsMediaContentType(filename),
  }
}

export async function readCmsMediaFile(filename: string): Promise<CmsMediaRecord | null> {
  const safeName = path.basename(filename)
  const targetPath = path.join(UPLOAD_DIRECTORY, safeName)

  try {
    const [buffer, stats] = await Promise.all([fs.readFile(targetPath), fs.stat(targetPath)])

    return {
      name: safeName,
      url: buildLocalCmsMediaUrl(safeName),
      size: stats.size,
      updatedAt: stats.mtime.toISOString(),
      contentType: getCmsMediaContentType(safeName),
      buffer,
    }
  } catch {
    return null
  }
}

export async function deleteCmsMediaFile(filename: string) {
  const safeName = path.basename(filename)
  const targetPath = path.join(UPLOAD_DIRECTORY, safeName)
  await fs.unlink(targetPath)
}
