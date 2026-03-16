import { NextRequest, NextResponse } from 'next/server'
import { readCmsMediaFile } from '@/lib/cms-store'

export const runtime = 'nodejs'

type MediaRouteContext = {
  params: {
    filename: string
  }
}

function buildHeaders(contentType: string, size: number) {
  return {
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Length': String(size),
    'Content-Type': contentType,
  }
}

function parseRangeHeader(value: string, size: number) {
  const match = /^bytes=(\d*)-(\d*)$/i.exec(value.trim())

  if (!match) {
    return null
  }

  const [, rawStart, rawEnd] = match
  const start = rawStart ? Number(rawStart) : NaN
  const end = rawEnd ? Number(rawEnd) : NaN

  if (!Number.isNaN(start) && !Number.isNaN(end)) {
    if (start > end || end >= size) {
      return null
    }

    return { start, end }
  }

  if (!Number.isNaN(start)) {
    if (start >= size) {
      return null
    }

    return { start, end: size - 1 }
  }

  if (!Number.isNaN(end)) {
    const chunkSize = Math.min(end, size)
    return { start: size - chunkSize, end: size - 1 }
  }

  return null
}

export async function GET(request: NextRequest, { params }: MediaRouteContext) {
  const media = await readCmsMediaFile(params.filename)

  if (!media) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const rangeHeader = request.headers.get('range')
  const body = new Uint8Array(media.buffer)

  if (!rangeHeader) {
    return new NextResponse(body, {
      status: 200,
      headers: buildHeaders(media.contentType, body.byteLength),
    })
  }

  const range = parseRangeHeader(rangeHeader, media.buffer.byteLength)

  if (!range) {
    return new NextResponse(null, {
      status: 416,
      headers: {
        ...buildHeaders(media.contentType, media.buffer.byteLength),
        'Content-Range': `bytes */${media.buffer.byteLength}`,
      },
    })
  }

  const chunk = body.subarray(range.start, range.end + 1)

  return new NextResponse(chunk, {
    status: 206,
    headers: {
      ...buildHeaders(media.contentType, chunk.byteLength),
      'Content-Range': `bytes ${range.start}-${range.end}/${media.buffer.byteLength}`,
    },
  })
}
