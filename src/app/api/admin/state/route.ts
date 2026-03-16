import { NextRequest, NextResponse } from 'next/server'
import { CMS_AUTH_COOKIE, createSessionValue } from '@/lib/admin-auth'
import { isCmsPersistentStorageConfigured, readCmsState, writeCmsState } from '@/lib/cms-store'
import { resolveSiteContent } from '@/lib/site-data'
import { DEFAULT_TEMPLATE_ID } from '@/lib/templates'

export const runtime = 'nodejs'

function isAuthorized(request: NextRequest) {
  const session = request.cookies.get(CMS_AUTH_COOKIE)?.value
  return session === createSessionValue()
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const state = await readCmsState()
    return NextResponse.json(state)
  } catch {
    return NextResponse.json({ error: 'CMS-data kunne ikke indlaeses.' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Ugyldigt request format' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Body mangler' }, { status: 400 })
  }

  const source = body as Record<string, unknown>
  const nextContent = resolveSiteContent(source.content)

  try {
    const saved = await writeCmsState({
      activeTemplate: DEFAULT_TEMPLATE_ID,
      content: nextContent,
    })

    return NextResponse.json(saved)
  } catch {
    if (!isCmsPersistentStorageConfigured()) {
      return NextResponse.json(
        { error: 'Gemning paa Vercel kraever POSTGRES_URL, CMS_DATABASE_URL eller CHAT_DATABASE_URL.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ error: 'Gemning mislykkedes.' }, { status: 500 })
  }
}
