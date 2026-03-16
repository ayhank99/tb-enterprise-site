import { randomUUID } from 'crypto'
import path from 'path'
import { Pool } from 'pg'
import { createDefaultCmsState, resolveCmsState } from '@/lib/cms-state-utils'
import {
  buildDatabaseCmsMediaUrl,
  getCmsMediaContentType,
  sanitizeCmsMediaBaseName,
  sortCmsMediaFiles,
} from '@/lib/cms-media-utils'
import type { CmsMediaFile, CmsMediaRecord, CmsState, SaveCmsMediaInput } from '@/lib/cms-types'

type CmsStateRow = {
  payload: unknown
}

type CmsMediaRow = {
  filename: string
  content_type: string
  size: number
  bytes: Buffer
  updated_at: Date | string
}

const CMS_DATABASE_URL = process.env.CMS_DATABASE_URL?.trim() || process.env.CHAT_DATABASE_URL?.trim() || ''
const CMS_DATABASE_SSL = process.env.CMS_DATABASE_SSL?.trim() || process.env.CHAT_DATABASE_SSL?.trim() || ''

let pool: Pool | null = null
let schemaReady: Promise<void> | null = null

export function isPostgresCmsStoreConfigured() {
  return Boolean(CMS_DATABASE_URL)
}

function shouldUseSsl() {
  if (CMS_DATABASE_SSL === 'true') {
    return true
  }

  if (CMS_DATABASE_SSL === 'false') {
    return false
  }

  return !/localhost|127\.0\.0\.1/i.test(CMS_DATABASE_URL)
}

function getPool() {
  if (!CMS_DATABASE_URL) {
    throw new Error('CMS_DATABASE_URL or CHAT_DATABASE_URL is not configured')
  }

  if (!pool) {
    pool = new Pool({
      connectionString: CMS_DATABASE_URL,
      ssl: shouldUseSsl() ? { rejectUnauthorized: false } : undefined,
    })
  }

  return pool
}

function toIso(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return new Date(value).toISOString()
}

async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const currentPool = getPool()

      await currentPool.query(`
        CREATE TABLE IF NOT EXISTS cms_state (
          id TEXT PRIMARY KEY,
          payload JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );

        CREATE TABLE IF NOT EXISTS cms_media (
          filename TEXT PRIMARY KEY,
          content_type TEXT NOT NULL,
          size INTEGER NOT NULL,
          bytes BYTEA NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL
        );

        CREATE INDEX IF NOT EXISTS cms_media_updated_at_idx
          ON cms_media (updated_at DESC);
      `)
    })()
  }

  await schemaReady
}

export async function readCmsState(): Promise<CmsState> {
  await ensureSchema()
  const currentPool = getPool()

  const result = await currentPool.query<CmsStateRow>(
    `
      SELECT payload
      FROM cms_state
      WHERE id = 'site'
      LIMIT 1
    `
  )

  if (result.rowCount) {
    return resolveCmsState(result.rows[0].payload)
  }

  const fallback = createDefaultCmsState()
  await currentPool.query(
    `
      INSERT INTO cms_state (id, payload, updated_at)
      VALUES ('site', $1::jsonb, $2)
      ON CONFLICT (id) DO NOTHING
    `,
    [JSON.stringify(fallback), fallback.updatedAt]
  )

  return fallback
}

export async function writeCmsState(input: Partial<CmsState>): Promise<CmsState> {
  await ensureSchema()
  const currentPool = getPool()
  const current = await readCmsState().catch(() => createDefaultCmsState())
  const merged = resolveCmsState({
    ...current,
    ...input,
    activeTemplate: input.activeTemplate ?? current.activeTemplate,
    content: input.content ?? current.content,
    updatedAt: new Date().toISOString(),
  })

  await currentPool.query(
    `
      INSERT INTO cms_state (id, payload, updated_at)
      VALUES ('site', $1::jsonb, $2)
      ON CONFLICT (id)
      DO UPDATE SET
        payload = EXCLUDED.payload,
        updated_at = EXCLUDED.updated_at
    `,
    [JSON.stringify(merged), merged.updatedAt]
  )

  return merged
}

export async function listCmsMediaFiles(): Promise<CmsMediaFile[]> {
  await ensureSchema()
  const currentPool = getPool()
  const result = await currentPool.query<Omit<CmsMediaRow, 'bytes'>>(
    `
      SELECT filename, content_type, size, updated_at
      FROM cms_media
      ORDER BY updated_at DESC
    `
  )

  return sortCmsMediaFiles(
    result.rows.map((row) => ({
      name: row.filename,
      url: buildDatabaseCmsMediaUrl(row.filename),
      size: Number(row.size ?? 0),
      updatedAt: toIso(row.updated_at),
      contentType: row.content_type || getCmsMediaContentType(row.filename),
    }))
  )
}

export async function saveCmsMediaFile(input: SaveCmsMediaInput): Promise<CmsMediaFile> {
  await ensureSchema()
  const currentPool = getPool()
  const originalName = path.basename(input.originalName)
  const extension = path.extname(originalName).toLowerCase()
  const baseName = sanitizeCmsMediaBaseName(path.basename(originalName, extension)) || 'media'
  const filename = `${baseName}-${randomUUID().slice(0, 8)}${extension}`
  const updatedAt = new Date().toISOString()
  const contentType = input.contentType || getCmsMediaContentType(filename)

  await currentPool.query(
    `
      INSERT INTO cms_media (filename, content_type, size, bytes, updated_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [filename, contentType, input.buffer.byteLength, input.buffer, updatedAt]
  )

  return {
    name: filename,
    url: buildDatabaseCmsMediaUrl(filename),
    size: input.buffer.byteLength,
    updatedAt,
    contentType,
  }
}

export async function readCmsMediaFile(filename: string): Promise<CmsMediaRecord | null> {
  await ensureSchema()
  const currentPool = getPool()
  const safeName = path.basename(filename)
  const result = await currentPool.query<CmsMediaRow>(
    `
      SELECT filename, content_type, size, bytes, updated_at
      FROM cms_media
      WHERE filename = $1
      LIMIT 1
    `,
    [safeName]
  )

  if (!result.rowCount) {
    return null
  }

  const row = result.rows[0]

  return {
    name: row.filename,
    url: buildDatabaseCmsMediaUrl(row.filename),
    size: Number(row.size ?? 0),
    updatedAt: toIso(row.updated_at),
    contentType: row.content_type || getCmsMediaContentType(row.filename),
    buffer: Buffer.isBuffer(row.bytes) ? row.bytes : Buffer.from(row.bytes),
  }
}

export async function deleteCmsMediaFile(filename: string) {
  await ensureSchema()
  const currentPool = getPool()
  const safeName = path.basename(filename)
  const result = await currentPool.query(
    `
      DELETE FROM cms_media
      WHERE filename = $1
    `,
    [safeName]
  )

  if (!result.rowCount) {
    throw new Error('Media file not found')
  }
}
