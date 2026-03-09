import { randomUUID } from 'crypto'
import { promises as fs } from 'fs'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { CMS_AUTH_COOKIE, createSessionValue } from '@/lib/admin-auth'

export const runtime = 'nodejs'

const UPLOAD_DIRECTORY = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.mp4', '.webm', '.mov', '.m4v'])

function isAuthorized(request: NextRequest) {
  const session = request.cookies.get(CMS_AUTH_COOKIE)?.value
  return session === createSessionValue()
}

function sanitizeBaseName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function ensureUploadDirectory() {
  await fs.mkdir(UPLOAD_DIRECTORY, { recursive: true })
}

async function listMediaFiles() {
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
          url: `/uploads/${entry.name}`,
          size: stats.size,
          updatedAt: stats.mtime.toISOString(),
        }
      })
  )

  return items.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const media = await listMediaFiles()
  return NextResponse.json({ media })
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const input = formData.get('file')

  if (!(input instanceof File)) {
    return NextResponse.json({ error: 'Ingen fil fundet' }, { status: 400 })
  }

  const extension = path.extname(input.name).toLowerCase()

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return NextResponse.json({ error: 'Filtype ikke tilladt' }, { status: 400 })
  }

  const bytes = await input.arrayBuffer()
  const maxBytes = 50 * 1024 * 1024

  if (bytes.byteLength > maxBytes) {
    return NextResponse.json({ error: 'Filen er for stor (max 50MB)' }, { status: 400 })
  }

  await ensureUploadDirectory()

  const base = sanitizeBaseName(path.basename(input.name, extension)) || 'media'
  const filename = `${base}-${randomUUID().slice(0, 8)}${extension}`
  const targetPath = path.join(UPLOAD_DIRECTORY, filename)

  await fs.writeFile(targetPath, Buffer.from(bytes))

  return NextResponse.json({
    file: {
      name: filename,
      url: `/uploads/${filename}`,
      size: bytes.byteLength,
    },
  })
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const filename = searchParams.get('file')

  if (!filename) {
    return NextResponse.json({ error: 'Filnavn mangler' }, { status: 400 })
  }

  const safeName = path.basename(filename)
  const targetPath = path.join(UPLOAD_DIRECTORY, safeName)

  try {
    await fs.unlink(targetPath)
  } catch {
    return NextResponse.json({ error: 'Filen blev ikke fundet' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
