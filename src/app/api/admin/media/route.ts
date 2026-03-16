import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { CMS_AUTH_COOKIE, createSessionValue } from '@/lib/admin-auth'
import { ALLOWED_MEDIA_EXTENSIONS, getCmsMediaContentType } from '@/lib/cms-media-utils'
import { deleteCmsMediaFile, listCmsMediaFiles, saveCmsMediaFile } from '@/lib/cms-store'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const session = request.cookies.get(CMS_AUTH_COOKIE)?.value
  return session === createSessionValue()
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const media = await listCmsMediaFiles()
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

  if (!ALLOWED_MEDIA_EXTENSIONS.has(extension)) {
    return NextResponse.json({ error: 'Filtype ikke tilladt' }, { status: 400 })
  }

  const bytes = await input.arrayBuffer()
  const maxBytes = 50 * 1024 * 1024

  if (bytes.byteLength > maxBytes) {
    return NextResponse.json({ error: 'Filen er for stor (max 50MB)' }, { status: 400 })
  }

  const file = await saveCmsMediaFile({
    originalName: input.name,
    contentType: input.type?.trim() || getCmsMediaContentType(input.name),
    buffer: Buffer.from(bytes),
  })

  return NextResponse.json({
    file,
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
  try {
    await deleteCmsMediaFile(filename)
  } catch {
    return NextResponse.json({ error: 'Filen blev ikke fundet' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
